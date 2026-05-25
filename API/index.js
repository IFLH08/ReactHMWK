import "dotenv/config"
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import indexRoutes from "./routes/index.routes.js"
import usersRoutes from "./routes/users.routes.js"
import loginRoutes from "./routes/login.routes.js"
import { connectDB } from './utils/db.js';

const app = express();
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.CLIENT_URL,
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }

        return callback(new Error('Not allowed by CORS'))
    }
}))
app.use(express.json())
app.use(morgan("dev"))
app.use(indexRoutes)
app.use(loginRoutes)
app.use(usersRoutes)

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`)
        })
    } catch (error) {
        console.error('Error starting server:', error)
        process.exit(1)
    }
}

startServer()
