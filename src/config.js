import 'dotenv/config'
import cors from 'cors'
export const PORT = process.env.PORT || 5000;
export const corsConfig = cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
});