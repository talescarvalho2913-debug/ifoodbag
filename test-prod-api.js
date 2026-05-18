const https = require('https');

async function testProdApi() {
    const VERCEL_URL = 'foodpremios.vercel.app';
    console.log(`Testing production API: https://${VERCEL_URL}/api/pix/create`);
    
    try {
        console.log('1. Trying to get a session cookie from /api/site/session...');
        const sessionReq = await new Promise((resolve, reject) => {
            const req = https.request({
                hostname: VERCEL_URL,
                port: 443,
                path: '/api/site/session',
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
                }
            }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data
                    });
                });
            });
            req.on('error', reject);
            req.end();
        });

        const cookies = sessionReq.headers['set-cookie'] || [];
        const sessionCookie = cookies.find(c => c.startsWith('__Host-ifb_session='));
        console.log(`Session response: ${sessionReq.statusCode}, Cookies obtained: ${sessionCookie ? sessionCookie.split(';')[0] : 'None'}`);

        console.log('\n2. Triggering PIX creation...');
        
        const payload = JSON.stringify({
            amount: 15.00,
            personal: { name: 'Teste da Silva', cpf: '12345678909', email: 'teste@exemplo.com', phone: '11999999999' },
            address: { cep: '01001-000', street: 'Praca da Se', neighborhood: 'Se', city: 'Sao Paulo', state: 'SP' },
            shipping: { id: 'express', name: 'Entrega Expressa', price: 15.00 },
            sessionId: `test_session_${Date.now()}`
        });

        const headers = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
            'Host': VERCEL_URL,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
            'Origin': `https://${VERCEL_URL}`,
            'Referer': `https://${VERCEL_URL}/`
        };
        
        if (sessionCookie) {
            headers['Cookie'] = sessionCookie.split(';')[0];
        }

        const pixReq = await new Promise((resolve, reject) => {
            const req = https.request({
                hostname: VERCEL_URL,
                port: 443,
                path: '/api/pix/create',
                method: 'POST',
                headers: headers
            }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data
                    });
                });
            });
            req.on('error', reject);
            req.write(payload);
            req.end();
        });

        console.log('\nStatus Code:', pixReq.statusCode);
        
        if (pixReq.statusCode === 307 || pixReq.statusCode === 308 || pixReq.statusCode === 301 || pixReq.statusCode === 302) {
             console.log('Got redirect to:', pixReq.headers.location);
        }

        try {
            const json = JSON.parse(pixReq.data);
            console.log('\nSuccess! API Response:');
            console.log(JSON.stringify(json, null, 2));
            
            if (json.paymentCode) {
                console.log('\n✅ PIX Code successfully generated!');
                console.log('Gateway used:', json.gateway);
            } else {
                console.log('\n❌ Failed: No paymentCode returned.');
            }
        } catch (e) {
            console.log('\n❌ Failed to parse JSON response:');
            console.log(pixReq.data);
        }

    } catch (error) {
        console.error('\n❌ Test failed with error:', error.message);
    }
}

testProdApi();
