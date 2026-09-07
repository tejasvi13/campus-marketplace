export default function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  hint = "",
  autoComplete = "off",
}) {
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
