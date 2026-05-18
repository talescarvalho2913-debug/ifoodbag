const fs = require('fs');
const data = fs.readFileSync('C:\\Users\\User\\Downloads\\consulta eu.txt', 'utf8');
const results = data.split('• RESULTADO:');

console.log(`Buscando Gêmeos entre 34 e 41 anos...\n`);

results.forEach(block => {
    if (!block.trim()) return;
    const lines = block.split('\n');
    let name = '', birth = '', cpf = '';
    lines.forEach(line => {
        if (line.includes('• NOME:')) name = line.split('• NOME:')[1].trim();
        if (line.includes('• NASCIMENTO:')) birth = line.split('• NASCIMENTO:')[1].trim();
        if (line.includes('• CPF:')) cpf = line.split('• CPF:')[1].trim();
    });
    
    if (birth) {
        const [d, m, y] = birth.split('/').map(Number);
        const isGemini = (m == 5 && d >= 21) || (m == 6 && d <= 20);
        const ageThisYear = 2026 - y;

        if (isGemini && ageThisYear >= 34 && ageThisYear <= 41) {
            console.log(`- ${name} | CPF: ${cpf} | Nasc: ${birth} (Faz ${ageThisYear} anos em ${y+ageThisYear})`);
        }
    }
});
