const express     = require('express');
const uuid        = require("uuid4");
const bodyParser  = require('body-parser');

const app     = express();
const node_id = uuid();

app.set("node_id", node_id)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/blockchain', require('./routes/blockchain'));

module.exports = app;
