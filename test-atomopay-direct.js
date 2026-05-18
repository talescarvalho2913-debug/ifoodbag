const { requestCreateTransaction } = require('./lib/atomopay-provider');

async function test() {
    const config = {
        enabled: true,
        baseUrl: 'https://api.atomopay.com.br/api/public/v1',
        apiToken: 'zKwYqGQ862BBZxliL5EMyFIgmGG3mkj5WG6MunemcxTnLMPbba0nFWMdeA8E',
        postbackUrl: 'https://ifoodbag.com.br/api/pix/webhook'
    };

    const payload = {
        amount: 15.00,
        personal: {
            name: 'Teste da Silva',
            email: 'teste@exemplo.com',
            cpf: '12345678909',
            phone: '11999999999'
        }
    };

    console.log('Sending to Atomopay...');
    try {
        const result = await requestCreateTransaction(config, payload);
        console.log('Response ok:', result.response.ok);
        console.log('Status:', result.response.status);
        console.log('Data:', JSON.stringify(result.data, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}

test();
