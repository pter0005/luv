
import { confirmPaymentAndSendEmail, updatePageStatus } from '@/actions/page';
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;


if (!MERCADO_PAGO_ACCESS_TOKEN) {
    console.warn("MERCADO_PAGO_ACCESS_TOKEN não está configurado. O webhook não funcionará.");
}

const client = new MercadoPagoConfig({ accessToken: MERCADO_PAGO_ACCESS_TOKEN! });

export async function POST(req: NextRequest) {
    if (!MERCADO_PAGO_ACCESS_TOKEN) {
        return NextResponse.json({ error: 'Credenciais do Mercado Pago não configuradas.' }, { status: 500 });
    }

    try {
        const body = await req.json();
        console.log("Webhook received:", body);

        if (body.type === 'payment' && body.data?.id) {
            const paymentId = body.data.id;
            
            const payment = new Payment(client);
            const paymentInfo = await payment.get({ id: paymentId });

            console.log("Payment info:", paymentInfo);

            if (paymentInfo && paymentInfo.status === 'approved' && paymentInfo.metadata) {
                const pageId = paymentInfo.metadata.page_id;
                if (pageId) {
                    console.log(`Processing payment for pageId: ${pageId}`);
                    const result = await confirmPaymentAndSendEmail(pageId.toString());
                    console.log(`Successfully processed pageId: ${pageId}`, result);
                } else {
                    console.error("page_id not found in payment metadata");
                }
            }
        }

        return NextResponse.json({ status: 'ok' });

    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
    }
}
