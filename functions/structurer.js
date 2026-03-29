export async function onRequestPost(context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const { prompt } = await context.request.json();

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${context.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const rawText = await response.text();
    let data;
    try { data = JSON.parse(rawText); }
    catch(e) { return new Response(JSON.stringify({ error: 'Réponse Groq invalide : ' + rawText.substring(0, 200) }), { status: 500, headers }); }

    if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

    const text = data.choices?.[0]?.message?.content || '';
    return new Response(JSON.stringify({ text }), { status: 200, headers });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
