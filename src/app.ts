import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerUi, swaggerSpec } from './config/swagger';

const app = express();

app.use(cors());
app.use(express.json());

// Rota para a documentação do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Demais rotas
app.use(router);

// Middleware de tratamento de erros
app.use(errorHandler);

export default app;
