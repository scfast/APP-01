export function json(data: any, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Credentials": "true",
      ...(init.headers || {})
    }
  });
}

export function errorJson(err: any, status = 500) {
  return json(
    {
      error: err?.message || String(err),
      stack: err?.stack || null
    },
    { status }
  );
}
