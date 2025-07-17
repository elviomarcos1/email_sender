const oracledb = require('oracledb')
const { getConnection } = require('./oracleConnection')
const { sendEmail } = require('./emailSender');
const { documentos } = require('./dataQueries')
const schema = require('./dbSchema')

async function processarDocumentos() {

  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(documentos, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    
    let quantidadeEmailsCompras = 0
    let quantidadeEmailsSesmt = 0
    let quantidadeEmailsSegurancaDoTrabalho = 0
    let quantidadeEmailsMedicinaOcupacional = 0

    for (const row of result.rows) {

      let diasParaVencimento = parseInt(row[schema.diasParaVencimentoDocumento]);
      let textoStatusDeVencimento;
      let palavraChave;
      
      if (row[schema.tipoDocumento] != 4) {
        palavraChave = "CNPJ: "
      } else if(row[schema.tipoDocumento] == 4) {
        palavraChave = "Obs: "
      } else {
        palavraChave = `Erro ao processar o campo "Palavra chave", entre em contato com o administrador do sistema`
      }
      
      if (row[schema.palavraChave] == null) {
        palavraChave = ""
        row[schema.palavraChave] = ""
      }
      
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
          Olá, o documento "${row[schema.nomeDocumento]}"(${row[schema.codigoDocumento]}) está próximo do vencimento.
          ${palavraChave} ${row[schema.palavraChave]}
          Grupo: ${row[schema.descricaoGrupos]}
          Classificação: ${row[schema.classificaçãoDocumento]}
          Vigência Inicial: ${new Date(row[schema.dataInicioVigenciaDocumento]).toLocaleDateString()}
          Vigência Final(Vencimento): ${new Date(row[schema.dataFimVigenciaDocumento]).toLocaleDateString()}
        `;
     
      mensagem += textoStatusDeVencimento;

      const grupo = row[schema.indiceGrupo];

      let emailDestino;
      
      switch (grupo) {
        case 4:
        case 7:
          emailDestino = process.env.EMAIL_COMPRAS
          quantidadeEmailsCompras ++
          break;

        case 3:
        case 11:
          emailDestino = process.env.EMAIL_SESMT
          quantidadeEmailsSesmt ++
          break;

        case 6:
        case 8:
          emailDestino = process.env.EMAIL_MEDICINA_OCUPACIONAL
          quantidadeEmailsMedicinaOcupacional ++
          break;

        case 5:
        case 9:
          emailDestino = process.env.EMAIL_SEGURANCA_DO_TRABALHO
          quantidadeEmailsSegurancaDoTrabalho ++
          break;

        default:
          console.warn(`
            Gerenciador de e-mails:
            Setor ou Grupo não reconhecidos: ${row[schema.setorResponsavelLiberacao]}, ${row[schema.descricaoGrupos]}`);
        continue;
      }

      if (!emailDestino) {
        console.error(`Email de destino não definido para documento: ${row[schema.nomeDocumento]}`);
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

      const today = new Date()
      const todayForm = today.toLocaleString('pt-BR')

      try {

        if(DiasParaEnvioDeEmail.includes(diasParaVencimento)){
          console.log(`\nHorário do processamento: ${todayForm}`)

          var logEmails = `\nDocumento Listado: ${row[schema.codigoDocumento]} - ${row[schema.nomeDocumento]}(${row[schema.descricaoGrupos]}) -> ${emailDestino}
          Vencimento em: ${row[schema.diasParaVencimentoDocumento]}`  

          var logDeEnvios = `
          Resumo de envios: ${todayForm}

          Compras: ${quantidadeEmailsCompras} e-mail(s) enviado(s)
          SESMT: ${quantidadeEmailsSesmt} e-mail(s) enviado(s)
          Medicina Ocupacional: ${quantidadeEmailsMedicinaOcupacional} e-mail(s) enviado(s)
          Segurança do Trabalho: ${quantidadeEmailsSegurancaDoTrabalho} e-mail(s) enviado(s)
          `

        await sendEmail({
          assunto: assunto,
          mensagem: mensagem,
          remetente: process.env.SENDER_EMAIL,
          destinatario: emailDestino,
          nmUsuario: process.env.TASY_USER,
          prioridade: prioridadeEmail,
          cco: "efjunior@unimedara.com.br"
          });
        
        console.log(logEmails)
        }

      } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
      }
    }
  } catch (error) {
    console.error("Erro geral ao processar documentos:", error);
  } finally {

    console.log(logDeEnvios)

    if (connection) {
      await connection.close();
    }
  }
}

module.exports = {
  processarDocumentos
}