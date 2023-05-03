import express, { Express } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import babysitterRoutes from './routes/babysitter.routes'
import parentRoutes from './routes/parent.routes';
import authRoutes from './routes/auth.routes';
import jobRoutes from './routes/jobs.routes';
import paymentRoutes from './routes/payments.routes';
const cors = require('cors');

dotenv.config();

const app: Express = express(); //type of var is express. 
const port = process.env.PORT;

app.use(express.json())

app.use(cors({
    origin: '*'
}));

mongoose.set('strictQuery', false);

mongoose.connect('mongodb+srv://babysitter-app:babysittersandparents@cluster0.nzomb20.mongodb.net/test').then(() => console.log("Successfully connected to DB")).catch((err) => console.log(err))

app.use('/babysitter', babysitterRoutes);

app.use('/parent', parentRoutes);

app.use('/auth', authRoutes); //because it is a separate route file

app.use('/jobs', jobRoutes);

app.use('/payments', paymentRoutes);

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})






