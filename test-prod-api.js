const https = require('https');

function request(options, body = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve({ statusCode: res.statusCode, headers: res.headers, data });
            });
        });
        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

async function testProdApi() {
    console.log('Testing specific deployment API: https://foodpremios-83cf3bdci-talescarvalho2913-debugs-projects.vercel.app/api/pix/create');
    
    try {
        console.log('1. Trying to get a session cookie from /api/site/session...');
        const sessionRes = await request({
            hostname: 'foodpremios.vercel.app',
            port: 443,
            path: '/api/site/session',
            method: 'GET'
        });

        let cookies = [];
        if (sessionRes.headers['set-cookie']) {
            cookies = sessionRes.headers['set-cookie'].map(c => c.split(';')[0]);
        }
        
        console.log(`Session response: ${sessionRes.statusCode}, Cookies obtained: ${cookies.join('; ')}`);

        const payload = JSON.stringify({
            amount: 25.00,
            personal: {
                name: 'Teste da Silva',
                cpf: '12345678909',
                email: 'teste@exemplo.com',
                phone: '11999999999'
            },
            address: {
                cep: '01001-000',
                street: 'Praca da Se',
                neighborhood: 'Se',
                city: 'Sao Paulo',
                state: 'SP'
            },
            shipping: {
                id: 'express',
                name: 'Entrega Expressa',
                price: 15.00
            },
            sessionId: `test_session_${Date.now()}`
        });

        console.log('\n2. Triggering PIX creation...');
        const createRes = await request({
            hostname: 'foodpremios.vercel.app',
            port: 443,
            path: '/api/pix/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': payload.length,
                'Cookie': cookies.join('; ')
            }
        }, payload);

        console.log(`\nStatus Code: ${createRes.statusCode}`);
        try {
            const json = JSON.parse(createRes.data);
            console.log('\nSuccess! API Response:');
            console.log(JSON.stringify(json, null, 2));

            if (json.paymentCode) {
                console.log('\n✅ PIX Code successfully generated!');
                console.log('Gateway used:', json.gateway);
            } else {
                console.log('\n❌ Missing PIX Code in response.');
            }
        } catch (e) {
            console.error('\nError parsing response as JSON');
            console.error('Raw response:', createRes.data);
        }

    } catch (err) {
        console.error('Test error:', err);
    }
}

testProdApi();
