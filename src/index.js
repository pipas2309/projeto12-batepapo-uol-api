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
const participantsSchema = joi.object({
    name: joi.string().min(1).required()
});

const messagesSchema = joi.object({
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

app.get('/messages', async (req, res) => { // Done
    const { user } = req.headers;
    
    //Opitional QueryString
    const { limit } = req.query;
    let numMessages = 0;
    
    if(limit) {
        numMessages = Number(limit);
    } 

    try {
        const allMessages = await db.collection('mensagens').find().toArray();
        if (!allMessages) {
            return res.sendStatus(404);
        }

        // Exclusive selection logic
        const specificUserMessages = allMessages.filter(message => { 
            const privateMessagesIDidntSend = (message.type === "private_message" && message.from !== user);
            const privateMessagesIDidntReceive = (message.type === "private_message" && message.to !== user);

            return (!privateMessagesIDidntReceive || !privateMessagesIDidntSend);
        });

        const messagesList = specificUserMessages.slice(-numMessages);
        res.send(messagesList);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});



//ROUTES POST
app.post('/participants', async (req, res) => { // Done

    const participant = req.body;

    //Validation body request
    const validation = participantsSchema.validate(participant, { abortEarly: false });
    
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

app.post('/messages', async (req, res) => { // Done

    const { user } = req.headers;
    const message = {
        from: user,
        ...req.body
    }

    // Validation body/header request
    const validation = messagesSchema.validate(message, { abortEarly: false });
    const isTheUserLogged = await db.collection('participantes').findOne({name: message.from})

    if (validation.error || !isTheUserLogged) {
        console.log("\nErro de validação por Scheme abaixo:");
        console.log(validation.error.details);
        console.log("\nO usuário, registrado no sistema, que está tentando enviar a mensagem é: " + isTheUserLogged.name);
        res.sendStatus(422);
        return;
    }

    try {
        const newMessage = {
            ...message,
            time: dayjs().format("HH:mm:ss")
        };

        await db.collection('mensagens').insertOne(newMessage);
        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.post('/status', async (req, res) => { // Done
    const { user } = req.headers;

    try {
        const isLogged = await db.collection('participantes').findOne({name: user});

        if(!isLogged) {
            res.sendStatus(404);
            return;
        };

        await db.collection('participantes').updateOne(
            {
                name: user
            },
            {
                $set: { lastStatus: Date.now() }
            }
        );

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});



//Checking active users
setInterval(async () => {
    try {
        const participantsOnline = await db.collection('participantes').find().toArray();

        if(!participantsOnline[0]) {
            console.log("Não há participantes online");
            return;
        };

        for(let i = 0; i < participantsOnline.length; i++) {

            const user = participantsOnline[i].name;          

            if(Date.now() - Number(participantsOnline[i].lastStatus) > process.env.LOGOUT_TIME) {

                const logout = {
                    from: user,
                    to: "Todos",
                    text: "sai da sala...",
                    type: "status",
                    time: dayjs().format("HH:mm:ss")
                };

                await db.collection('participantes').deleteOne({ name: user});
                await db.collection('mensagens').insertOne(logout);
            }    
        };
    } catch (error) {
        console.error(error);
    }
}, process.env.ACTIVITY_CHECKER_TIME);



//ROUTES PUT (BONUS)
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



//ROUTES DELETE (BONUS)
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