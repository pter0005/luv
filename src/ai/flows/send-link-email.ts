
'use server';

/**
 * @fileOverview An AI agent that sends a confirmation email to the user
 * with the link and QR code to their newly created page.
 *
 * - sendLinkEmail - A function that handles sending the email.
 * - SendLinkEmailInput - The input type for the sendLinkEmail function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Resend } from 'resend';

const SendLinkEmailInputSchema = z.object({
  name: z.string().describe('The name of the user to address in the email.'),
  email: z.string().email().describe('The email address of the recipient.'),
  pageId: z.string().describe('The unique ID of the created page.'),
  pageTitle: z.string().describe('The title of the created page.'),
});
export type SendLinkEmailInput = z.infer<typeof SendLinkEmailInputSchema>;

export async function sendLinkEmail(
  input: SendLinkEmailInput
): Promise<{ success: boolean }> {
  return sendLinkEmailFlow(input);
}

// NOTE: To enable email sending, you need to:
// 1. Get an API key from https://resend.com
// 2. Add the key to your environment variables as `RESEND_API_KEY`.
// 3. For production, purchase a custom domain and verify it on Resend.
//    Then, update the `from` field below to use your verified domain.

const sendLinkEmailFlow = ai.defineFlow(
  {
    name: 'sendLinkEmailFlow',
    inputSchema: SendLinkEmailInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
  },
  async (input) => {
    const { name, email, pageId, pageTitle } = input;
    
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is not set. Skipping real email sending.");
        return { success: false };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/p/${pageId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pageUrl)}`;

    console.log(`Sending real email to ${email} for page ${pageId}`);

    try {
      await resend.emails.send({
        // For production, use your own verified domain, e.g., 'Luv <contato@seu-dominio.com>'
        from: 'Luv <contato@criarcomluv.site>',
        to: [email],
        subject: `Sua página especial "${pageTitle}" está pronta!`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
              <h2 style="color: #6d28d9;">Olá, ${name}!</h2>
              <p>Sua página personalizada, "<strong>${pageTitle}</strong>", foi criada com sucesso e está pronta para encantar!</p>
              <p>Você pode acessá-la e compartilhá-la usando o link exclusivo abaixo:</p>
              <p style="text-align: center; margin: 25px 0;">
                <a href="${pageUrl}" style="background-color: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Ver minha página</a>
              </p>
              <p>Para uma surpresa ainda mais criativa, use o QR Code. Perfeito para imprimir em um cartão ou presente:</p>
              <div style="text-align: center; margin-top: 20px; margin-bottom: 20px;">
                <img src="${qrCodeUrl}" alt="QR Code da sua página" style="border: 1px solid #eee; padding: 5px; border-radius: 8px;"/>
              </div>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;" />
              <p style="font-size: 0.9em; color: #64748b;">Atenciosamente,<br>Equipe Luv</p>
            </div>
          </div>
        `,
      });
      console.log('Successfully sent email to:', email);
      return { success: true };
    } catch (error) {
      console.error('Resend API error:', error);
      // We don't throw an error here to avoid blocking the user flow,
      // but we return success: false so it can be handled if needed.
      return { success: false };
    }
  }
);
