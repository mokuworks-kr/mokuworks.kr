type InquiryEmail = {
  name: string;
  email: string;
  company?: string | null;
  workTypeNames: string[];
  workOther?: string | null;
  budgetRange?: string | null;
  timeline?: string | null;
  message: string;
};

export async function sendInquiryNotification(payload: InquiryEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!apiKey || !adminEmail) {
    return { skipped: true as const };
  }

  const lines = [
    `<p><strong>이름:</strong> ${escapeHtml(payload.name)}</p>`,
    `<p><strong>이메일:</strong> ${escapeHtml(payload.email)}</p>`,
    payload.company &&
      `<p><strong>회사/소속:</strong> ${escapeHtml(payload.company)}</p>`,
    `<p><strong>작업 종류:</strong> ${payload.workTypeNames.map(escapeHtml).join(", ") || "—"}</p>`,
    payload.workOther &&
      `<p><strong>기타 작업:</strong> ${escapeHtml(payload.workOther)}</p>`,
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
      from: "mokuworks <onboarding@resend.dev>",
      to: [adminEmail],
      reply_to: payload.email,
      subject: `[mokuworks] 새 문의 — ${payload.name}`,
      html: lines.join(""),
    }),
  });

  if (!res.ok) {
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
