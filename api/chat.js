export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key, anthropic-version');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const { system, messages } = req.body;
    const orMessages = [
      ...(system ? [{ role: 'system', content: system }] : []),
      ...messages,
    ];
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + req.headers['x-api-key'],
        'HTTP-Referer': 'https://btc-agent-five.vercel.app',
        'X-Title': 'BTC Agent',
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: orMessages,
        max_tokens: 1000,
      }),
    });
    const data = await response.json();
    if (data.error) {
      return res.status(response.status).json({ error: { message: data.error.message || 'OpenRouter error' } });
    }
    const text = data.choices && data.choices[0] ? data.choices[0].message.content : '（无返回内容）';
    res.status(200).json({ content: [{ type: 'text', text }] });
  } catch(e) {
    res.status(500).json({ error: { message: e.message } });
  }
}
