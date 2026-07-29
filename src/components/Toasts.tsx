import { useState, useCallback } from 'react';

export interface ToastItem {
  id: number;
  msg: string;
  icon: string;
}

export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((msg: string, icon = 'fa-circle-check') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  const ToastContainer = () => (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className="toast show">
          <i className={`fa-solid ${t.icon}`} />
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );

  return { toast, ToastContainer };
}

export default function Toasts() {
  return null;
}
