"use client";

import { useState, useTransition } from "react";

import { createTag, deleteTag, updateTagName } from "./actions";

type Tag = {
  id: string;
  name: string;
  category: string;
  usage_count: number;
};

export function TagsManager({ initialTags }: { initialTags: Tag[] }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-12">
      {error && (
        <p className="text-small text-ink" role="alert">
          {error}
        </p>
      )}
      <CategorySection
        label="Work Type"
        category="type"
        tags={initialTags.filter((t) => t.category === "type")}
        onError={setError}
      />
      <CategorySection
        label="Industry"
        category="industry"
        tags={initialTags.filter((t) => t.category === "industry")}
        onError={setError}
      />
    </div>
  );
}

function CategorySection({
  label,
  category,
  tags,
  onError,
}: {
  label: string;
  category: "type" | "industry";
  tags: Tag[];
  onError: (msg: string | null) => void;
}) {
  const [name, setName] = useState("");
  const [pending, startTransition] = useTransition();

  function handleAdd() {
    if (!name.trim()) return;
    startTransition(async () => {
      onError(null);
      const res = await createTag(name, category);
      if ("error" in res) onError(res.error);
      else setName("");
    });
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-body font-medium text-ink">{label}</h2>

      <ul className="flex flex-col">
        {tags.length === 0 && (
          <li className="text-small text-stone py-2">아직 태그가 없어요.</li>
        )}
        {tags.map((tag) => (
          <TagRow key={tag.id} tag={tag} onError={onError} />
        ))}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="새 태그 이름"
          className="flex-1 bg-cloud text-ink rounded-sm px-4 py-2 text-body placeholder:text-fog focus:outline-none focus:ring-1 focus:ring-ink"
        />
        <button
          type="submit"
          disabled={pending || !name.trim()}
          className="bg-ink text-paper rounded-sm px-6 py-2 text-small font-medium hover:opacity-85 transition-opacity duration-150 disabled:opacity-50"
        >
          추가
        </button>
      </form>
    </section>
  );
}

function TagRow({
  tag,
  onError,
}: {
  tag: Tag;
  onError: (msg: string | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(tag.name);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    if (!name.trim() || name.trim() === tag.name) {
      setEditing(false);
      setName(tag.name);
      return;
    }
    startTransition(async () => {
      onError(null);
      const res = await updateTagName(tag.id, name);
      if ("error" in res) {
        onError(res.error);
        setName(tag.name);
      }
      setEditing(false);
    });
  }

  function handleDelete() {
    const msg =
      tag.usage_count > 0
        ? `이 태그는 ${tag.usage_count}개 작업에서 사용 중입니다. 강제 삭제하시겠습니까? (작업의 태그 목록에서 함께 제거됩니다)`
        : `'${tag.name}' 태그를 삭제하시겠습니까?`;
    if (!confirm(msg)) return;
    startTransition(async () => {
      onError(null);
      const res = await deleteTag(tag.id);
      if ("error" in res) onError(res.error);
    });
  }

  return (
    <li className="flex items-center justify-between gap-2 py-2 border-b border-mist">
      {editing ? (
        <input
          type="text"
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setName(tag.name);
              setEditing(false);
            }
          }}
          className="flex-1 bg-cloud text-ink rounded-sm px-3 py-1 text-body focus:outline-none focus:ring-1 focus:ring-ink"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="flex-1 text-left text-body text-ink hover:opacity-60 transition-opacity duration-150"
          disabled={pending}
        >
          {tag.name}
        </button>
      )}
      <span className="text-caption text-fog">
        {tag.usage_count > 0 ? `${tag.usage_count}개 작업` : "미사용"}
      </span>
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="text-caption text-stone hover:text-ink transition-colors duration-150 disabled:opacity-50"
      >
        삭제
      </button>
    </li>
  );
}
