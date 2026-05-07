"use client";

import { useActionState, useState } from "react";

import { submitInquiry, type InquiryState } from "./actions";

const BUDGET_OPTIONS = [
  "~50만원",
  "50-100만원",
  "100-300만원",
  "300만원+",
  "협의",
];

const TIMELINE_OPTIONS = ["~2주", "2-4주", "1-2개월", "2개월+", "협의"];

const inputCls =
  "bg-cloud text-ink rounded-sm px-4 py-3 text-body placeholder:text-fog focus:outline-none focus:ring-1 focus:ring-ink";
const labelCls = "text-small text-stone";

type FormatTag = { id: string; name: string };

export function ContactForm({ formatTags }: { formatTags: FormatTag[] }) {
  const [state, formAction, pending] = useActionState<InquiryState, FormData>(
    submitInquiry,
    { status: "idle" },
  );
  const [otherChecked, setOtherChecked] = useState(false);

  if (state.status === "success") {
    return (
      <div className="bg-canvas rounded-sm p-8">
        <p className="text-body text-ink">
          문의가 접수됐어요. 보통 1-2일 안에 회신드릴게요.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Field label="이름" required>
        <input type="text" name="name" required className={inputCls} />
      </Field>

      <Field label="이메일" required>
        <input type="email" name="email" required className={inputCls} />
      </Field>

      <Field label="회사 / 소속">
        <input type="text" name="company" className={inputCls} />
      </Field>

      <fieldset className="flex flex-col gap-3">
        <legend className={labelCls}>어떤 작업을 원하시나요?</legend>
        <div className="flex flex-wrap gap-2">
          {formatTags.map((tag) => (
            <Chip key={tag.id} name="formats" value={tag.id}>
              {tag.name}
            </Chip>
          ))}
          <Chip
            name="formats_other"
            value="on"
            onChange={(e) => setOtherChecked(e.currentTarget.checked)}
          >
            기타
          </Chip>
        </div>
        {otherChecked && (
          <input
            type="text"
            name="format_other"
            placeholder="자세히 적어주세요"
            className={`${inputCls} mt-1`}
          />
        )}
      </fieldset>

      <Field label="예산">
        <select name="budget_range" className={inputCls} defaultValue="">
          <option value="">선택 안 함</option>
          {BUDGET_OPTIONS.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </Field>

      <Field label="일정">
        <select name="timeline" className={inputCls} defaultValue="">
          <option value="">선택 안 함</option>
          {TIMELINE_OPTIONS.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </Field>

      <Field label="메시지" required>
        <textarea
          name="message"
          required
          rows={6}
          className={`${inputCls} resize-y`}
        />
      </Field>

      {state.status === "error" && (
        <p className="text-small text-ink" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-ink text-paper rounded-sm px-8 py-4 text-body font-medium hover:opacity-85 transition-opacity duration-150 disabled:opacity-50 self-end"
      >
        {pending ? "보내는 중..." : "의뢰 보내기"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className={labelCls}>
        {label}
        {required && <span className="text-ink"> *</span>}
      </span>
      {children}
    </label>
  );
}

function Chip({
  name,
  value,
  children,
  onChange,
}: {
  name: string;
  value: string;
  children: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="cursor-pointer">
      <input
        type="checkbox"
        name={name}
        value={value}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className="inline-flex items-center rounded-pill border border-mist px-4 py-1.5 text-small text-stone transition-colors duration-150 hover:border-stone peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper">
        {children}
      </span>
    </label>
  );
}
