const oracledb = require('oracledb')
const { getConnection } = require('./oracleConnection')
const { sendEmail } = require('./emailSender');
const { documentos } = require('./dataQueries')
const schema = require('./dbSchema')

async function processarDocumentos() {
  let connection;
  try {
    connection = await getConnection();
    console.log("✅ Conexão com banco realizada!");

    const result = await connection.execute(documentos, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    for (const row of result.rows) {
      console.log("🔍 Linha recebida:", row);
      let diasParaVencimento = parseInt(row[schema.diasParaVencimentoDocumento]);
      let textoStatusDeVencimento;
      if(diasParaVencimento > 0) {
        textoStatusDeVencimento = `  Restam ${row[schema.diasParaVencimentoDocumento]} para o vencimento.`
      } else if(diasParaVencimento == 0){
        textoStatusDeVencimento = `  O documento atinge o fim de vigência HOJE.`
      } else if(diasParaVencimento < 0){
        let diasParaVencimentoPositivo = Math.abs(diasParaVencimento)
        textoStatusDeVencimento = `  O documento encontra-se vencido há ${diasParaVencimentoPositivo} dia(s).`
      } else {
        `  Não foi possível calcular os dias de vencimento do documento. Por favor, entre em contato com o administrador do sistema.`
      }

      const assunto = `Vencimento do documento: ${row[schema.nomeDocumento]}`;
      let mensagem = `
        Olá, o documento "${row[schema.nomeDocumento]}" da classificação "${row[schema.classificaçãoDocumento]}"
        está próximo do vencimento. Vigência: de ${new Date(row[schema.dataInicioVigenciaDocumento]).toLocaleDateString()} 
        até ${new Date(row[schema.dataFimVigenciaDocumento]).toLocaleDateString()}.
      `;

      mensagem += textoStatusDeVencimento;

      let emailDestino;
      if (row[schema.setorResponsavel] == 152) {
        emailDestino = process.env.EMAIL_COMPRAS;
      } else if (row[schema.setorResponsavel] == 100) {
        emailDestino = process.env.EMAIL_SESMT;
      } else {
        console.warn(`⚠️ Setor não reconhecido: ${row[schema.setorResponsavel]}`);
        continue;
      }
      if (!emailDestino) {
        console.error(`❌ Email de destino não definido para documento: ${row[schema.nomeDocumento]}`);
        continue;
      }

      let prioridadeEmail;

      if(diasParaVencimento >= 20) {
        prioridadeEmail = 'B'
      } else if(diasParaVencimento > 10) {
        prioridadeEmail = 'M'
      } else {
        prioridadeEmail = 'A'
      }

      const DiasParaEnvioDeEmail = [30, 20, 10, 0, -10, -20, -30];

      try {

        if(DiasParaEnvioDeEmail.includes(diasParaVencimento))
        await sendEmail({
          assunto: assunto,
          mensagem: mensagem,
          remetente: process.env.SENDER_EMAIL,
          destinatario: emailDestino,
          nmUsuario: process.env.TASY_USER,
          prioridade: prioridadeEmail,
          cco: "efjunior@unimedara.com.br"
          });
        
        console.log(`📧 Email enviado para ${emailDestino} sobre documento ${row.NM_DOCUMENTO}`);
      } catch (error) {
        console.error("❌ Erro ao enviar e-mail:", error);
      }
    }
  } catch (error) {
    console.error("❌ Erro geral ao processar documentos:", error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

processarDocumentos()

module.exports = {
  processarDocumentos
}