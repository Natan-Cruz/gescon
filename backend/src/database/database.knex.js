import Knex from "knex";
import config from "../config/database-new.json";
// import config from "../config/database-old.json";

const { setTypeParser, builtins } = require('pg').types;

const typesToReset = [
  builtins.DATE,
  builtins.TIME,
  builtins.TIMETZ,
  builtins.TIMESTAMP,
  builtins.TIMESTAMPTZ,
];

function resetPgDateParsers() {
  for (const pgType of typesToReset) {
    setTypeParser(pgType, val => String(val)); // like noParse() function underhood pg lib
  }
}
resetPgDateParsers()
const knex = Knex({
    client: 'pg',
    connection: {
        host : config.host,
        user : config.user,
        password : config.password,
        database : config.database,
        ssl: false
        // ssl: { rejectUnauthorized: false }
    },
    pool: {
      afterCreate: function(connection, callback) {
        connection.query('SET timezone = \'America/Sao_Paulo\'', function(err) {
          callback(err, connection);
        });
      }
    }
})

export default knex;