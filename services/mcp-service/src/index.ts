import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRoutes from './routes/analyze';
import memoryRoutes from './routes/memory';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const API_KEY = process.env.MCP_API_KEY || 'lacaracortadacubanaes12';

app.use(cors());
app.use(express.json());

// Middleware de autenticación simple por API key
app.use((req: Request, res: Response, next: NextFunction) => {
  const key = req.headers['x-api-key'];
  if (key !== API_KEY) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
});

app.use('/analyze', analyzeRoutes);
app.use('/memory', memoryRoutes);

app.get('/', (req, res) => {
  res.send('Agora MCP Service is running');
});

app.listen(PORT, () => {
  console.log(`MCP Service listening on port ${PORT}`);
}); 