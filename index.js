'use strict';

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');

const PORT = process.env.PORT || 10000;

// variáveis do Supabase (vamos configurar depois)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DESKTOP_SYNC_KEY = process.env.DESKTOP_SYNC_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Variáveis do Supabase não configuradas');
  process.exit(1);
}

if (!DESKTOP_SYNC_KEY) {
  console.error('❌ DESKTOP_SYNC_KEY não configurada');
  process.exit(1);
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);

const app = express();
app.disable('x-powered-by');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '300kb' }));

app.use('/api/', rateLimit({
  windowMs: 60 * 1000,
  limit: 60
}));

app.use('/public', express.static(path.join(__dirname, 'public')));

// Página da anamnese (abre no WhatsApp)
app.get('/intake/:token', (req, res) => {
  const token = req.params.token;
  if (!token || token.length < 10) {
    return res.status(400).send('Link inválido');
  }
  res.sendFile(path.join(__dirname, 'public', 'intake.html'));
});

// Ver status
app.get('/api/intake/:token/status', async (req, res) => {
  const token = req.params.token;

  const { data } = await supabase
    .from('intake_submissions')
    .select('status')
    .eq('token', token)
    .maybeSingle();

  if (!data) {
    return res.json({ ok: true, status: 'new' });
  }

  return res.json({ ok: true, status: data.status });
});

// Enviar anamnese
app.post('/api/intake/:token/submit', async (req, res) => {
  const token = req.params.token;
  const answers = req.body;

  if (!answers) {
    return res.status(400).json({ ok: false });
  }

  await supabase
    .from('intake_submissions')
    .upsert({
      token,
      answers,
      status: 'submitted',
      submitted_at: new Date().toISOString()
    });

  return res.json({ ok: true });
});

// Buscar do desktop
app.get('/api/desktop/intake/:token', async (req, res) => {
  const key = req.headers['x-trg-key'];
  if (key !== DESKTOP_SYNC_KEY) {
    return res.status(401).json({ ok: false });
  }

  const token = req.params.token;

  const { data } = await supabase
    .from('intake_submissions')
    .select('*')
    .eq('token', token)
    .maybeSingle();

  if (!data) {
    return res.json({ ok: true, found: false });
  }

  return res.json({ ok: true, found: true, data });
});

app.get('/healthz', (_, res) => res.send('ok'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ TRG Intake Online rodando na porta ${PORT}`);
});
