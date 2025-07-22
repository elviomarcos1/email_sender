/*const cron = require('node-cron')
const path = require('path');
const dotenv = require('dotenv');
const envPath = path.join(process.cwd(), '.env');
dotenv.config({ path: envPath });
const { processarDocumentos } = require('./app')

cron.schedule('* * * * *', casyn () => {
    console.log('\n Executando tarefa do cron...')
    try {
        await processarDocumentos()
        console.log('Tarefa concluída com sucesso!')
    } catch (error) {
        console.error('Erro ao executar tarefa do cron: ', error)
    }
}, {
    timezone: 'America/Sao_Paulo'
})*/