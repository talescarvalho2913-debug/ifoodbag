const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
}

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function checkSupabaseSettings() {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
        console.error('Missing Supabase configurations in .env!');
        return;
    }

    console.log('Querying Supabase database app_settings...');
    const endpoint = `${SUPABASE_URL}/rest/v1/app_settings?key=eq.admin_config&select=key,value`;

    try {
        const response = await fetch(endpoint, {
            headers: {
                apikey: SUPABASE_SERVICE_KEY,
                Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`
            }
        });

        if (!response.ok) {
            console.error('Failed to connect to Supabase:', await response.text());
            return;
        }

        const rows = await response.json();
        if (rows.length === 0) {
            console.log('No settings row found in table!');
            return;
        }

        const value = rows[0]?.value || {};
        console.log('\n--- SUPABASE PRODUCTION SETTINGS ---');
        console.log('Active Gateway:', value.payments?.activeGateway);
        console.log('Gateways Configured:');
        Object.entries(value.payments?.gateways || {}).forEach(([gateway, config]) => {
            console.log(`\nGateway: ${gateway}`);
            console.log(`- Enabled: ${config.enabled}`);
            console.log(`- Base URL: ${config.baseUrl || 'default'}`);
            console.log(`- Api Token: ${config.apiToken ? config.apiToken.slice(0, 10) + '...' : 'empty'}`);
            console.log(`- Offer Hash (Company ID): ${config.offerHash || 'empty'}`);
        });

    } catch (error) {
        console.error('Error fetching settings:', error);
    }
}

checkSupabaseSettings();
