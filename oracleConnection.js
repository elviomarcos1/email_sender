const oracledb = require('oracledb');
require('dotenv').config()

oracledb.initOracleClient({ libDir: process.env.INSTANT_CLIENT_DIR });

const dataBaseConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING
};

async function checkConnection() {
  let connection;
  try {
    connection = await oracledb.getConnection(dataBaseConfig);
    console.log("Conexão estabelecida com sucesso...");
  } catch (error) {
    console.error("Falha na conexão: ", error);
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("\nConexão fechada após processamento...");
      } catch (closeError) {
        console.error("Erro ao fechar conexão: ", closeError);
      }
    }
  }
}
checkConnection();

async function getConnection() {
  return await oracledb.getConnection(dataBaseConfig)
}

module.exports = {
  getConnection
}