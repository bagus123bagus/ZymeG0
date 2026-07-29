import { useEffect, useState } from 'react';

interface Props {
  deposits: any[];
  totalKg: number;
  totalSetor: number;
}

const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export default function Monitoring({ deposits, totalKg, totalSetor }: Props) {
  const [bars, setBars] = useState<number[]>(days.map(() => 0));

  useEffect(() => {
    // group deposits by day of week (last 7 days)
    const today = new Date();
    const dayMap = new Array(7).fill(0);
    deposits.forEach((d) => {
      const date = new Date(d.created_at);
      const diff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && diff < 7) {
        const dow = (date.getDay() + 6) % 7; // Mon=0
        dayMap[dow] += Number(d.berat_kg);
      }
    });
    setBars(dayMap);
  }, [deposits]);

  const maxBar = Math.max(...bars, 1);

  return (
    <section className="view active" data-view="monitoring">
      <div className="page-header">
        <div className="header-accent" />
        <h2>Monitoring</h2>
      </div>
      <div className="chart-card">
        <h3>Limbah Terkumpul Minggu Ini</h3>
        <div className="sub">Total dalam kilogram (kg) per hari</div>
        <div className="bar-chart">
          {days.map((d, i) => (
            <div className={`bar-col${i === days.length - 1 ? ' today' : ''}`} key={i}>
              <div
                className="bar"
                style={{ height: `${(bars[i] / maxBar) * 100}%` }}
              />
              <span>{d}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="monitor-stats">
        <div className="mstat">
          <i className="fa-solid fa-scale-balanced" />
          <div className="num">{totalKg.toFixed(1).replace('.', ',')} kg</div>
          <div className="lbl">Total Bulan Ini</div>
        </div>
        <div className="mstat">
          <i className="fa-solid fa-recycle" />
          <div className="num">{totalSetor}x</div>
          <div className="lbl">Jumlah Setor</div>
        </div>
      </div>
    </section>
  );
}
