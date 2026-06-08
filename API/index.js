import "dotenv/config"
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import indexRoutes from "./routes/index.routes.js"
import usersRoutes from "./routes/users.routes.js"
import loginRoutes from "./routes/login.routes.js"
import { connectDB } from './utils/db.js';

const app = express();
const allowedOrigins = new Set(
    [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://react-hmwk.vercel.app',
        process.env.CLIENT_URL,
    ]
        .filter(Boolean)
        .map((origin) => origin.trim().replace(/\/+$/, ''))
)

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true)
        }

        const normalizedOrigin = origin.trim().replace(/\/+$/, '')

        if (allowedOrigins.has(normalizedOrigin)) {
            return callback(null, true)
        }

        return callback(new Error(`CORS origin not allowed: ${normalizedOrigin}`))
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
}

app.disable('x-powered-by')
app.use(morgan("dev"))
app.use(cors(corsOptions))
app.options(/.*/, cors(corsOptions))
app.use(express.json())
app.use(indexRoutes)
app.use(loginRoutes)
app.use(usersRoutes)

app.use((error, req, res, next) => {
    if (error?.message?.startsWith('CORS origin not allowed:')) {
        return res.status(403).json({
            error: 'Origin not allowed by CORS',
            origin: req.headers.origin || null,
        })
    }

    if (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }

    next()
})

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
