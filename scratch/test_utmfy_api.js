const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
        const match = line.match(/^\s*([\w.\-_]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            const key = match[1];
            let value = match[2] || '';
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            process.env[key] = value;
        }
    });
}

const { getSettings } = require('../lib/settings-store');
const fetchFn = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function run() {
    const settings = await getSettings();
    const cfg = settings.utmfy || {};
    const apiKey = cfg.apiKey;
    const endpoint = cfg.endpoint;
    
    console.log('Using endpoint:', endpoint);
    console.log('Using apiKey:', apiKey);
    
    const buildOrder = (status) => ({
        orderId: `test_pending_${Date.now()}_${status}`,
        platform: 'IfoodBag',
        paymentMethod: 'pix',
        status: status,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        approvedDate: null,
        refundedAt: null,
        customer: {
            name: 'Teste Rastreamento UTMfy',
            email: 'teste.utmify@ifoodbag.app',
            phone: '11999999999',
            document: '12345678909',
            country: 'BR',
            ip: '127.0.0.1'
        },
        products: [
            {
                id: 'bag',
                name: 'Bag do iFood',
                planId: null,
                planName: null,
                quantity: 1,
                priceInCents: 1500
            }
        ],
        trackingParameters: {
            src: 'teste_src',
            sck: 'teste_sck',
            utm_source: 'teste_source',
            utm_campaign: 'teste_campaign',
            utm_medium: 'teste_medium',
            utm_content: 'teste_content',
            utm_term: 'teste_term',
            fbclid: 'IwZXh0bgNhZW0BMABhZGlkAaszRfO3NihzcnRjBmFwcF9pZAwzNTA2ODU1MzE3MjgAAR6WcUFsZ3T_BWooCby3350Rsn8KTuHXZAe48RCCH8Hs0KF95FKItD49Fb6-Kg',
            ttclid: ''
        },
        commission: {
            totalPriceInCents: 1500,
            gatewayFeeInCents: 100,
            userCommissionInCents: 1400,
            currency: 'BRL'
        },
        isTest: true
    });

    for (const status of ['waiting_payment', 'pending']) {
        console.log(`\nTesting status: "${status}"...`);
        const payload = buildOrder(status);
        const headers = {
            'Content-Type': 'application/json',
            'x-api-token': apiKey
        };
        
        const res = await fetchFn(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });
        
        console.log(`Status Code for "${status}":`, res.status);
        const responseText = await res.text();
        console.log('Response:', responseText);
    }
}

run().catch(console.error);
