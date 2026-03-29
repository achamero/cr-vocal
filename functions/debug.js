export async function onRequestGet(context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  const hasKey = !!(context.env.GROQ_API_KEY);
  const keyPreview = hasKey ? context.env.GROQ_API_KEY.substring(0, 8) + '...' : 'NON DÉFINIE';

  // Test rapide vers Groq
  let groqStatus = 'non testé';
  let groqError = null;
  if (hasKey) {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${context.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Dis juste: OK' }],
        }),
      });
      const txt = await r.text();
      const d = JSON.parse(txt);
      groqStatus = d.choices ? '✓ Groq répond correctement' : '✗ Réponse inattendue : ' + txt.substring(0, 100);
    } catch(e) {
      groqStatus = '✗ Erreur';
      groqError = e.message;
    }
  }

  return new Response(JSON.stringify({
    cloudflare_function: '✓ Fonction active',
    groq_key_presente: hasKey,
    groq_key_apercu: keyPreview,
    groq_test: groqStatus,
    groq_erreur: groqError,
  }, null, 2), { status: 200, headers });
}
