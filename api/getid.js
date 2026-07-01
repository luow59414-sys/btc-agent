const APP_ID = 'cli_aac9dbe6b97adbfc';
const APP_SECRET = 'dD5j3sgKVNkSdSRyy2J9sejpASgQlpVR';

async function getTenantAccessToken() {
  const res = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET }),
  });
  const data = await res.json();
  return data.tenant_access_token;
}

export default async function handler(req, res) {
  try {
    const token = await getTenantAccessToken();
    // 获取机器人所在的会话列表
    const r = await fetch('https://open.feishu.cn/open-apis/im/v1/chats?chat_type=p2p&page_size=20', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await r.json();
    res.status(200).json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
