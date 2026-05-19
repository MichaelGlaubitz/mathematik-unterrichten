export const STORAGE_CHANGED_EVENT = "lehrerstimme:storage";

export function notifyStorageChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(STORAGE_CHANGED_EVENT));
}

export function subscribeStorageChanged(onChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const handler = () => onChange();
  window.addEventListener("storage", handler);
  window.addEventListener(STORAGE_CHANGED_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(STORAGE_CHANGED_EVENT, handler);
  };
}
