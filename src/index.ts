import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './config/database';
import router from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { startUserCleanupService } from './services/userCleanupService';

const app = express();

app.use(cors());
app.use(express.json());

app.use(router);

// Middleware de tratamento de erros
app.use(errorHandler);

const PORT: string = process.env.PORT || '3000';

/** Inicia o servidor depois de se conectar ao banco de dados */
connectToDatabase().then(() => {
    app.listen(parseInt(PORT), () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
});

startUserCleanupService();
