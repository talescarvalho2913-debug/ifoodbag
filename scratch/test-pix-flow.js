const dotenv = require('dotenv');
dotenv.config();

const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const SESSION_COOKIE_FALLBACK = 'ifb_session';
const APP_GUARD_SECRET = process.env.APP_GUARD_SECRET || 'change-this-secret-in-production';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function uaHash(ua) {
    return crypto.createHash('sha256').update(ua).digest('hex').slice(0, 32);
}

function sign(input) {
    return crypto.createHmac('sha256', APP_GUARD_SECRET).update(input).digest('base64url');
}

function generateMockSessionCookie(host, ua) {
    const payload = {
        h: host,
        ua: uaHash(ua),
        t: Date.now()
    };
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = sign(encodedPayload);
    const token = `${encodedPayload}.${signature}`;
    return `${SESSION_COOKIE_FALLBACK}=${encodeURIComponent(token)}`;
}

async function testPixFlow() {
    const host = 'localhost';
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const mockCookie = generateMockSessionCookie(host, ua);

    const sessionId = 'session-test-' + Date.now();
    const payload = {
        amount: '19.90',
        personal: {
            name: 'Manoel Leonardo',
            cpf: '111.111.111-11',
            email: 'leo.teste@gmail.com',
            phone: '11999999999'
        },
        address: {
            zipCode: '01001-000',
            street: 'Praca da Se',
            neighborhood: 'Se',
            city: 'Sao Paulo',
            state: 'SP'
        },
        utm: {
            utm_source: 'fb_ad',
            utm_medium: 'cpc',
            utm_campaign: 'blackfriday',
            fbclid: 'IwAR3test_fbclid_1234567890'
        },
        sessionId: sessionId,
        gateway: 'atomopay'
    };

    console.log(`Sending mock checkout request to local server... (Session: ${sessionId})`);

    try {
        const response = await fetch(`http://localhost:${PORT}/api/pix/create`, {
            method: 'POST',
            headers: {
                'Host': 'localhost:3000',
                'Content-Type': 'application/json',
                'User-Agent': ua,
                'Cookie': mockCookie
            },
            body: JSON.stringify(payload)
        });

        console.log(`HTTP Status: ${response.status}`);
        const result = await response.json();
        console.log('API Response:', JSON.stringify(result, null, 2));

        if (!response.ok) {
            console.error('API Call Failed!');
            return;
        }

        const txid = result.idTransaction;
        console.log('\nPIX GENERATION VIA ATOMOPAY SUCCESSFUL!');
        console.log(`Transaction ID: ${txid}`);
        console.log(`PIX Copy-Paste Code: ${result.paymentCode.slice(0, 80)}...`);

        console.log('\nQuerying Supabase Dispatch Queue to verify enqueued events...');
        const queueUrl = `${SUPABASE_URL}/rest/v1/event_dispatch_queue?payload->>txid=eq.${txid}`;
        
        // Wait a small moment for enqueuing to record completely
        await new Promise(resolve => setTimeout(resolve, 3000));

        const queueResponse = await fetch(queueUrl, {
            headers: {
                apikey: SUPABASE_SERVICE_ROLE_KEY,
                Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
            }
        });

        if (queueResponse.ok) {
            const queueItems = await queueResponse.json();
            console.log(`\nFound ${queueItems.length} enqueued events in Supabase for txid ${txid}:`);
            queueItems.forEach((item, index) => {
                console.log(`\n--- Event #${index + 1} ---`);
                console.log(`Channel: ${item.channel}`);
                console.log(`Event Name: ${item.event_name}`);
                console.log(`Status: ${item.status}`);
                console.log('Payload Snippet:', JSON.stringify(item.payload, null, 2));
            });
        } else {
            console.error('Failed to query Supabase queue table:', await queueResponse.text());
        }

    } catch (error) {
        console.error('Flow Execution Failed:', error);
    }
}

testPixFlow();
