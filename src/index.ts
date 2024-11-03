import app from './app';
import { connectToDatabase } from './config/database';
import { startUserCleanupService } from './services/userCleanupService';

const PORT: string = process.env.PORT || '3000';

/** Inicia o servidor depois de se conectar ao banco de dados */
connectToDatabase().then(() => {
    app.listen(parseInt(PORT), () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });

    startUserCleanupService();
});
