require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./src/models");

db.sequelize.sync();

// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Db');
//   initial();
// });

// rota inicial
app.get("/", (req, res) => {
  res.json({ message: "Bem vindo ao Waterstuff." });
});

// rota de autenticação
require("./src/routes/auth.routes")(app);

// rota de usuario
require("./src/routes/usuario.routes")(app);

// rota de instalacao
require("./src/routes/instalacao.routes")(app);

// rota de fatura
require("./src/routes/fatura.routes")(app);

// rota de avaliações
require("./src/routes/avaliacao.routes")(app);

// rota de estados
require("./src/routes/estado.routes")(app);

// rota de denuncias
require("./src/routes/denuncia.routes")(app);

// configura portas, aguarda requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}.`);
});
