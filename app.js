const oracledb = require('oracledb')
const { getConnection } = require('./oracleConnection')
const { sendEmail } = require('./emailSender');
const { documentos } = require('./dataQueries')


async function processarDocumentos() {
  let connection;
  try {
    connection = await getConnection();
    console.log("✅ Conexão com banco realizada!");

    const result = await connection.execute(documentos, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    for (const row of result.rows) {
      console.log("🔍 Linha recebida:", row);

      const assunto = `Vencimento do documento: ${row.NM_DOCUMENTO}`;
      const mensagem = `
        Olá, o documento "${row.NM_DOCUMENTO}" da classificação "${row.DS_CLASSIFICACAO}"
        está próximo do vencimento. Vigência: de ${new Date(row.DT_INICIO_VIGENCIA).toLocaleDateString()} 
        até ${new Date(row.DT_FIM_VIGENCIA).toLocaleDateString()}.
        Restam ${row.DIAS_VENCIMENTO}.
      `;

      let emailDestino;
      if (row.CD_SETOR_ATENDIMENTO == 152) {
        emailDestino = 'efjunior@unimedara.com.br';
      } else if (row.CD_SETOR_ATENDIMENTO == 100) {
        emailDestino = 'landrade@unimedara.com.br';
      } else {
        console.warn(`⚠️ Setor não reconhecido: ${row.CD_SETOR_ATENDIMENTO}`);
        continue;
      }
      console.log(`Valor do Email Desino: ${emailDestino}`)
      if (!emailDestino) {
        console.error(`❌ Email de destino não definido para documento: ${row.NM_DOCUMENTO}`);
        continue;
      }

      try {
        await sendEmail({
          assunto: "teste",
          mensagem: "teste assunto",
          remetente: "efjunior@unimedara.com.br",
          destinatario: emailDestino,
          nmUsuario: "enviotasy",
          prioridade: "M",
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
