/**
 * Hilfs-Store für `useSyncExternalStore`: erst nach einem Microtask-Tick
 * wird die Version erhöht — damit matcht der erste Client-Snapshot dem Server (`0`).
 */
export function createVersionedStore() {
  let version = 0;
  const listeners = new Set<() => void>();
  let didPrime = false;

  const bump = () => {
    version += 1;
    listeners.forEach((listener) => listener());
  };

  const subscribe = (onStoreChange: () => void) => {
    listeners.add(onStoreChange);
    if (!didPrime) {
      didPrime = true;
      queueMicrotask(() => {
        bump();
      });
    }
    return () => {
      listeners.delete(onStoreChange);
    };
  };

  const getSnapshot = () => version;
  const getServerSnapshot = () => 0;

  return { subscribe, getSnapshot, getServerSnapshot, bump };
}
