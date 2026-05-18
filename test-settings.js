// Load local env files since we want to mimic what Vercel has. 
// Or better yet, we just print the Supabase request results.
process.env.SUPABASE_URL = 'https://wtiojbaorcwodddesgyj.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0aW9qYmFvcmN3b2RkZGVzZ3lqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE0MTQ1OCwiZXhwIjoyMDg3NzE3NDU4fQ.Ll1vRMzo-QEIMhDfqBX6ePR8V_H1vQA9ps0nOkJ9Ad8';

const { getSettings } = require('./lib/settings-store');
const { getPaymentsConfig } = require('./lib/payments-config-store');
const { resolveGatewayFromPayload } = require('./lib/payment-gateway-config');
const createApi = require('./api/pix/create');

async function debugSettings() {
    console.log('1. Fetching raw settings...');
    const settings = await getSettings();
    console.log(JSON.stringify(settings.payments, null, 2));

    console.log('\n2. Fetching payment config...');
    const payments = await getPaymentsConfig({ force: true });
    console.log(JSON.stringify(payments, null, 2));

    console.log('\n3. Testing gateway resolution logic from api/pix/create.js manually...');
    const rawBody = {};
    const ativushubEnabled = payments?.gateways?.ativushub?.enabled !== false;
    const ghostspayEnabled = payments?.gateways?.ghostspay?.enabled === true;
    const sunizeEnabled = payments?.gateways?.sunize?.enabled === true;
    const paradiseEnabled = payments?.gateways?.paradise?.enabled === true;
    console.log('ativushubEnabled:', ativushubEnabled);
    console.log('ghostspayEnabled:', ghostspayEnabled);
    console.log('sunizeEnabled:', sunizeEnabled);
    console.log('paradiseEnabled:', paradiseEnabled);

    // from modified logic inside create.js:
    const { normalizeGatewayId } = require('./lib/payment-gateway-config');
    const requested = normalizeGatewayId(rawBody.gateway || rawBody.paymentGateway || payments.activeGateway);
    console.log('requested:', requested);
}

debugSettings().catch(console.error);
