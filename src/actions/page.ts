
'use server';

import { z } from 'zod';
import { prepareAndSendEmail } from '@/ai/flows/send-link-email';
import { doc, setDoc, getDoc, collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// This is a generic type for form data, as we have multiple form structures.
// The validation happens on the client-side with Zod. Here, we accept a flexible object.
type FormData = { [key: string]: any };

// Helper to convert Firebase Timestamps to serializable strings for client-side use.
const toJSON = (data: any) => {
  if (!data) return data;
  // Firestore data is often nested. We need a recursive conversion.
  const isObject = (val: any) => val && typeof val === 'object' && !Array.isArray(val);

  const convertTimestamps = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return obj;
    if (obj instanceof Timestamp) return obj.toDate().toISOString();

    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          if (value instanceof Timestamp) {
            newObj[key] = value.toDate().toISOString();
          } else if (isObject(value)) {
            newObj[key] = convertTimestamps(value); // Recurse for nested objects
          } else if (Array.isArray(value)) {
            newObj[key] = value.map(item => convertTimestamps(item)); // Recurse for arrays
          } else {
            newObj[key] = value;
          }
      }
    }
    return newObj;
  };
  
  return JSON.parse(JSON.stringify(convertTimestamps(data)));
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
    if (!userId) {
        throw new Error('User ID is missing.');
    }
      
    const pageId = Date.now().toString();
    const status = data.plan === 'essencial' ? 'pending_payment' : 'pending_quote';
    
    const pageDataForDb: { [key: string]: any } = {
      userId: userId,
      status: status,
      createdAt: Timestamp.now(),
      title: data.title,
      titleColor: data.titleColor,
      message: data.message,
      messageFontSize: data.messageFontSize,
      photos: data.photos || [],
      photoDisplayType: data.photoDisplayType,
      musicChoice: data.musicChoice,
      musicUrl: data.musicUrl,
      customAudio: data.customAudio,
      backgroundAnimation: data.backgroundAnimation,
      heartColor: data.heartColor,
      loveLightColor: data.loveLightColor,
      unlockType: data.unlockType,
      puzzleImage: data.puzzleImage,
      puzzleTitle: data.puzzleTitle,
      puzzleDescription: data.puzzleDescription,
      plan: data.plan,
      contactEmail: data.contactEmail,
      contactName: data.contactName,
      contactDoc: data.contactDoc,
      contactPhone: data.contactPhone,
      template: data.template,
      heroType: data.heroType,
      heroImage: data.heroImage,
      heroVideoUrl: data.heroVideoUrl,
      heroTitle: data.heroTitle,
      heroDescription: data.heroDescription,
      categories: data.categories,
      dateDisplayType: data.dateDisplayType,
    };

    if (data.startDate && typeof data.startDate === 'string') {
      const date = new Date(data.startDate);
      if (!isNaN(date.getTime())) {
        pageDataForDb.startDate = Timestamp.fromDate(date);
      }
    }
    
    // Remove undefined fields before saving
    Object.keys(pageDataForDb).forEach(key => {
      if (pageDataForDb[key] === undefined) {
        delete pageDataForDb[key];
      }
    });
    
    await setDoc(doc(db, "pages", pageId), pageDataForDb);
    
    console.log('Document written with ID: ', pageId);
    return pageId;

  } catch (e: any) {
    console.error('CRITICAL: Error adding document in savePageData. Raw Error:', e);
    console.error('Error Details (if available):', e.details);
    console.error('Data that failed:', JSON.stringify(data, null, 2));
    throw new Error(e.message || 'Failed to save page data due to a server error.');
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
      pages.push({ id: doc.id, ...toJSON(doc.data()) });
    });
    return pages;
  } catch (error) {
    console.error("Error getting pages by user ID:", error);
    return [];
  }
}

    