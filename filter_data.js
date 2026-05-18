const fs = require('fs');

const data = fs.readFileSync('C:\\Users\\User\\Downloads\\consulta eu.txt', 'utf8');
const results = data.split('• RESULTADO:');

const thresholdDate = new Date('2026-04-08');

function getZodiacSign(day, month) {
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return 'Gemini';
    return 'Other';
}

const filtered = [];

results.forEach(block => {
    if (!block.trim()) return;
    
    const lines = block.split('\n');
    let name = '';
    let birth = '';
    
    lines.forEach(line => {
        if (line.includes('• NOME:')) name = line.split('• NOME:')[1].trim();
        if (line.includes('• NASCIMENTO:')) birth = line.split('• NASCIMENTO:')[1].trim();
    });
    
    if (birth) {
        const [d, m, y] = birth.split('/').map(Number);
        const birthDate = new Date(y, m - 1, d);
        
        let age = 2026 - y;
        const monthDiff = 3 - (m - 1); // April is index 3
        if (monthDiff < 0 || (monthDiff === 0 && 8 < d)) {
            age--;
        }
        
        if (age >= 37 && age <= 40) {
            if (getZodiacSign(d, m) === 'Gemini') {
                filtered.push({ name, birth, age });
            }
        }
    }
});

console.log(`Encontrados ${filtered.length} resultados:`);
filtered.forEach(p => {
    console.log(`- ${p.name} (Nasc: ${p.birth}, Idade: ${p.age})`);
});
