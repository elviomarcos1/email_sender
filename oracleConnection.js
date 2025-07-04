require('dotenv').config();
const oracledb = require('oracledb');

oracledb.initOracleClient({ libDir: process.env.INSTANT_CLIENT_DIR });

const dataBaseConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING
};

async function checkConnection() {
  let connection;
  try {
    // aqui usamos o config correto
    connection = await oracledb.getConnection(dataBaseConfig);
    console.log("✅ Conexão estabelecida com sucesso!");
  } catch (error) {
    console.error("❌ Falha na conexão: ", error);
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("🔒 Conexão fechada após teste.");
      } catch (closeError) {
        console.error("❌ Erro ao fechar conexão: ", closeError);
      }
    }
  }
}

checkConnection();
