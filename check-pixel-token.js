
const https = require('https');

const SUPABASE_URL = 'wtiojbaorcwodddesgyj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0aW9qYmFvcmN3b2RkZGVzZ3lqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE0MTQ1OCwiZXhwIjoyMDg3NzE3NDU4fQ.Ll1vRMzo-QEIMhDfqBX6ePR8V_H1vQA9ps0nOkJ9Ad8';

const options = {
    hostname: SUPABASE_URL,
    port: 443,
    path: '/rest/v1/app_settings?key=eq.admin_config&select=key,value',
    method: 'GET',
    headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        if (res.statusCode !== 200) {
            console.error('Failed to fetch config:', res.statusCode, data);
            return;
        }
        const rows = JSON.parse(data);
        if (rows.length === 0) {
            console.log('No settings found with key "admin_config".');
            return;
        }
        const settings = rows[0]?.value || {};
        console.log('--- SETTINGS (admin_config) ---');
        
        console.log('\n[Pixel]');
        console.log('Enabled:', settings.pixel?.enabled);
        console.log('ID:', settings.pixel?.id);
        console.log('Access Token defined:', !!settings.pixel?.accessToken);
        if (settings.pixel?.accessToken) {
            console.log('Access Token Length:', settings.pixel.accessToken.length);
            console.log('Access Token Preview:', settings.pixel.accessToken.slice(0, 10) + '...');
        }

        console.log('\n[UTMFY]');
        console.log('Enabled:', settings.utmfy?.enabled);
        console.log('Endpoint:', settings.utmfy?.endpoint);
        console.log('Platform:', settings.utmfy?.platform);
        console.log('API Key defined:', !!settings.utmfy?.apiKey);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.end();
