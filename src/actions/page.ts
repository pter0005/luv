
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
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
});

type FormData = z.infer<typeof formSchema>;

export async function savePageData(data: FormData): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'pages'), data);
    console.log('Document written with ID: ', docRef.id);

    // After saving, send the email if an email address is provided
    if (data.contactEmail) {
      try {
        await sendLinkEmail({
          name: data.contactName || 'Criador(a)',
          email: data.contactEmail,
          pageId: docRef.id,
          pageTitle: data.title,
        });
        console.log('Confirmation email queued for sending to:', data.contactEmail);
      } catch (emailError) {
        // Log the error but don't block the user flow
        console.error('Failed to send confirmation email:', emailError);
      }
    }

    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Failed to save page data.');
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
