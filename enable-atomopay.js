const https = require('https');

const SUPABASE_URL = 'https://wtiojbaorcwodddesgyj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0aW9qYmFvcmN3b2RkZGVzZ3lqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE0MTQ1OCwiZXhwIjoyMDg3NzE3NDU4fQ.Ll1vRMzo-QEIMhDfqBX6ePR8V_H1vQA9ps0nOkJ9Ad8';

function request(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, SUPABASE_URL);
        const options = {
            method: method,
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            }
        };

        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(data ? JSON.parse(data) : null);
                    } catch (e) {
                        resolve(data);
                    }
                } else {
                    reject(new Error(`Status: ${res.statusCode}, Body: ${data}`));
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function enableAtomopay() {
    try {
        console.log('[SUPABASE] Checking app_settings...');
        const data = await request('GET', '/rest/v1/app_settings?key=eq.admin_config');

        if (data && data.length > 0) {
            const config = data[0].value;

            console.log('[SUPABASE] Changing activeGateway to atomopay...');
            config.payments = config.payments || {};
            config.payments.activeGateway = 'atomopay';
            config.payments.gateways = config.payments.gateways || {};
            config.payments.gateways.atomopay = config.payments.gateways.atomopay || {};
            config.payments.gateways.atomopay.enabled = true;
            // config.payments.gateways.atomopay.apiToken = ''; // the user will need to put this via admin UI or directly here
            
            await request('PATCH', '/rest/v1/app_settings?key=eq.admin_config', {
                value: config,
                updated_at: new Date().toISOString()
            });
            console.log('[SUPABASE] Update success!');
        }
    } catch (error) {
        console.error('[SUPABASE] Error:', error.message);
    }
}

enableAtomopay();
