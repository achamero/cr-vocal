exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    const { prompt } = JSON.parse(event.body);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    // Lire comme texte d'abord pour diagnostiquer les erreurs non-JSON
    const rawText = await response.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch(e) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: `Réponse Groq non-JSON : ${rawText.substring(0, 200)}` }) };
    }

    if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

    const text = data.choices?.[0]?.message?.content || '';
    return { statusCode: 200, headers, body: JSON.stringify({ text }) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
