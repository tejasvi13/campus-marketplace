import type { ChangeEvent } from "react";

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
  autoComplete?: string;
}

export default function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  hint = "",
  autoComplete = "off",
}: FieldProps) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={name}>
        {label}
      </label>
      <input
        className="field__input"
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      {hint ? <p className="field__hint">{hint}</p> : null}
    </div>
  );
}
