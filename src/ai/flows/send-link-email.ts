
'use server';

/**
 * @fileOverview An agent that sends a confirmation email to the user
 * using Nodemailer with a Gmail account.
 *
 * - prepareAndSendEmail - A function that handles adding the email to the queue.
 * - SendLinkEmailInput - The input type for the prepareAndSendEmail function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as nodemailer from 'nodemailer';

const SendLinkEmailInputSchema = z.object({
  name: z.string().describe('The name of the user to address in the email.'),
  email: z.string().email().describe('The email address of the recipient.'),
  pageId: z.string().describe('The unique ID of the created page.'),
  pageTitle: z.string().describe('The title of the created page.'),
});
export type SendLinkEmailInput = z.infer<typeof SendLinkEmailInputSchema>;

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function prepareAndSendEmail(
  input: SendLinkEmailInput
): Promise<{ success: boolean }> {
  return sendNodemailerEmailFlow(input);
}

const sendNodemailerEmailFlow = ai.defineFlow(
  {
    name: 'sendNodemailerEmailFlow',
    inputSchema: SendLinkEmailInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async (input) => {
    const { name, email, pageId, pageTitle } = input;
    
    if (!GMAIL_USER || !GMAIL_PASS) {
        console.error('Credenciais do Gmail não configuradas. Por favor, adicione seu e-mail e senha de aplicativo no arquivo .env');
        return { success: false };
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_PASS, // This should be an App Password
        },
    });

    const pageUrl = `${NEXT_PUBLIC_BASE_URL}/p/${pageId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pageUrl)}`;

    try {
      await transporter.sendMail({
        from: `"Luv" <${GMAIL_USER}>`,
        to: email,
        subject: `Sua página especial "${pageTitle}" está pronta!`,
        html: `
            <div style="font-family: Poppins, Arial, sans-serif; line-height: 1.6; color: #e5e7eb; background-color: #0f0721; padding: 20px;">
              <div style="max-width: 600px; margin: auto; padding: 30px; background-color: #1c1139; border: 1px solid #4a2f8c; border-radius: 12px;">
                <h2 style="font-family: 'Playfair Display', serif; color: #c084fc; text-align: center; font-size: 28px;">Olá, ${name}!</h2>
                <p style="text-align: center; font-size: 16px; color: #d1d5db;">Parabéns! Sua página personalizada "<strong>${pageTitle}</strong>" foi criada com sucesso e está pronta para encantar!</p>
                <p style="text-align: center; font-size: 16px; color: #d1d5db;">Você pode acessá-la e compartilhá-la usando o link exclusivo abaixo:</p>
                <p style="text-align: center; margin: 30px 0;">
                  <a href="${pageUrl}" style="background: linear-gradient(to right, #a855f7, #d946ef); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Ver Minha Página</a>
                </p>
                <p style="text-align: center; font-size: 16px; color: #d1d5db;">Para uma surpresa ainda mais criativa, use o QR Code. Perfeito para imprimir em um cartão ou presente:</p>
                <div style="text-align: center; margin-top: 20px; margin-bottom: 20px; background-color: #ffffff; padding: 10px; border-radius: 8px; display: inline-block;">
                  <img src="${qrCodeUrl}" alt="QR Code da sua página" style="border: none;"/>
                </div>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #4a2f8c;" />
                <p style="font-size: 0.9em; color: #9ca3af; text-align: center;">Atenciosamente,<br>Equipe Luv</p>
              </div>
            </div>
          `,
      });
      console.log('Confirmation email sent successfully via Nodemailer to:', email);
      return { success: true };
    } catch (error) {
      console.error('Error sending email via Nodemailer:', error);
      return { success: false };
    }
  }
);

