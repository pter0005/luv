
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// ATENÇÃO: Substitua este valor pela sua Chave de Acesso do Mercado Pago
const MERCADO_PAGO_ACCESS_TOKEN = "APP_USR-6722629955338428-090901-5ab563981e2387cf18bda99246af2a36-1450048744";
const FIXED_PRICE = 14.99;

if (!MERCADO_PAGO_ACCESS_TOKEN || MERCADO_PAGO_ACCESS_TOKEN === "SEU_ACCESS_TOKEN_DO_MERCADO_PAGO") {
    console.warn("MERCADO_PAGO_ACCESS_TOKEN não está configurado. Por favor, adicione sua chave para o checkout funcionar.");
}

const client = new MercadoPagoConfig({ 
    accessToken: MERCADO_PAGO_ACCESS_TOKEN!,
    options: { timeout: 5000, idempotencyKey: 'abc' }
});

export async function POST(req: NextRequest) {
    if (!MERCADO_PAGO_ACCESS_TOKEN || MERCADO_PAGO_ACCESS_TOKEN === "SEU_ACCESS_TOKEN_DO_MERCADO_PAGO") {
        return NextResponse.json({ error: 'Credenciais do Mercado Pago não configuradas.' }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { pageId, title, email } = body;

        if (!pageId || !title || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        const preference = new Preference(client);
        
        const baseUrl = 'https://criarcomluv.site';

        // Definir a data de expiração para 30 minutos a partir de agora
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 30);
        const expirationDateISO = expirationDate.toISOString().replace(/\.\d{3}Z$/, 'Z');

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
                },
                payment_methods: {
                    excluded_payment_methods: [],
                    excluded_payment_types: [],
                    default_payment_method_id: 'pix',
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
        });

        const pixData = {
            qrCodeBase64: result.point_of_interaction?.transaction_data?.qr_code_base64,
            qrCode: result.point_of_interaction?.transaction_data?.qr_code,
        };

        return NextResponse.json({ pixData });

    } catch (error: any) {
        console.error('Mercado Pago API error:', error.cause ? error.cause : error);
        const errorMessage = error?.cause?.error || error?.message || 'Failed to create payment preference';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
