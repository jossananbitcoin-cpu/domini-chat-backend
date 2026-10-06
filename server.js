require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

// Conexão Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Conexão Groq (IA)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Rota de teste (para saber se está funcionando)
app.get('/', (req, res) => {
  res.json({ status: '🟢 Domini Chat API está rodando!' });
});

// Rota para enviar mensagem e receber resposta da IA
app.post('/api/chat', async (req, res) => {
  try {
    const { user_message } = req.body;

    // Chamar a IA (Groq)
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Você é o Domini Chat, um assistente de IA amigável e útil. Responda sempre em português do Brasil.'
        },
        {
          role: 'user',
          content: user_message
        }
      ],
             model: 'openai/gpt-oss-20b',
      temperature: 0.7,
      max_tokens: 1024
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({
      reply: aiResponse
    });

  } catch (err) {
    console.error('Erro no chat:', err);
    res.status(500).json({ error: err.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Domini Chat rodando na porta ${PORT}`);
});