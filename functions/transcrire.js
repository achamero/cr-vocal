export async function onRequest(context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Méthode non autorisée' }), { status: 405, headers });
  }

  try {
    const { base64, mimeType, filename } = await context.request.json();

    const buffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const blob = new Blob([buffer], { type: mimeType });

    const ext = filename.split('.').pop().toLowerCase();
    let safeFilename = filename;
    let safeMime = mimeType;
    if (ext === 'aac' || ext === 'm4a') {
      safeMime = 'audio/mp4';
      safeFilename = filename.replace(/\.(aac|m4a)$/i, '.mp4');
    }

    const form = new FormData();
    form.append('file', new File([blob], safeFilename, { type: safeMime }));
    form.append('model', 'whisper-large-v3-turbo');
    form.append('language', 'fr');
    form.append('response_format', 'json');

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${context.env.GROQ_API_KEY}` },
      body: form,
    });

    const rawText = await response.text();
    let data;
    try { data = JSON.parse(rawText); }
    catch(e) {
      return new Response(JSON.stringify({ error: 'Réponse Groq invalide : ' + rawText.substring(0, 200) }), { status: 500, headers });
    }

    if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

    return new Response(JSON.stringify({ text: data.text || '' }), { status: 200, headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
}
