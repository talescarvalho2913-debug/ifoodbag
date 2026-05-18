const crypto = require('crypto');

async function testSunize(apiKey, apiSecret, label) {
    console.log(`[TEST] Probing Sunize API (${label})...`);
    
    const headers = {
        'x-api-key': apiKey,
        'x-api-secret': apiSecret,
        'Content-Type': 'application/json'
    };

    const payload = {
        external_id: "test_" + Date.now(),
        total_amount: 28.9,
        customer_name: "Teste Antigravity",
        customer_email: "teste@example.com",
        customer_cpf: "44444444444",
        customer_phone: "11999999999",
        postback_url: "https://foodpremios.vercel.app/api/pix/webhook"
    };

    try {
        const response = await fetch('https://api.sunize.com.br/v1/transactions', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        console.log(`[SUNIZ ${label}] Status:`, response.status);
        const data = await response.json();
        console.log(`[SUNIZ ${label}] Data:`, JSON.stringify(data, null, 2));

        if (response.ok && data.id) {
            console.log(`✅ SUCCESS: ${label} credentials are VALID!`);
        } else {
            console.log(`❌ FAILURE: ${label} credentials might be invalid or revoked.`);
        }
    } catch (e) {
        console.error(`[${label}] Check Error:`, e);
    }
}

(async () => {
    await testSunize("ck_3319cc28b624a80e4fed60cb43b1b38a", "cs_3d85ce83529a8d68655f700b8e208770", "Env 99 BAG");
    await testSunize("ck_88b8304e02c06dad722541e9c53d07ad", "cs_b26e068d6cb5d8b9fed71e380720a5f5", "Cacau Show");
})();
