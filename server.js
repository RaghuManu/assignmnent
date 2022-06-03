const express = require("express");
const fileRouter = require("./route/file/file.route");
let cors = require('cors')
let bodyParser = require('body-parser');
const PORT = 8000;
const app = express();


const db = require('./config/db');
db.sequelize.sync().then(() => {
  console.log('Drop and Resync with { force: true }');
});
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

app.use('/', fileRouter)

app.listen(PORT, () => {
  console.log("server started ", PORT)
})