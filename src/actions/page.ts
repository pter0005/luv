
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, getDoc, doc, updateDoc } from 'firebase/firestore';
import { z } from 'zod';
import { sendLinkEmail } from '@/ai/flows/send-link-email';

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
  contactName: z.string().optional(),
  contactEmail: z.string().email("Email inválido.").optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  plan: z.string().optional(),
  status: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export async function savePageData(data: Omit<FormData, 'status'>): Promise<string> {
  try {
    const pageData = {
      ...data,
      status: 'pending_payment',
      createdAt: new Date(),
    };
    const docRef = await addDoc(collection(db, 'pages'), pageData);
    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Failed to save page data.');
  }
}

export async function confirmPaymentAndSendEmail(pageId: string) {
    try {
        const docRef = doc(db, 'pages', pageId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const pageData = docSnap.data() as FormData;
            
            // Update status to 'paid'
            await updateDoc(docRef, { status: 'paid' });
            console.log(`Page ${pageId} status updated to paid.`);

            // Send the email if an email address is provided
            if (pageData.contactEmail) {
                await sendLinkEmail({
                    name: pageData.contactName || 'Criador(a)',
                    email: pageData.contactEmail,
                    pageId: docRef.id,
                    pageTitle: pageData.title!,
                });
                console.log('Confirmation email queued for sending to:', pageData.contactEmail);
                 return { success: true };
            }
             return { success: false, message: 'No contact email found.' };
        } else {
            console.error(`Page with ID ${pageId} not found.`);
             return { success: false, message: 'Page not found.' };
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
            return docSnap.data();
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting document:", error);
        throw new Error("Failed to retrieve page data.");
    }
}

    