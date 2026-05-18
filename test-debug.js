const https = require('https');

async function checkHealth() {
    console.log('Checking health of Vercel production deployment...');
    for (let i = 1; i <= 20; i++) {
        await new Promise((resolve) => {
            https.get('https://foodpremios.vercel.app/api/site/health', (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    console.log(`[Attempt ${i}] Status: ${res.statusCode} - Data: ${data.trim()}`);
                    resolve();
                });
            }).on('error', err => {
                console.log(`[Attempt ${i}] Error:`, err.message);
                resolve();
            });
        });
        await new Promise(r => setTimeout(r, 6000));
    }
}

checkHealth();
