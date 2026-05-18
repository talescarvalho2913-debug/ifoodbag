const axios = require('axios');

const SUPABASE_URL = 'https://wtiojbaorcwodddesgyj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0aW9qYmFvcmN3b2RkZGVzZ3lqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE0MTQ1OCwiZXhwIjoyMDg3NzE3NDU4fQ.Ll1vRMzo-QEIMhDfqBX6ePR8V_H1vQA9ps0nOkJ9Ad8';

async function checkSettings() {
    try {
        console.log('[SUPABASE] Checking app_settings...');
        const response = await axios.get(`${SUPABASE_URL}/rest/v1/app_settings?key=eq.admin_config`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (response.data && response.data.length > 0) {
            const config = response.data[0].value;
            console.log('[SUPABASE] Current Config:', JSON.stringify(config, null, 2));

            // Update to use sunize if not already set
            if (config.payments?.activeGateway !== 'sunize') {
                console.log('[SUPABASE] Updating active gateway to sunize...');
                config.payments = config.payments || {};
                config.payments.activeGateway = 'sunize';
                config.payments.gateways = config.payments.gateways || {};
                config.payments.gateways.sunize = {
                    enabled: true,
                    apiKey: 'ck_3319cc28b624a80e4fed60cb43b1b38a',
                    apiSecret: 'cs_3d85ce83529a8d68655f700b8e208770'
                };

                const updateResponse = await axios.patch(`${SUPABASE_URL}/rest/v1/app_settings?key=eq.admin_config`, {
                    value: config,
                    updated_at: new Date().toISOString()
                }, {
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    }
                });
                console.log('[SUPABASE] Update success!');
            } else {
                console.log('[SUPABASE] Sunize is already the active gateway.');
            }
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
            await axios.post(`${SUPABASE_URL}/rest/v1/app_settings`, {
                key: 'admin_config',
                value: defaultConfig
            }, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('[SUPABASE] Default config created.');
        }
    } catch (error) {
        console.error('[SUPABASE] Error:', error.response?.data || error.message);
    }
}

checkSettings();
