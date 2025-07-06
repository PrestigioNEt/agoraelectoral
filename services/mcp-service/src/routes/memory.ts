import { Router, Request, Response } from 'express';
import { queryMemory, updateMemory } from '../vectorstore/redis';

const router = Router();

router.post('/query', async (req: Request, res: Response) => {
  const { query } = req.body;
  try {
    const result = await queryMemory(query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Error en la consulta de memoria', details: err });
  }
});

router.post('/update', async (req: Request, res: Response) => {
  const { key, vector, metadata } = req.body;
  try {
    const result = await updateMemory(key, vector, metadata);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando memoria', details: err });
  }
});

export default router; 