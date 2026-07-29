import { useState, type FormEvent } from 'react';
import { supabase, type Deposit } from '../lib/supabase';
import { useAuth } from '../lib/auth';

interface Props {
  onSaved: (d: Deposit) => void;
}

const quickWeights = [0.5, 1, 2.5, 5, 10];

export default function SetorLimbah({ onSaved }: Props) {
  const { user } = useAuth();
  const [wasteType, setWasteType] = useState<'Limbah Buah' | 'Limbah Sayuran'>('Limbah Buah');
  const [keterangan, setKeterangan] = useState('');
  const [berat, setBerat] = useState('1.0');
  const [method, setMethod] = useState<'antar' | 'jemput'>('antar');
  const [catatan, setCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const beratNum = parseFloat(berat) || 0;
  const poin = Math.round(beratNum * 10);
  const harga = Math.round(beratNum * 500);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!user) return;
    if (beratNum < 0.1) {
      setError('Masukkan berat limbah yang valid');
      return;
    }
    setSubmitting(true);
    const payload = {
      jenis_limbah: wasteType === 'Limbah Buah' ? 'Buah' : 'Sayuran',
      berat_kg: beratNum,
      keterangan: keterangan.trim() || catatan.trim(),
      opsi: method === 'antar' ? 'Antar' : 'Jemput',
      lokasi_mitra: method === 'jemput' ? catatan.trim() : null,
    };
    const { data, error: insErr } = await supabase
      .from('deposits')
      .insert(payload)
      .select('id, user_id, jenis_limbah, berat_kg, keterangan, opsi, lokasi_mitra, poin, harga, status, created_at')
      .maybeSingle();
    setSubmitting(false);
    if (insErr || !data) {
      setError(insErr?.message || 'Gagal menyimpan setoran.');
      return;
    }
    onSaved(data as Deposit);
    setKeterangan('');
    setCatatan('');
    setBerat('1.0');
  }

  return (
    <section className="view active" data-view="setor">
      <div className="page-header">
        <div className="header-accent" />
        <h2>Setor Limbah</h2>
      </div>
      <div className="form-card">
        {/* Section: Jenis Limbah */}
        <div className="form-section-label">
          <i className="fa-solid fa-leaf" /> Jenis Limbah
        </div>
        <div className="waste-chip-grid">
          <div
            className={`waste-chip${wasteType === 'Limbah Buah' ? ' selected' : ''}`}
            onClick={() => setWasteType('Limbah Buah')}
          >
            <i className="fa-solid fa-apple-whole" />
            <span>Limbah Buah</span>
          </div>
          <div
            className={`waste-chip${wasteType === 'Limbah Sayuran' ? ' selected' : ''}`}
            onClick={() => setWasteType('Limbah Sayuran')}
          >
            <i className="fa-solid fa-carrot" />
            <span>Limbah Sayuran</span>
          </div>
        </div>

        {/* Section: Keterangan */}
        <div className="form-section-label">
          <i className="fa-solid fa-pen-to-square" /> Keterangan
        </div>
        <div className="inline-input">
          <i className="fa-solid fa-pencil" />
          <input
            type="text"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            placeholder="Jelaskan jenis limbah yang disetor..."
            maxLength={200}
          />
        </div>

        {/* Section: Berat */}
        <div className="form-section-label">
          <i className="fa-solid fa-weight-hanging" /> Berat Limbah
        </div>
        <div className="weight-input-wrapper">
          <input
            type="number"
            min="0.1"
            max="100"
            step="0.1"
            value={berat}
            onChange={(e) => setBerat(e.target.value)}
          />
          <span className="unit">kg</span>
        </div>
        <div className="quick-weight-row">
          {quickWeights.map((w) => (
            <button
              key={w}
              className={`quick-weight-btn${beratNum === w ? ' active' : ''}`}
              onClick={() => setBerat(String(w))}
              type="button"
            >
              {w} kg
            </button>
          ))}
        </div>

        {/* Section: Metode */}
        <div className="form-section-label">
          <i className="fa-solid fa-route" /> Metode Setor
        </div>
        <div className="radio-group">
          <div
            className={`radio-option${method === 'antar' ? ' selected' : ''}`}
            onClick={() => setMethod('antar')}
          >
            <input type="radio" name="method" value="antar" checked={method === 'antar'} readOnly />
            <span className="label">🚶 Antar</span>
            <span className="sub-label">Datang ke Ecoenzyme Center</span>
          </div>
          <div
            className={`radio-option${method === 'jemput' ? ' selected' : ''}`}
            onClick={() => setMethod('jemput')}
          >
            <input type="radio" name="method" value="jemput" checked={method === 'jemput'} readOnly />
            <span className="label">🚗 Jemput</span>
            <span className="sub-label">Di lokasi mitra</span>
          </div>
        </div>

        <div className={`pickup-detail${method === 'jemput' ? ' show' : ''}`}>
          <i className="fa-solid fa-truck" style={{ marginRight: '0.5rem' }} />
          <strong>Layanan Jemput</strong>
          <br />
          Minimal setor 5 kg, gratis ongkir. Tulis alamat lengkap di catatan.
        </div>

        {/* Section: Catatan */}
        <div className="form-section-label">
          <i className="fa-solid fa-note-sticky" /> Catatan (opsional)
        </div>
        <textarea
          className="form-textarea"
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          placeholder="Tambahkan catatan..."
        />

        {/* Estimate */}
        <div className="estimate-box">
          <span className="label">
            <i className="fa-solid fa-calculator" style={{ marginRight: '0.3rem' }} />
            Estimasi Poin Didapat
          </span>
          <span className="value">
            <i className="fa-solid fa-star" style={{ color: 'var(--gold)', fontSize: '0.85rem' }} />
            {poin}
          </span>
        </div>

        {error && <div className="login-error" style={{ marginBottom: '1.4rem' }}>{error}</div>}

        <button
          className={`btn-submit${submitting ? ' loading' : ''}`}
          onClick={handleSubmit}
          disabled={submitting}
        >
          <span className="btn-label">{submitting ? 'Memproses...' : 'Setor Sekarang'}</span>
          <span className="spin" />
        </button>
      </div>
    </section>
  );
}
