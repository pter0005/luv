
'use server';

import { z } from 'zod';
import { prepareAndSendEmail } from '@/ai/flows/send-link-email';
import { doc, setDoc, getDoc, collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type FormData = any;

// Helper to convert Firebase Timestamps to serializable strings
const toJSON = (data: any) => {
  if (!data) return data;
  if (data.createdAt && data.createdAt.seconds) {
      data.createdAt = new Timestamp(data.createdAt.seconds, data.createdAt.nanoseconds).toDate().toISOString();
  }
  return JSON.parse(JSON.stringify(data, (key, value) => {
    if (value && value.seconds !== undefined && value.nanoseconds !== undefined) {
      // Check if it's a Firebase Timestamp-like object
      const date = new Timestamp(value.seconds, value.nanoseconds).toDate();
      return date.toISOString();
    }
    return value;
  }));
};

export async function uploadVideo(file: File): Promise<string> {
    // This is a mock function. In a real app, you'd upload to a service like S3 or Firebase Storage.
    console.log(`Uploading video: ${file.name}`);
    // Simulate a delay and return a fake URL
    await new Promise(res => setTimeout(res, 1000));
    const fakeUrl = `https://fake-video-storage.com/${Date.now()}-${file.name}`;
    console.log(`Video uploaded to ${fakeUrl}`);
    return fakeUrl;
}


export async function savePageData(data: FormData, userId: string): Promise<string> {
  try {
    const pageId = Date.now().toString();
    const status = data.plan === 'essencial' ? 'pending_payment' : 'pending_quote';
    
    // Create a mutable copy to avoid modifying the original data object
    const pageDataForDb = { ...data };

    // Convert JavaScript Date object to Firestore Timestamp if it exists
    if (pageDataForDb.startDate && pageDataForDb.startDate instanceof Date) {
        pageDataForDb.startDate = Timestamp.fromDate(pageDataForDb.startDate);
    } else if (pageDataForDb.startDate && typeof pageDataForDb.startDate === 'string') {
        // Handle case where date might be a string
        pageDataForDb.startDate = Timestamp.fromDate(new Date(pageDataForDb.startDate));
    }

    // Add server-side data
    pageDataForDb.userId = userId;
    pageDataForDb.status = status;
    pageDataForDb.createdAt = Timestamp.now(); // Use Firestore timestamp for creation
    
    await setDoc(doc(db, "pages", pageId), pageDataForDb);
    
    console.log('Document written with ID: ', pageId);
    return pageId;

  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Failed to save page data.');
  }
}

export async function updatePageStatus(pageId: string, status: 'paid' | 'pending_payment' | 'pending_quote'): Promise<boolean> {
    try {
        const pageRef = doc(db, "pages", pageId);
        const pageDoc = await getDoc(pageRef);
        if (!pageDoc.exists()) {
            console.error(`Page with ID ${pageId} not found for status update.`);
            return false;
        }

        const pageData = pageDoc.data();
        if (pageData.status === status) {
            return true; // No change needed
        }

        await setDoc(pageRef, { status: status }, { merge: true });
        console.log(`Page ${pageId} status updated to ${status}.`);
        return true;
    } catch (error) {
        console.error(`Error updating status for page ${pageId}:`, error);
        return false;
    }
}


export async function confirmPaymentAndSendEmail(pageId: string) {
    try {
        const pageRef = doc(db, "pages", pageId);
        const pageDoc = await getDoc(pageRef);

        if (!pageDoc.exists()) {
            console.error(`Page with ID ${pageId} not found.`);
            return { success: false, message: 'Page not found.' };
        }
        
        const pageData = pageDoc.data();

        if (pageData.status === 'paid') {
            console.log(`Payment for page ${pageId} has already been processed.`);
            return { success: true, message: 'Already paid.' };
        }
        
        await updatePageStatus(pageId, 'paid');

        if (pageData.contactEmail) {
            console.log(`Attempting to send email for page ${pageId} to ${pageData.contactEmail}`);
            await prepareAndSendEmail({
                name: pageData.contactName || 'Criador(a)',
                email: pageData.contactEmail,
                pageId: pageId,
                pageTitle: pageData.title || pageData.heroTitle,
            });
            console.log('Email process initiated for:', pageData.contactEmail);
            return { success: true, message: 'Payment confirmed and email sent.' };
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
        const pageRef = doc(db, "pages", id);
        const pageDoc = await getDoc(pageRef);

        if (pageDoc.exists()) {
            const data = pageDoc.data();
            // Convert any Firebase Timestamps to serializable strings before returning
            return toJSON(data);
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting document:", error);
        throw new Error("Failed to retrieve page data.");
    }
}

export async function getPagesByUserId(userId: string) {
  try {
    const q = query(collection(db, "pages"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const pages: any[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Convert any Firebase Timestamps to serializable strings
      const serializableData = toJSON(data);
      pages.push({ id: doc.id, ...serializableData });
    });
    return pages;
  } catch (error) {
    console.error("Error getting pages by user ID:", error);
    return [];
  }
}
