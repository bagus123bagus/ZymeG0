import { useEffect, useState } from 'react';

export interface Notif {
  icon: string;
  text: string;
  time: string;
}

interface Props {
  notifs: Notif[];
}

export default function NotifPanel({ notifs }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (open && !target.closest('.notif-panel') && !target.closest('.icon-btn')) {
        setOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open]);

  // expose open via bell - we use a global event
  useEffect(() => {
    function bellHandler() {
      setOpen((o) => !o);
    }
    const bell = document.querySelector('.icon-btn[aria-label="Notifikasi"]');
    if (bell) bell.addEventListener('click', bellHandler);
    return () => {
      if (bell) bell.removeEventListener('click', bellHandler);
    };
  }, []);

  return (
    <div className={`notif-overlay${open ? ' active' : ''}`}>
      <div className="notif-panel">
        <h4>Notifikasi</h4>
        {notifs.length === 0 ? (
          <div className="notif-empty">Belum ada notifikasi</div>
        ) : (
          notifs.map((n, i) => (
            <div className="notif-item" key={i}>
              <div className="ni-icon">
                <i className={`fa-solid ${n.icon}`} />
              </div>
              <div className="ni-body">
                <p>{n.text}</p>
                <span>{n.time}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
