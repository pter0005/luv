
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, getDoc, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { z } from 'zod';
import { prepareAndSendEmail } from '@/ai/flows/send-link-email';

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),
  titleColor: z.string().optional(),
  message: z.string().optional(),
  messageFontSize: z.string().optional(),
  startDate: z.date().optional(),
  dateDisplayType: z.string().optional(),
  photos: z.array(z.string()).optional(),
  photoDisplayType: z.string().optional(),
  musicChoice: z.string().optional(),
  musicUrl: z.string().url("URL inválida.").optional().or(z.literal('')),
  customAudio: z.string().optional(),
  backgroundAnimation: z.string().optional(),
  heartColor: z.string().optional(),
  loveLightColor: z.string().optional(),
  unlockType: z.string().optional(),
  puzzleImage: z.string().optional(),
  puzzleTitle: z.string().optional(),
  puzzleDescription: z.string().optional(),
  contactName: z.string().min(1, "O nome é obrigatório."),
  contactEmail: z.string().email("Email inválido.").min(1, "O e-mail é obrigatório."),
  contactPhone: z.string().min(1, "O telefone é obrigatório."),
  plan: z.string().min(1, "Você deve escolher uma opção."),
});


type FormData = z.infer<typeof formSchema>;

export async function savePageData(data: FormData): Promise<string> {
  try {
    const status = data.plan === 'essencial' ? 'pending_payment' : 'pending_quote';
    
    const pageDataForDb: { [key: string]: any } = {
      ...data,
      status: status,
      createdAt: new Date(),
    };

    // Sanitize data for Firestore: convert undefined to null
    Object.keys(pageDataForDb).forEach(key => {
      if (pageDataForDb[key] === undefined) {
        pageDataForDb[key] = null;
      }
      if (pageDataForDb[key] === '') {
        pageDataForDb[key] = null;
      }
    });

    const docRef = await addDoc(collection(db, 'pages'), pageDataForDb);
    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Failed to save page data.');
  }
}

export async function confirmPaymentAndSendEmail(pageId: string) {
    try {
        const pageDocRef = doc(db, 'pages', pageId);
        const docSnap = await getDoc(pageDocRef);

        if (!docSnap.exists()) {
            console.error(`Page with ID ${pageId} not found.`);
            return { success: false, message: 'Page not found.' };
        }
        
        const pageData = docSnap.data();

        if (pageData.status === 'paid') {
            console.log(`Payment for page ${pageId} has already been confirmed.`);
            // Still try to send email in case it failed before
            if (pageData.contactEmail) {
                 await prepareAndSendEmail({
                    name: pageData.contactName || 'Criador(a)',
                    email: pageData.contactEmail,
                    pageId: pageId,
                    pageTitle: pageData.title!,
                });
                return { success: true, message: 'Already paid, email sent again.' };
            }
            return { success: true, message: 'Already paid.' };
        }
        
        await updateDoc(pageDocRef, { status: 'paid' });
        console.log(`Page ${pageId} status updated to paid.`);

        if (pageData.contactEmail) {
            console.log(`Attempting to send email for page ${pageId} to ${pageData.contactEmail}`);
            await prepareAndSendEmail({
                name: pageData.contactName || 'Criador(a)',
                email: pageData.contactEmail,
                pageId: pageId,
                pageTitle: pageData.title!,
            });
            console.log('Email process initiated for:', pageData.contactEmail);
            return { success: true };
        } else {
             return { success: false, message: 'No contact email found.' };
        }

    } catch (error) {
        console.error('Error confirming payment and sending email:', error);
        throw new Error('Failed to confirm payment.');
    }
}


export async function getPageData(id: string) {
    try {
        const docRef = doc(db, 'pages', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            // Firestore Timestamps need to be converted to JS Date objects
            if (data.startDate && typeof data.startDate.toDate === 'function') {
                data.startDate = data.startDate.toDate();
            }
             if (data.createdAt && typeof data.createdAt.toDate === 'function') {
                data.createdAt = data.createdAt.toDate();
            }
            return data;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting document:", error);
        throw new Error("Failed to retrieve page data.");
    }
}
