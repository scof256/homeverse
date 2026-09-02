export default function Notice({ notice, error }: { notice?: string; error?: string }) {
  if (!notice && !error) return null;
  const text = error ? decodeURIComponent(error).replaceAll("-", " ") : decodeURIComponent(notice || "").replaceAll("-", " ");
  return <div className={`app-notice ${error ? "error" : "success"}`} role="status">{text}</div>;
}
