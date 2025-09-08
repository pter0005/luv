
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { config } from 'dotenv';

config(); // Carrega as variáveis de ambiente do arquivo .env

const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

if (!MERCADO_PAGO_ACCESS_TOKEN) {
    console.warn("MERCADO_PAGO_ACCESS_TOKEN is not set in environment variables.");
}

const client = new MercadoPagoConfig({ 
    accessToken: MERCADO_PAGO_ACCESS_TOKEN!,
    options: { timeout: 5000, idempotencyKey: 'abc' }
});

const isTestUser = (token: string | undefined): boolean => {
    return !!token && (token.startsWith('TEST-') || token.startsWith('APP_USR-'));
}

export async function POST(req: NextRequest) {
    if (!MERCADO_PAGO_ACCESS_TOKEN) {
        return NextResponse.json({ error: 'Mercado Pago credentials not configured.' }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { pageId, title, price, email } = body;

        if (!pageId || !title || !price || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        const preference = new Preference(client);

        const payerEmail = isTestUser(MERCADO_PAGO_ACCESS_TOKEN) 
            ? 'test_user_12345678@testuser.com' 
            : email;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.get('host')}`;

        const result = await preference.create({
            body: {
                items: [
                    {
                        id: pageId,
                        title: `Página Personalizada: ${title}`,
                        quantity: 1,
                        unit_price: price,
                        description: 'Acesso à página personalizada Luv.',
                    },
                ],
                payer: {
                    email: payerEmail,
                },
                back_urls: {
                    success: `${baseUrl}/criar/sucesso/${pageId}?status=approved`,
                    failure: `${baseUrl}/criar/sucesso/${pageId}?status=failure`,
                    pending: `${baseUrl}/criar/sucesso/${pageId}?status=pending`,
                },
                auto_return: 'approved',
                notification_url: `${baseUrl}/api/webhook/mercado-pago`,
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
