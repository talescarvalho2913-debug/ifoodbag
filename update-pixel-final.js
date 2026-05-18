const SUPABASE_URL = 'https://wtiojbaorcwodddesgyj.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0aW9qYmFvcmN3b2RkZGVzZ3lqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE0MTQ1OCwiZXhwIjoyMDg3NzE3NDU4fQ.Ll1vRMzo-QEIMhDfqBX6ePR8V_H1vQA9ps0nOkJ9Ad8';

const SETTINGS_KEY = 'admin_config'; // FIXED

const fetchFn = global.fetch
    ? global.fetch.bind(global)
    : (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

(async () => {
    try {
        console.log('Fetching current settings directly from admin_config...');
        const endpointGet = `${SUPABASE_URL}/rest/v1/app_settings?key=eq.${encodeURIComponent(SETTINGS_KEY)}&select=key,value`;
        
        const responseGet = await fetchFn(endpointGet, {
            headers: {
                apikey: SUPABASE_SERVICE_KEY,
                Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        const rows = await responseGet.json();
        let value = (rows[0] && rows[0].value) || {};
        
        // Ensure nesting is correct
        value.pixel = {
            ...value.pixel,
            enabled: true,
            id: '887132397540792',
            events: {
                page_view: true,
                quiz_view: true,
                lead: true,
                purchase: true,
                checkout: true
            }
        };

        const payload = {
            key: SETTINGS_KEY,
            value: value,
            updated_at: new Date().toISOString()
        };

        const endpointPost = `${SUPABASE_URL}/rest/v1/app_settings`;
        const responsePost = await fetchFn(endpointPost, {
            method: 'POST',
            cache: 'no-store',
            headers: {
                apikey: SUPABASE_SERVICE_KEY,
                Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Content-Type': 'application/json',
                Prefer: 'resolution=merge-duplicates,return=representation'
            },
            body: JSON.stringify([payload])
        });

        if (responsePost.ok) {
            console.log('✅ Supabase updated SUCCESSFULLY with the Facebook Pixel ID in admin_config.');
            console.log('ID: 887132397540792');
        } else {
            console.error('Failed to update:', await responsePost.text());
        }
    } catch (error) {
        console.error('Error:', error);
    }
})();
