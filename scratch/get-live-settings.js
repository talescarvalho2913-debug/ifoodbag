const path = require('path');
const fs = require('fs');
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
}

async function getLiveSettings() {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const SETTINGS_KEY = 'admin_config';

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
        console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
        return;
    }

    try {
        const endpoint = `${SUPABASE_URL}/rest/v1/app_settings?key=eq.${encodeURIComponent(SETTINGS_KEY)}&select=key,value`;
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                apikey: SUPABASE_SERVICE_KEY,
                Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Error fetching from Supabase:', response.status, await response.text());
            return;
        }

        const rows = await response.json();
        console.log('--- LIVE SETTINGS FROM DATABASE ---');
        console.log(JSON.stringify(rows[0]?.value || {}, null, 2));
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

getLiveSettings();
