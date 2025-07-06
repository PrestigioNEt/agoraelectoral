import { Router, Request, Response } from 'express';
import { analyzeSentiment, predictPolitical, analyzePolitical } from '../llm/gemini';

const router = Router();

router.post('/sentiment', async (req: Request, res: Response) => {
  const { text } = req.body;
  try {
    const result = await analyzeSentiment(text);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Error en el análisis de sentimiento', details: err });
  }
});

router.post('/predict', async (req: Request, res: Response) => {
  try {
    const result = await predictPolitical(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Error en la predicción política', details: err });
  }
});

router.post('/political', async (req: Request, res: Response) => {
  try {
    const result = await analyzePolitical(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Error en el análisis político', details: err });
  }
});

export default router; 