import dotenv from 'dotenv';
import process from 'process';
import { createClient } from 'redis';

// load environment variables
dotenv.config();

// creates redis client
const client = createClient({
  socket: {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!, 10)
  },
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD
});

// connect to redis client
client.connect().catch(console.error);

// event listeners for redis client, catch errors and report success
client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Connected to Redis Cloud'));

export default client;