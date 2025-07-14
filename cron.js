#!/usr/bin/env node

const cron = require('node-cron')
const { processarDocumentos } = require('./app')

cron.schedule('0 6 * * *', async () => {
    console.log('⏰ Executando tarefa do cron...')
    try {
        await processarDocumentos()
        console.log('✅ Tarefa concluída com sucesso!')
    } catch (error) {
        console.error('❌ Erro ao executar tarefa do cron: ', error)
    }
})