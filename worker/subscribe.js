const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "https://skill7.dev",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "600",
        },
      });
    }

    if (request.method !== "POST") {
      return Response.json({ ok: false, error: "method not allowed" }, { status: 405 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ ok: false, error: "invalid JSON" }, { status: 400 });
    }

    const email = (body.email || "").trim().toLowerCase();
    if (!email || !EMAIL_RE.test(email) || email.length > 254) {
      return Response.json({ ok: false, error: "invalid email" }, { status: 400 });
    }

    const res = await fetch(
      `https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!res.ok && res.status !== 409) {
      const text = await res.text();
      console.error("resend error", res.status, text);
      return Response.json({ ok: false, error: "subscription failed" }, { status: 502 });
    }

    return Response.json({ ok: true }, {
      headers: {
        "Access-Control-Allow-Origin": "https://skill7.dev",
      },
    });
  },
};
