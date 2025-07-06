import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!)

app.use(cors());
app.use(express.json());

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: error.message });
  res.json(data);
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/logout', async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error) return res.status(500).json({ error: error.message });
  res.sendStatus(200);
});

app.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) return res.status(401).json({ error: error.message });

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single();

  if (profileError) return res.status(500).json({ error: profileError.message });

  res.json({ user, profile });
});

app.get('/health', (req, res) => {
  res.send('Auth service is healthy');
});

app.listen(port, () => {
  console.log(`Auth service listening at http://localhost:${port}`);
});