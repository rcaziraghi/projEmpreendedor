const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.usuario = require("./usuario.model.js")(sequelize, Sequelize);
db.cargo = require("./cargo.model.js")(sequelize, Sequelize);
db.instalacao = require("./instalacao.model.js")(sequelize, Sequelize);

// Monta a relacao entre cargo e usuario
// db.usuario.hasMany(db.instalacao);
db.instalacao.belongsTo(db.usuario, {
  targetKey: 'id',
  foreignKey: 'usuarioId'
});

// Monta a relacao entre instalacao e usuario
db.cargo.belongsToMany(db.usuario, {
  through: "usuario_cargo",
  foreignKey: "idcargo",
  otherKey: "idusuario"
});

db.usuario.belongsToMany(db.cargo, {
  through: "usuario_cargo",
  foreignKey: "idusuario",
  otherKey: "idcargo"
});

// Monta a relação entre usuário e codigo de recuperacao de senha
db.usuario.hasMany(db.instalacao, { onDelete: 'CASCADE' });
db.instalacao.belongsTo(db.usuario);

module.exports = db;

