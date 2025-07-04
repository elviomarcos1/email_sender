const oracledb = require('oracledb');

oracledb.initOracleClient({ libDir: 'C:/instantclient_23_0/instantclient_23_8' });

const dbConfig = {
  user: 'tasy',
  password: 'aloisk',
  connectString: '10.0.0.111:1521/tasy1'
};

async function testQuery() {
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    console.log('Conectado com sucesso!');

    const result = await connection.execute(
      `SELECT 
    doc.cd_documento,
    doc.nm_documento,   
    cla.ds_classificacao,
    lib.dt_inicio_vigencia,
    lib.dt_fim_vigencia,
    ROUND((lib.dt_fim_vigencia - sysdate)) || ' dias' as dias_vencimento
    FROM qua_documento doc, qua_classif_doc cla, qua_doc_lib lib
    WHERE  (doc.nr_sequencia = lib.nr_seq_doc
        AND
            doc.nr_seq_classif = cla.nr_sequencia)
    AND doc.cd_setor_atendimento IN (152, 100) 
    AND
    TRUNC(lib.dt_fim_vigencia) <= TRUNC(sysdate + 30)
    AND 
    doc.ie_situacao = 'A'`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log('Resultado da consulta:', result.rows);

  } catch (err) {
    console.error('Erro ao executar a query ou conectar:', err);
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('Conexão fechada.');
      } catch (err) {
        console.error('Erro ao fechar conexão:', err);
      }
    }
  }
}

testQuery();
