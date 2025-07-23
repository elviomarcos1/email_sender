const fs = require('fs');
const path = require('path');

function registrarLog(mensagem) {
    const dataAtual = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const linhaLog = `[${dataAtual}] ${mensagem}\n`;

    const exercDir = process.cwd();
    const logDir = path.join(exercDir, 'logs');
    const nomeArquivo = path.join(logDir, 'log-envios.txt');

    fs.appendFileSync(nomeArquivo, linhaLog);
}

module.exports = {
    registrarLog
}
