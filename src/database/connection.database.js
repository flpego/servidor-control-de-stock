import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DB_URL;

const db = new Pool({
    allowExitOnIdle: true,
    connectionString,
});

try {
    await db.query('SELECT NOW()');
    console.log("Se conecto a la db con exito");
} catch (error) {
    console.error("Ocurrio un error al conectar la db", error);
};

export default db;