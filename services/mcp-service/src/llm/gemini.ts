import axios from 'axios';

const GEMINI_API_URL = process.env.GEMINI_API_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function analyzeSentiment(text: string) {
  // Cambia la ruta y payload según la API real de Gemini
  const response = await axios.post(
    `${GEMINI_API_URL}/sentiment`,
    { text },
    { headers: { 'Authorization': `Bearer ${GEMINI_API_KEY}` } }
  );
  return response.data;
}

export async function predictPolitical(data: any) {
  // Placeholder para predicción política
  // Implementa según la API real
  return { prediction: 'No prediction (placeholder)' };
}

export async function analyzePolitical(data: any) {
  // Placeholder para análisis político
  // Implementa según la API real
  return { analysis: 'No analysis (placeholder)' };
} 