import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import router from './routes';
import cors from 'cors';
import seed from '../prisma/seed'; // Importe o script de seeding
import prismaClient from './prisma'; // Import para desconectar o prisma corretamente

const app = express();
app.use(express.json());
app.use(cors());

app.use(router);
app.use('/files', express.static('tmp'));
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        // Se for uma instancia do tipo error
        return res.status(400).json({
            error: err.message
        });
    }

    return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
});

async function startServer() {
    try {
        await seed(); // Executa o seed antes de iniciar o servidor
        app.listen(3333, () => console.log('Servidor online!'));
    } catch (error) {
        console.error("Failed to start the server:", error);
        process.exit(1);
    } finally {
        await prismaClient.$disconnect();
    }
}

startServer();