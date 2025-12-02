import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import redisClient from './redisClient';
import { authenticateToken } from './middleware/auth';

// import routes
import tokenRoutes from './routes/token';
import pokemonRoutes from './routes/pokemon';
import boxRoutes from './routes/box';

// load environment variables
dotenv.config();

// creates express app
const app = express();

// use middleware, instead of global next() function
app.use(cors());
app.use(express.json());

// health check endpoint (looks like standard across backend apps)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/token', tokenRoutes);
app.use('/pokemon', pokemonRoutes);
app.use('/box', boxRoutes);

// port information
const PORT = process.env.PORT || 3000;

// add listening port value
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});