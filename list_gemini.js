const fs = require('fs');
const data = fs.readFileSync('C:\\Users\\User\\Downloads\\consulta eu.txt', 'utf8');
const results = data.split('• RESULTADO:');

console.log(`Analisando ${results.length - 1} pessoas...\n`);

results.forEach(block => {
    if (!block.trim()) return;
    const lines = block.split('\n');
    let name = '', birth = '';
    lines.forEach(line => {
        if (line.includes('• NOME:')) name = line.split('• NOME:')[1].trim();
        if (line.includes('• NASCIMENTO:')) birth = line.split('• NASCIMENTO:')[1].trim();
    });
    
    if (birth) {
        const [d, m, y] = birth.split('/').map(Number);
        const isGemini = (m == 5 && d >= 21) || (m == 6 && d <= 20);
        
        let age = 2026 - y;
        const monthDiff = 3 - (m - 1); // 08/04/2026
        if (monthDiff < 0 || (monthDiff === 0 && 8 < d)) age--;

        if (isGemini) {
            console.log(`Gêmeos encontrado: ${name} | Nasc: ${birth} | Idade Atual: ${age}`);
        }
    }
});
