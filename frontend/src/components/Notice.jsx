// tone can be "error" or "good".
export default function Notice({ tone = "error", children }) {
  if (!children) return null;

  return (
    <p className={"notice notice--" + tone} role="status">
      {children}
    </p>
  );
}
