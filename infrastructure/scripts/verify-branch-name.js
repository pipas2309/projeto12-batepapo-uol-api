import { execSync } from 'node:child_process';

const validPrefixes = ['feature/', 'bugfix/', 'release/', 'hotfix/'];

try {
    const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

    const isValid = validPrefixes.some((prefix) => branchName.startsWith(prefix));

    if (!isValid) {
        console.error(`\nErro: Nome da branch inválido: "${branchName}".\nDeve começar com um dos prefixos: ${validPrefixes.join(', ')}\n`);
        process.exit(1);
    } else {
        process.exit(0);
    }
} catch (error) {
    console.error('Erro ao verificar o nome da branch:', error);
    process.exit(1);
}
