type Props = {
  name: string;
  label: string;
  defaultChecked?: boolean;
};

/**
 * Binary on/off toggle. Native checkbox underneath (sr-only) so form
 * submission behaves identically to a regular `<input type="checkbox">` —
 * `formData.get(name) === "on"` when checked, omitted when unchecked.
 */
export function Toggle({ name, label, defaultChecked = false }: Props) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer w-fit">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="
          relative w-10 h-6 rounded-pill bg-mist transition-colors duration-150
          peer-checked:bg-ink
          peer-focus-visible:ring-2 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-paper
          after:content-[''] after:absolute after:top-0.5 after:left-0.5
          after:w-5 after:h-5 after:rounded-pill after:bg-paper after:shadow-sm
          after:transition-transform after:duration-150
          peer-checked:after:translate-x-4
        "
      />
      <span className="text-body text-ink">{label}</span>
    </label>
  );
}
