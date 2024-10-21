import express, { urlencoded } from 'express';
import { PORT } from './config.js';
import userRoute from './routes/user.route.js';
import productsRoute from './routes/products.route.js';

const app = express();
//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//routes
app.use("/api/users", userRoute);
app.use("/api/products", productsRoute);
app.listen(PORT, () => {
    console.log("Server on port", PORT)
});