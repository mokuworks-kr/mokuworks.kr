"use server";

import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendInquiryNotification } from "@/lib/email";

export type InquiryState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; error: string };

const OTHER_MARKER = "other";

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim();
  const budgetRange = String(formData.get("budget_range") ?? "").trim() || null;
  const timeline = String(formData.get("timeline") ?? "").trim() || null;
  const workOther = String(formData.get("work_other") ?? "").trim() || null;
  const workTypeIds = formData.getAll("work_types").map(String);
  const includeOther = formData.get("work_types_other") === "on";

  if (!name || !email || !message) {
    return {
      status: "error",
      error: "이름, 이메일, 메시지는 필수입니다.",
    };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", error: "이메일 형식을 확인해주세요." };
  }

  const workTypes = includeOther
    ? [...workTypeIds, OTHER_MARKER]
    : workTypeIds;

  const supabase = createServiceRoleClient();

  const { error } = await supabase.from("inquiries").insert({
    name,
    email,
    company,
    message,
    work_types: workTypes,
    work_other: includeOther ? workOther : null,
    budget_range: budgetRange,
    timeline,
  });

  if (error) {
    return { status: "error", error: "문의 저장에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }

  let workTypeNames: string[] = [];
  if (workTypeIds.length > 0) {
    const { data: tagRows } = await supabase
      .from("tags")
      .select("name")
      .in("id", workTypeIds);
    workTypeNames = tagRows?.map((t) => t.name) ?? [];
  }
  if (includeOther) workTypeNames.push("기타");

  await sendInquiryNotification({
    name,
    email,
    company,
    workTypeNames,
    workOther: includeOther ? workOther : null,
    budgetRange,
    timeline,
    message,
  });

  return { status: "success" };
}
