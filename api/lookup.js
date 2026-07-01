const APP_ID = 'cli_aac9dbe6b97adbfc';
const APP_SECRET = 'dD5j3sgKVNkSdSRyy2J9sejpASgQlpVR';

async function getTenantAccessToken() {
  const res = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET }),
  });
  const data = await res.json();
  if (data.code !== 0) throw new Error('获取 token 失败: ' + data.msg);
  return data.tenant_access_token;
}

export default async function handler(req, res) {
  const phone = req.query.phone;
  if (!phone) {
    return res.status(400).json({ error: '请提供 phone 参数，例如 ?phone=13800138000' });
  }
  try {
    const token = await getTenantAccessToken();
    const lookupRes = await fetch('https://open.feishu.cn/open-apis/contact/v3/users/batch_get_id?user_id_type=open_id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ mobiles: [phone] }),
    });
    const data = await lookupRes.json();
    if (data.code !== 0) {
      return res.status(400).json({ error: data.msg, code: data.code });
    }
    res.status(200).json(data.data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
