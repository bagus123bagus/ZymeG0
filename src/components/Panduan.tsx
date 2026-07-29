import { useState } from 'react';
import { BookOpen, Sparkles, Leaf, FlaskConical, Home, Trash2, PhoneCall, ChevronDown, ExternalLink, ChevronRight } from 'lucide-react';

const GFORM_URL = 'https://forms.gle/zymego-konsultasi';

const sections = [
  {
    id: 'apa',
    icon: <Leaf className="w-5 h-5" />,
    title: 'Apa itu Ecoenzyme?',
    body: 'Ecoenzyme adalah cairan hasil fermentasi limbah dapur (kulit buah & sayuran) yang dicampur gula merah dan air. Proses fermentasi 3 bulan menghasilkan enzim multiguna yang ramah lingkungan.',
  },
  {
    id: 'manfaat',
    icon: <Sparkles className="w-5 h-5" />,
    title: 'Manfaat',
    body: 'Membersihkan permukaan, menetralisir bau, mengurai pestisida pada sayur, menyuburkan tanaman, dan mengurangi limbah organik yang berakhir di TPA.',
  },
  {
    id: 'riset',
    icon: <FlaskConical className="w-5 h-5" />,
    title: 'Riset & Kandungan',
    body: 'Ecoenzyme mengandung enzim protease, lipase, dan amilase serta bakteri baik. Berbagai studi menunjukkan efektivitasnya sebagai pembersih alami dan dekomposer organik.',
  },
];

const tips = [
  {
    icon: <FlaskConical className="w-5 h-5" />,
    title: 'Cara Membuat',
    steps: [
      'Siapkan 1 bagian gula merah, 3 bagian limbah buah/sayur, 10 bagian air.',
      'Campur dalam wadah tertutup, simpan 3 bulan, buang gas setiap hari di bulan pertama.',
      'Saring cairan hasil fermentasi — siap digunakan sebagai ecoenzyme.',
    ],
  },
  {
    icon: <Home className="w-5 h-5" />,
    title: 'Pembersih Rumah',
    steps: [
      'Campur 1 tutup ecoenzyme + 1 liter air untuk pembersih lantai.',
      'Untuk deterjen: rasio 1:10 dengan air, rendam pakaian 15 menit.',
      'Semprotkan rasio 1:20 untuk hilangkan bau di kamar mandi.',
    ],
  },
  {
    icon: <Trash2 className="w-5 h-5" />,
    title: 'Mengurangi Sampah',
    steps: [
      'Pisahkan limbah buah & sayur dari sampah lain sejak di dapur.',
      'Setor ke Ecoenzyme Center atau jadikan ecoenzyme sendiri.',
      'Kurangi sampah organik ke TPA — 1 kg limbah = 1 poin ZymeGo.',
    ],
  },
];

export default function Panduan() {
  const [open, setOpen] = useState<string | null>('apa');

  return (
    <div className="px-4 py-5">
      <div className="mb-5">
        <div className="flex items-center gap-2 text-[#4a9a2a] mb-1">
          <BookOpen className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wide">Panduan</span>
        </div>
        <h1 className="text-2xl font-bold text-stone-900">Panduan Ecoenzyme</h1>
        <p className="text-stone-500 text-sm mt-0.5">Apa itu, manfaat, riset &amp; tips memanfaatkannya.</p>
      </div>

      {/* Accordion */}
      <div className="space-y-2.5 mb-6">
        {sections.map((s) => {
          const isOpen = open === s.id;
          return (
            <div key={s.id} className="rounded-2xl bg-white border border-stone-200 overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : s.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <div className="w-9 h-9 rounded-xl bg-[#eaf5d6] text-[#4a9a2a] flex items-center justify-center flex-shrink-0">
                  {s.icon}
                </div>
                <span className="font-semibold text-stone-800 text-sm flex-1">{s.title}</span>
                <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-sm text-stone-600 leading-relaxed animate-in fade-in slide-in-from-top duration-200">
                  {s.body}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <h2 className="font-bold text-stone-800 text-sm mb-2.5">Tips Praktis</h2>
      <div className="space-y-3 mb-6">
        {tips.map((t) => (
          <div key={t.title} className="rounded-2xl bg-white border border-stone-200 p-4">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                {t.icon}
              </div>
              <h3 className="font-semibold text-stone-800 text-sm">{t.title}</h3>
            </div>
            <ol className="space-y-2">
              {t.steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-xs text-stone-600">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-stone-100 text-stone-600 text-[10px] font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      {/* Layanan Konsultasi */}
      <div className="rounded-3xl bg-gradient-to-br from-[#4a9a2a] to-[#2d6a1f] text-white p-5 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1.5">
            <PhoneCall className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-100">Layanan Konsultasi</span>
          </div>
          <h2 className="text-lg font-bold mb-1">Butuh bantuan terkait ecoenzyme?</h2>
          <p className="text-emerald-100 text-xs mb-4">Konsultasi gratis seputar pembuatan, penggunaan, dan pengelolaan limbah organik.</p>
          <a
            href={GFORM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 bg-white text-[#3a7a1a] font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors"
          >
            Daftar Konsultasi <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <p className="text-emerald-200 text-[10px] mt-2">Anda akan diarahkan ke Google Form.</p>
        </div>
      </div>
    </div>
  );
}
