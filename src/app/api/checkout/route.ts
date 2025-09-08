
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { config } from 'dotenv';

config(); // Carrega as variáveis de ambiente do arquivo .env

const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;
const FIXED_PRICE = 14.99;

if (!MERCADO_PAGO_ACCESS_TOKEN) {
    console.warn("MERCADO_PAGO_ACCESS_TOKEN is not set in environment variables.");
}

const client = new MercadoPagoConfig({ 
    accessToken: MERCADO_PAGO_ACCESS_TOKEN!,
    options: { timeout: 5000, idempotencyKey: 'abc' }
});

export async function POST(req: NextRequest) {
    if (!MERCADO_PAGO_ACCESS_TOKEN) {
        return NextResponse.json({ error: 'Mercado Pago credentials not configured.' }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { pageId, title, email } = body;

        if (!pageId || !title || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        const preference = new Preference(client);

        const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const baseUrl = `${protocol}://${host}`;

        const result = await preference.create({
            body: {
                items: [
                    {
                        id: pageId,
                        title: `Página Personalizada: ${title}`,
                        quantity: 1,
                        unit_price: FIXED_PRICE,
                        description: 'Acesso à página personalizada Luv.',
                    },
                ],
                payer: {
                    email: email, // Sempre usar o e-mail real do cliente
                },
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

        return NextResponse.json({ id: result.id, init_point: result.init_point });

    } catch (error: any) {
        console.error('Mercado Pago API error:', error);
        const errorMessage = error?.cause?.message || 'Failed to create payment preference';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
