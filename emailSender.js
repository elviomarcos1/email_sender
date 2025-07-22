const { getConnection } = require('./oracleConnection');

async function sendEmail({
  assunto,
  mensagem,
  remetente,
  destinatario,
  nmUsuario,
  prioridade,
  cco = null
}) {

  let connection;

  try {
    connection = await getConnection();

    await connection.execute(
      `BEGIN
         enviar_email(
           :assunto,
           :mensagem,
           :remetente,
           :destinatario,
           :nmUsuario,
           :prioridade,
           :cco
         );
       END;`,
      {
        assunto,
        mensagem,
        remetente,
        destinatario,
        nmUsuario,
        prioridade,
        cco
      }
    );
  } catch (error) {
    console.error(" Erro ao enviar e-mail:", error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

module.exports = {
  sendEmail
};