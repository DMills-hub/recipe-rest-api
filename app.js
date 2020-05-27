const express = require('express');
const app = express();
const dotenv = require('dotenv');
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth');
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRouter);

app.listen(PORT, "192.168.0.20");