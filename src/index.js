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
cliente.connect().then(() => {  /** Coleções com nome em português **/
  db = cliente.db('bate-papo');  
});



// SCHEMAS
const participanteSchema = joi.object({
    name: joi.string().min(1).required()
});

const mensagemSchema = joi.object({
    from: joi.string().min(1).required(),
    to: joi.string().min(1).required(),
    text: joi.string().min(1).required(),
    type: joi.string().valid("message", "private_message").required()
});



//ROUTES GET
app.get('/participants', async (req, res) => { // Done
      
    try {
      const allParticipants = await db.collection('participantes').find().toArray();
      if (!allParticipants) {
        return res.sendStatus(404);
      }
  
      res.send(allParticipants);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
});

app.get('/messages', async (req, res) => { // Falta a logica do LIMIT e restrição por usuário
    const { limit } = req.query;
    const { user } = req.headers;

    try {
        const messagesForSpecificUser = await db.collection('mensagens').find().toArray();
        if (!messagesForSpecificUser) {
        return res.sendStatus(404);
        }

        res.send(messagesForSpecificUser);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});



//ROUTES POST
app.post('/participants', async (req, res) => { // Done

    const participant = req.body;
    const validation = participanteSchema.validate(participant, { abortEarly: false });

    //Validation body request
    if (validation.error) {
        console.log(validation.error);
        res.sendStatus(422);
        return;
    }

    //Validation user 
    const alreadyLogged = await db.collection('participantes').findOne({name: participant.name});

    if(alreadyLogged){
        res.sendStatus(409);
        return;
    }

    try {
        const newParticipant = {
            ...participant,
            lastStatus: Date.now()
        };

        const alertMessageNewParticipant = {
            from: participant.name,
            to: "Todos",
            text: "entra na sala...",
            type: "status",
            time: dayjs().format("HH:mm:ss")
        };

        await db.collection('participantes').insertOne(newParticipant);
        await db.collection('mensagens').insertOne(alertMessageNewParticipant);
        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.post('/messages', async (req, res) => {
    const product = req.body;

    const validation = productSchema.validate(product, { abortEarly: true });

    if (validation.error) {
        res.sendStatus(422);
        return;
    }

    try {
        await db.collection('mensagens').insertOne(product);
        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.post('/status', async (req, res) => {
    const product = req.body;

    const validation = productSchema.validate(product, { abortEarly: true });

    if (validation.error) {
        res.sendStatus(422);
        return;
    }

    try {
        await db.collection('products').insertOne(product);
        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});



// entrada   --- {from: 'xxx', to: 'Todos', text: 'entra na sala...', type: 'status', time: 'HH:MM:SS'}
// saida     --- {from: 'xxx', to: 'Todos', text: 'sai da sala...', type: 'status', time: 'HH:MM:SS'}


//ROUTES PUT bonus
/* app.put('/messages/:id', async (req, res) => {
    const validation = productSchema.validate(req.body, { abortEarly: true });

    if (validation.error) {
        res.sendStatus(422);
        return;
    }

    try {
        const id = req.params.id;

        const product = await db.collection('mensagens').findOne({ _id: new ObjectId(id) });
        if (!product) {
        return res.sendStatus(404);
        }

        await db.collection('mensagens').updateOne({ _id: product._id }, { $set: req.body });

        res.send(product);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}); */

//ROUTES DELETE bonus
/* app.put('/messages/:id', async (req, res) => {
    const validation = productSchema.validate(req.body, { abortEarly: true });

    if (validation.error) {
        res.sendStatus(422);
        return;
    }

    try {
        const id = req.params.id;

        const product = await db.collection('mensagens').findOne({ _id: new ObjectId(id) });
        if (!product) {
        return res.sendStatus(404);
        }

        await db.collection('mensagens').updateOne({ _id: product._id }, { $set: req.body });

        res.send(product);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}); */


// PORT
app.listen(process.env.PORT, function(err){
    if(err) console.log(err);
    console.log("Server listening on PORT: ", process.env.PORT);
});