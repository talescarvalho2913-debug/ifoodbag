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

async function checkSettings() {
    try {
        console.log('[SUPABASE] Checking app_settings...');
        const data = await request('GET', '/rest/v1/app_settings?key=eq.admin_config');

        if (data && data.length > 0) {
            const config = data[0].value;
            console.log('[SUPABASE] Current Config:', JSON.stringify(config, null, 2));

            console.log('[SUPABASE] Forcing update to enable Sunize...');
            config.payments = config.payments || {};
            config.payments.activeGateway = 'sunize';
            config.payments.gateways = config.payments.gateways || {};
            config.payments.gateways.sunize = config.payments.gateways.sunize || {};
            config.payments.gateways.sunize.enabled = true;
            config.payments.gateways.sunize.apiKey = 'ck_3319cc28b624a80e4fed60cb43b1b38a';
            config.payments.gateways.sunize.apiSecret = 'cs_3d85ce83529a8d68655f700b8e208770';

            await request('PATCH', '/rest/v1/app_settings?key=eq.admin_config', {
                value: config,
                updated_at: new Date().toISOString()
            });
            console.log('[SUPABASE] Update success!');
        } else {
            console.log('[SUPABASE] No admin_config found. Creating default...');
            const defaultConfig = {
                payments: {
                    activeGateway: 'sunize',
                    gateways: {
                        sunize: {
                            enabled: true,
                            apiKey: 'ck_3319cc28b624a80e4fed60cb43b1b38a',
                            apiSecret: 'cs_3d85ce83529a8d68655f700b8e208770'
                        }
                    }
                }
            };
            await request('POST', '/rest/v1/app_settings', {
                key: 'admin_config',
                value: defaultConfig
            });
            console.log('[SUPABASE] Default config created.');
        }
    } catch (error) {
        console.error('[SUPABASE] Error:', error.message);
    }
}

checkSettings();
