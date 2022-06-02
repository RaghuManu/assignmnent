const env = require('./env.js');
//const Op = Sequelize.Op;
const Sequelize = require('sequelize');
 
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,
 
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});
 
const db = {};
 
db.Sequelize = Sequelize;
db.sequelize = sequelize;

 
db.file_detail_model = require('../model/file')(sequelize, Sequelize);

db.sequelize;
db.Op=Sequelize.Op;

 
module.exports = db;