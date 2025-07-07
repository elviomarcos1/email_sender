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

      const assunto = `Vencimento do documento: ${row[schema.nomeDocumento]}`;
      const mensagem = `
        Olá, o documento "${row[schema.nomeDocumento]}" da classificação "${row[schema.classificaçãoDocumento]}"
        está próximo do vencimento. Vigência: de ${new Date(row[schema.dataInicioVigenciaDocumento]).toLocaleDateString()} 
        até ${new Date(row[schema.dataFimVigenciaDocumento]).toLocaleDateString()}.
        Restam ${row[schema.diasParaVencimentoDocumento]}.
      `;

      let emailDestino;
      if (row[schema.setorResponsavel] == 152) {
        emailDestino = 'efjunior@unimedara.com.br';
      } else if (row[schema.setorResponsavel] == 100) {
        emailDestino = 'efjunior@unimedara.com.br';
      } else {
        console.warn(`⚠️ Setor não reconhecido: ${row[schema.setorResponsavel]}`);
        continue;
      }
      if (!emailDestino) {
        console.error(`❌ Email de destino não definido para documento: ${row[schema.nomeDocumento]}`);
        continue;
      }

      const diasParaVencimento = parseInt(row[schema.diasParaVencimentoDocumento]);
      let prioridadeEmail;

      if(diasParaVencimento > 20) {
        prioridadeEmail = 'B'
      } else if(diasParaVencimento > 10) {
        prioridadeEmail = 'M'
      } else {
        prioridadeEmail = 'A'
      }

      try {
        if(diasParaVencimento == 30 || diasParaVencimento == 20 || diasParaVencimento == 10 || diasParaVencimento < 0)
        await sendEmail({
          assunto: assunto,
          mensagem: mensagem,
          remetente: process.env.SENDER_EMAIL,
          destinatario: emailDestino,
          nmUsuario: process.env.TASY_USER,
          prioridade: prioridadeEmail,
          cco: null
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

processarDocumentos();

/*sendEmail({
  assunto: "teste",
  mensagem: "assunto",
  remetente: "efjunior@unimedara.com.br",
  destinatario: "efjunior@unimedara.com.br",
  nmUsuario: "efjunior",
  prioridade: "M",
  cco: null
})*/
