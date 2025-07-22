const fs = require('fs');
const path = require('path');

function registrarLog(mensagem) {
    const dataAtual = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const linhaLog = `[${dataAtual}] ${mensagem}\n`;

    const caminhoLogs = path.join(__dirname, 'logs');
    const nomeArquivo = path.join(caminhoLogs, 'log-envios.txt');

    // Garante que o diretório 'logs' exista
    if (!fs.existsSync(caminhoLogs)) {
        fs.mkdirSync(caminhoLogs, { recursive: true });
    }

    // Escreve (ou anexa) a linha no arquivo
    fs.appendFile(nomeArquivo, linhaLog, (err) => {
        if (err) {
            console.error('❌ Erro ao escrever log:', err);
        }
    });
}

module.exports = {
    registrarLog
}
