exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  let groqResponse = null;

  try {
    const { base64, mimeType, filename } = JSON.parse(event.body);

    const buffer = Buffer.from(base64, 'base64');
    const boundary = '----WhistBoundary' + Date.now();
    const CRLF = '\r\n';

    // Forcer mp4 pour aac/m4a (Whisper accepte mp4)
    const ext = filename.split('.').pop().toLowerCase();
    let safeMime = mimeType || 'audio/mpeg';
    let safeFilename = filename;

    // Normalisation des types MIME pour Whisper
    if (ext === 'aac' || ext === 'm4a') {
      safeMime = 'audio/mp4';
      safeFilename = filename.replace(/\.(aac|m4a)$/i, '.mp4');
    } else if (ext === 'mp3') {
      safeMime = 'audio/mpeg';
    } else if (ext === 'wav') {
      safeMime = 'audio/wav';
    } else if (ext === 'ogg') {
      safeMime = 'audio/ogg';
    } else if (ext === 'webm') {
      safeMime = 'audio/webm';
    }

    const filePart = Buffer.concat([
      Buffer.from(
        `--${boundary}${CRLF}` +
        `Content-Disposition: form-data; name="file"; filename="${safeFilename}"${CRLF}` +
        `Content-Type: ${safeMime}${CRLF}${CRLF}`
      ),
      buffer,
      Buffer.from(CRLF),
    ]);

    const modelPart = Buffer.from(
      `--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="model"${CRLF}${CRLF}` +
      `whisper-large-v3-turbo${CRLF}`
    );

    const langPart = Buffer.from(
      `--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="language"${CRLF}${CRLF}` +
      `fr${CRLF}`
    );

    const responseFmtPart = Buffer.from(
      `--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="response_format"${CRLF}${CRLF}` +
      `json${CRLF}`
    );

    const closing = Buffer.from(`--${boundary}--${CRLF}`);
    const body = Buffer.concat([filePart, modelPart, langPart, responseFmtPart, closing]);

    groqResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body,
    });

    // Lire la réponse comme texte d'abord pour éviter les erreurs de parsing
    const rawText = await groqResponse.text();

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseErr) {
      // Si Groq renvoie du texte brut (rare), on le traite comme transcription
      if (rawText && rawText.length > 0 && !rawText.startsWith('<')) {
        return { statusCode: 200, headers, body: JSON.stringify({ text: rawText }) };
      }
      throw new Error(`Réponse Groq invalide : ${rawText.substring(0, 100)}`);
    }

    if (data.error) {
      const msg = typeof data.error === 'string' ? data.error : (data.error.message || JSON.stringify(data.error));
      throw new Error(msg);
    }

    const text = data.text || '';
    return { statusCode: 200, headers, body: JSON.stringify({ text }) };

  } catch (err) {
    console.error('Transcription error:', err.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Erreur inconnue lors de la transcription' }),
    };
  }
};
