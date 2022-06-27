// LIBS
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import joi from 'joi';
import dayjs from 'dayjs';


// CONFIGS
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const cliente = new MongoClient(process.env.URL_CONNECT_MONGO);
let db;
cliente.connect().then(() => {
  db = cliente.db('bate-papo');
});


// SCHEMAS
const participanteSchema = joi.object({
    name: joi.string().required(),
    lastStatus: joi.number()
});

const messageSchema = joi.object({
    from: joi.string().required(),
    to: joi.string().required(),
    text: joi.string().required(),
    type: joi.string().required(),
    time: joi.string().required(),
});


// entrada   --- {from: 'xxx', to: 'Todos', text: 'entra na sala...', type: 'status', time: 'HH:MM:SS'}
// saida     --- {from: 'xxx', to: 'Todos', text: 'sai da sala...', type: 'status', time: 'HH:MM:SS'}

// PORT
app.listen(PORT, function(err){
    if(err) console.log(err);
    console.log("Server listening on PORT: ", PORT);
});