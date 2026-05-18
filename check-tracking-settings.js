
process.env.SUPABASE_URL = 'https://wtiojbaorcwodddesgyj.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0aW9qYmFvcmN3b2RkZGVzZ3lqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE0MTQ1OCwiZXhwIjoyMDg3NzE3NDU4fQ.Ll1vRMzo-QEIMhDfqBX6ePR8V_H1vQA9ps0nOkJ9Ad8';

const { getSettings } = require('./lib/settings-store');

async function check() {
    const settings = await getSettings();
    console.log('--- TRACKING SETTINGS ---');
    console.log('UTMFY:', JSON.stringify(settings.utmfy, null, 2));
    console.log('Meta Pixel:', JSON.stringify(settings.pixel, null, 2));
    console.log('TikTok Pixel:', JSON.stringify(settings.tiktokPixel, null, 2));
}

check().catch(console.error);
