
'use server';

import { z } from 'zod';
import { prepareAndSendEmail } from '@/ai/flows/send-link-email';
import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db');

// Helper para garantir que o diretório do 'banco de dados' exista
async function ensureDbDirectory(): Promise<void> {
  try {
    await fs.access(dbPath);
  } catch {
    await fs.mkdir(dbPath, { recursive: true });
  }
}

// Helper para ler o arquivo de uma página
async function readPageFile(pageId: string): Promise<any | null> {
  await ensureDbDirectory();
  const filePath = path.join(dbPath, `${pageId}.json`);
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return null; // Arquivo não existe
  }
}

// Helper para escrever no arquivo de uma página
async function writePageFile(pageId: string, data: any): Promise<void> {
  await ensureDbDirectory();
  const filePath = path.join(dbPath, `${pageId}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}


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
  contactDoc: z.string().min(11, "O CPF/CNPJ é obrigatório."),
  plan: z.string().min(1, "Você deve escolher uma opção."),
  heroVideoUrl: z.string().optional(),
});


type FormData = z.infer<typeof formSchema>;

export async function uploadVideo(file: File): Promise<string> {
    // This is a mock function. In a real app, you'd upload to a service like S3 or Firebase Storage.
    console.log(`Uploading video: ${file.name}`);
    // Simulate a delay and return a fake URL
    await new Promise(res => setTimeout(res, 1000));
    const fakeUrl = `https://fake-video-storage.com/${Date.now()}-${file.name}`;
    console.log(`Video uploaded to ${fakeUrl}`);
    return fakeUrl;
}


export async function savePageData(data: FormData): Promise<string> {
  try {
    const pageId = Date.now().toString();
    const status = data.plan === 'essencial' ? 'pending_payment' : 'pending_quote';
    
    const pageDataForDb = {
      ...data,
      status: status,
      createdAt: new Date(),
    };
    
    await writePageFile(pageId, pageDataForDb);
    console.log('Document written with ID: ', pageId);
    return pageId;

  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Failed to save page data.');
  }
}

export async function updatePageStatus(pageId: string, status: 'paid' | 'pending_payment' | 'pending_quote'): Promise<boolean> {
    try {
        const pageData = await readPageFile(pageId);
        if (!pageData) {
            console.error(`Page with ID ${pageId} not found for status update.`);
            return false;
        }

        if (pageData.status === status) {
            return true; // No change needed
        }

        pageData.status = status;
        await writePageFile(pageId, pageData);
        console.log(`Page ${pageId} status updated to ${status}.`);
        return true;
    } catch (error) {
        console.error(`Error updating status for page ${pageId}:`, error);
        return false;
    }
}


export async function confirmPaymentAndSendEmail(pageId: string) {
    try {
        const pageData = await readPageFile(pageId);

        if (!pageData) {
            console.error(`Page with ID ${pageId} not found.`);
            return { success: false, message: 'Page not found.' };
        }
        
        if (pageData.status === 'paid') {
            console.log(`Payment for page ${pageId} has already been processed.`);
            // Even if paid, maybe email failed. Let's try sending again if needed, but for now, we'll assume it's done.
            return { success: true, message: 'Already paid.' };
        }
        
        await updatePageStatus(pageId, 'paid');

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
        const data = await readPageFile(id);
        if (data) {
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

// This function is no longer relevant as there are no users.
export async function getPagesByUserId(userId: string) {
  return [];
}
