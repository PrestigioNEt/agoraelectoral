import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

app.use(cors());
app.use(express.json());

// Middleware para verificar el token JWT
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // Si no hay token, no autorizado

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) return res.sendStatus(403); // Token inválido o expirado

  req.user = user; // Adjuntar el usuario a la solicitud
  next();
};

// Endpoints de Votantes (protegidos por autenticación)
app.get('/votantes', authenticateToken, async (req, res) => {
  const { data, error } = await supabase.from('votantes').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/votantes/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('votantes').select('*').eq('id', id).single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/votantes', authenticateToken, async (req, res) => {
  const { data, error } = await supabase.from('votantes').insert([req.body]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

app.put('/votantes/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('votantes').update(req.body).eq('id', id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/votantes/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('votantes').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.sendStatus(204);
});

app.get('/health', (req, res) => {
  res.send('CRM service is healthy');
});

app.listen(port, () => {
  console.log(`CRM service listening at http://localhost:${port}`);
});