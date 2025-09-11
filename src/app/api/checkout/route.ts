
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { randomUUID } from 'crypto';

const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;
const FIXED_PRICE = 14.99;

if (!MERCADO_PAGO_ACCESS_TOKEN) {
    console.warn("MERCADO_PAGO_ACCESS_TOKEN não está configurado. Por favor, adicione sua chave para o checkout funcionar.");
}

const client = new MercadoPagoConfig({ 
    accessToken: MERCADO_PAGO_ACCESS_TOKEN!,
    options: { timeout: 5000, idempotencyKey: randomUUID() }
});

export async function POST(req: NextRequest) {
    if (!MERCADO_PAGO_ACCESS_TOKEN || MERCADO_PAGO_ACCESS_TOKEN === "SEU_TOKEN_AQUI") {
        return NextResponse.json({ error: 'Credenciais do Mercado Pago não configuradas no servidor.' }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { pageId, title, email, name, doc: contactDoc, phone } = body;

        if (!pageId || !title || !email || !name || !contactDoc || !phone) {
            return NextResponse.json({ error: 'Todos os campos são obrigatórios: pageId, title, email, name, doc, phone' }, { status: 400 });
        }
        
        const payment = new Payment(client);
        
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        
        // Correctly format date to ISO 8601 with timezone offset as required by Mercado Pago
        // Example: 2023-01-01T12:00:00.000-03:00
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 30);
        const expirationDateFormatted = expirationDate.toISOString().replace(/\.\d{3}Z$/, '-03:00');


        const nameParts = name.trim().split(' ');
        const firstName = nameParts.shift() || '';
        const lastName = nameParts.join(' ') || firstName;

        const paymentData = {
            transaction_amount: FIXED_PRICE,
            description: `Página Personalizada: ${title}`,
            payment_method_id: 'pix',
            payer: {
                email: email,
                first_name: firstName,
                last_name: lastName,
                identification: {
                    type: contactDoc.length === 11 ? 'CPF' : 'CNPJ',
                    number: contactDoc.replace(/\D/g, ''),
                },
                 address: {},
            },
            notification_url: `${baseUrl}/api/webhook/mercado-pago`,
            metadata: {
                page_id: pageId,
            },
            date_of_expiration: expirationDateFormatted,
        };

        const result = await payment.create({ 
            body: paymentData
        });
        
        const qrCodeBase64 = result.point_of_interaction?.transaction_data?.qr_code_base64;
        const qrCodeCopyPaste = result.point_of_interaction?.transaction_data?.qr_code;

        if (!qrCodeBase64 || !qrCodeCopyPaste) {
             console.error("Mercado Pago API response missing QR Code data:", result);
             return NextResponse.json({ 
                error: "A API do Mercado Pago retornou uma resposta OK, mas sem os dados completos do QR Code. Resposta completa abaixo.",
                details: result 
            }, { status: 500 });
        }

        const pixData = {
            qrCodeBase64: qrCodeBase64,
            qrCode: qrCodeCopyPaste,
        };

        return NextResponse.json({ pixData });

    } catch (error: any) {
        console.error('Falha crítica na API de checkout:', JSON.stringify(error, null, 2));

        if (error.cause) { 
            const errorDetails = error.cause.data || { message: error.message };
             console.error('Causa do erro da SDK do Mercado Pago:', errorDetails);
            return NextResponse.json({ 
                error: `Erro da API do Mercado Pago: ${errorDetails.message || 'Verifique os dados enviados.'}`,
                details: errorDetails
            }, { status: error.statusCode || 500 });
        }

        return NextResponse.json({ 
            error: 'Ocorreu um erro inesperado no servidor ao processar o pagamento.',
            details: error.message 
        }, { status: 500 });
    }
}

    