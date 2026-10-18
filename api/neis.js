const OK = ['schoolInfo', 'mealServiceDietInfo', 'hisTimetable'];
module.exports = async (req, res) => {
  const q = { ...req.query };
  const svc = q.svc;
  delete q.svc;
  if (!OK.includes(svc)) return res.status(400).json({ error: 'bad service' });
  const u = new URL('https://open.neis.go.kr/hub/' + svc);
  for (const k in q) u.searchParams.set(k, q[k]);
  u.searchParams.set('Type', 'json');
  u.searchParams.set('KEY', process.env.NEIS_KEY || '44f1ea356b5649669afd120ead7d77df');
  try {
    const r = await fetch(u);
    const t = await r.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=300');
    res.status(200).send(t);
  } catch (e) {
    res.status(502).json({ error: String(e) });
  }
};
