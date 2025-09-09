
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { randomUUID } from 'crypto';

const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;
const FIXED_PRICE = 14.99;

if (!MERCADO_PAGO_ACCESS_TOKEN) {
    console.warn("MERCADO_PAGO_ACCESS_TOKEN não está configurado. Por favor, adicione sua chave para o checkout funcionar.");
}

const client = new MercadoPagoConfig({ 
    accessToken: MERCADO_PAGO_ACCESS_TOKEN!,
    options: { timeout: 5000 }
});

export async function POST(req: NextRequest) {
    if (!MERCADO_PAGO_ACCESS_TOKEN || MERCADO_PAGO_ACCESS_TOKEN === "SEU_TOKEN_AQUI") {
        return NextResponse.json({ error: 'Credenciais do Mercado Pago não configuradas.' }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { pageId, title, email, name } = body;

        if (!pageId || !title || !email || !name) {
            return NextResponse.json({ error: 'Todos os campos são obrigatórios: pageId, title, email, name' }, { status: 400 });
        }
        
        const nameParts = name.trim().split(' ');
        const firstName = nameParts.shift() || '';
        const lastName = nameParts.join(' ') || firstName; // If no last name, use first name

        const preference = new Preference(client);
        
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 30);
        const expirationDateISO = expirationDate.toISOString().replace(/\.\d{3}Z$/, 'Z');
        
        const idempotencyKey = randomUUID();

        const result = await preference.create({
            body: {
                items: [
                    {
                        id: pageId,
                        title: `Página Personalizada: ${title}`,
                        quantity: 1,
                        unit_price: FIXED_PRICE,
                        currency_id: 'BRL',
                        description: 'Acesso à página personalizada Luv.',
                    },
                ],
                payer: {
                    email: email,
                    first_name: firstName,
                    last_name: lastName,
                },
                payment_methods: {
                    installments: 1,
                },
                purpose: 'wallet_purchase',
                date_of_expiration: expirationDateISO,
                back_urls: {
                    success: `${baseUrl}/criar/sucesso/${pageId}`,
                    failure: `${baseUrl}/criar/sucesso/${pageId}`,
                    pending: `${baseUrl}/criar/sucesso/${pageId}`,
                },
                auto_return: 'approved',
                notification_url: `${baseUrl}/api/webhook/mercado-pago?source_news=webhooks`,
                metadata: {
                    page_id: pageId,
                },
            },
             requestOptions: {
                idempotencyKey: idempotencyKey
            }
        });
        
        const qrCodeBase64 = result.point_of_interaction?.transaction_data?.qr_code_base64;
        
        if (!qrCodeBase64) {
             console.error("Mercado Pago API response missing QR Code:", result);
             return NextResponse.json({ 
                error: "A API do Mercado Pago retornou uma resposta OK, mas sem o QR Code. Resposta completa abaixo.",
                details: result 
            }, { status: 500 });
        }

        const pixData = {
            qrCodeBase64: qrCodeBase64,
            qrCode: result.point_of_interaction?.transaction_data?.qr_code,
        };

        return NextResponse.json({ pixData });

    } catch (error: any) {
        console.error('Mercado Pago API error:', error.cause ? error.cause : error);
        const errorMessage = error?.cause?.error?.message || error?.message || 'Failed to create payment preference';
        return NextResponse.json({ 
            error: `Erro do Mercado Pago: ${errorMessage}`,
            details: error.cause || error 
        }, { status: 500 });
    }
}
