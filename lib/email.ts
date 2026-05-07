type InquiryEmail = {
  name: string;
  email: string;
  company?: string | null;
  formatNames: string[];
  formatOther?: string | null;
  budgetRange?: string | null;
  timeline?: string | null;
  message: string;
};

export async function sendInquiryNotification(payload: InquiryEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const fromAddr = process.env.EMAIL_FROM ?? "mokuworks <onboarding@resend.dev>";

  if (!apiKey || !adminEmail) {
    console.warn(
      "[email] RESEND_API_KEY or ADMIN_EMAIL missing — notification skipped",
    );
    return { skipped: true as const };
  }

  const lines = [
    `<p><strong>이름:</strong> ${escapeHtml(payload.name)}</p>`,
    `<p><strong>이메일:</strong> ${escapeHtml(payload.email)}</p>`,
    payload.company &&
      `<p><strong>회사/소속:</strong> ${escapeHtml(payload.company)}</p>`,
    `<p><strong>포맷:</strong> ${payload.formatNames.map(escapeHtml).join(", ") || "—"}</p>`,
    payload.formatOther &&
      `<p><strong>기타 포맷:</strong> ${escapeHtml(payload.formatOther)}</p>`,
    payload.budgetRange &&
      `<p><strong>예산:</strong> ${escapeHtml(payload.budgetRange)}</p>`,
    payload.timeline &&
      `<p><strong>일정:</strong> ${escapeHtml(payload.timeline)}</p>`,
    `<p><strong>메시지:</strong></p><p>${escapeHtml(payload.message).replace(/\n/g, "<br/>")}</p>`,
  ].filter(Boolean);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddr,
      to: [adminEmail],
      reply_to: payload.email,
      subject: `[mokuworks] 새 문의 — ${payload.name}`,
      html: lines.join(""),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[email] Resend send failed:", res.status, detail);
    return { skipped: false as const, ok: false as const };
  }
  return { skipped: false as const, ok: true as const };
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
