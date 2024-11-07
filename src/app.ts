import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerUi, swaggerSpec } from './config/swagger';
import morganMiddleware from '@infra/config/morganMiddleware';

const app = express();

app.use(cors());
app.use(express.json());

// Morgan para registrar requisições HTTP
app.use(morganMiddleware);

// Rota para a documentação do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Demais rotas
app.use(router);

// Middleware de tratamento de erros
app.use(errorHandler);

export default app;
