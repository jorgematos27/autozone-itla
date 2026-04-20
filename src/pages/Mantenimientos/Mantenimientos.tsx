import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  ArrowLeft, Plus, Wrench, Car, CalendarDays,
  DollarSign, ImageIcon, X, ChevronRight, SlidersHorizontal
} from 'lucide-react';
import { get, post, postForm } from '../../services/api';
import './Mantenimientos.css';

interface Vehiculo {
  id: number;
  apodo: string;
  marca: string;
  modelo: string;
}

interface Mantenimiento {
  id: number;
  tipo: string;
  costo: number;
  piezas: string;
  fecha: string;
  fotos: string[];
  vehiculo: string;
}

const tiposComunes = [
  'Cambio de aceite', 'Cambio de frenos', 'Cambio de filtro',
  'Revision general', 'Cambio de correa', 'Alineacion y balanceo',
  'Cambio de bateria', 'Reparacion de motor'
];

const Mantenimientos: React.FC = () => {
  const [vehiculos, setVehiculos]           = useState<Vehiculo[]>([]);
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [loading, setLoading]               = useState(true);
  const [mostrarForm, setMostrarForm]       = useState(false);
  const [detalle, setDetalle]               = useState<Mantenimiento | null>(null);
  const [error, setError]                   = useState('');
  const [mensaje, setMensaje]               = useState('');
  const [subiendo, setSubiendo]             = useState(false);
  const [filtroTipo, setFiltroTipo]         = useState('');
  const history = useHistory();

  const [form, setForm] = useState({
    vehiculo_id: '', tipo: '', costo: '', piezas: '',
    fecha: new Date().toISOString().split('T')[0]
  });
  const [fotos, setFotos] = useState<File[]>([]);

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const resV = await get('/vehiculos');
      if (resV.success && resV.data.length > 0) {
        setVehiculos(resV.data);
        const todos: Mantenimiento[] = [];
        for (const v of resV.data) {
          const resM = await get(`/mantenimientos?vehiculo_id=${v.id}`);
          if (resM.success && resM.data) {
            todos.push(...resM.data.map((m: Mantenimiento) => ({
              ...m, vehiculo: `${v.apodo} - ${v.marca} ${v.modelo}`
            })));
          }
        }
        setMantenimientos(todos);
      }
    } catch { setError('No se pudo conectar'); }
    finally { setLoading(false); }
  };

  const cargarMantenimientos = async (tipo = '') => {
    try {
      const todos: Mantenimiento[] = [];
      for (const v of vehiculos) {
        let endpoint = `/mantenimientos?vehiculo_id=${v.id}`;
        if (tipo) endpoint += `&tipo=${tipo}`;
        const res = await get(endpoint);
        if (res.success && res.data) {
          todos.push(...res.data.map((m: Mantenimiento) => ({
            ...m, vehiculo: `${v.apodo} - ${v.marca} ${v.modelo}`
          })));
        }
      }
      setMantenimientos(todos);
    } catch { setError('No se pudo cargar'); }
  };

  const handleFiltro = (tipo: string) => {
    setFiltroTipo(tipo);
    cargarMantenimientos(tipo);
  };

  const handleFotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivos = Array.from(e.target.files || []);
    if (archivos.length > 5) { setError('Maximo 5 fotos'); return; }
    setFotos(archivos); setError('');
  };

  const handleGuardar = async () => {
    if (!form.vehiculo_id || !form.tipo || !form.costo || !form.fecha) {
      setError('Completa los campos obligatorios'); return;
    }
    setSubiendo(true); setError('');
    try {
      const formData = new FormData();
      formData.append('datax', JSON.stringify({
        vehiculo_id: Number(form.vehiculo_id), tipo: form.tipo,
        costo: Number(form.costo), piezas: form.piezas, fecha: form.fecha
      }));
      fotos.forEach(f => formData.append('fotos[]', f));
      const res = await postForm('/mantenimientos', formData);
      if (res.success) {
        setMensaje('Mantenimiento registrado');
        setMostrarForm(false); limpiarForm(); cargarMantenimientos(filtroTipo);
      } else { setError(res.message || 'Error al guardar'); }
    } catch { setError('No se pudo conectar'); }
    finally { setSubiendo(false); }
  };

  const limpiarForm = () => {
    setForm({ vehiculo_id: '', tipo: '', costo: '', piezas: '',
      fecha: new Date().toISOString().split('T')[0] });
    setFotos([]); setError('');
  };

  const filtrados = filtroTipo
    ? mantenimientos.filter(m => m.tipo.toLowerCase().includes(filtroTipo.toLowerCase()))
    : mantenimientos;

  return (
    <IonPage>
      <IonContent className="az-content">
        <div className="mant-wrapper">

          {/* Header */}
          <header className="mant-header">
            <button className="pf-back-btn" onClick={() => history.push('/dashboard')}>
              <ArrowLeft size={16} /><span>Volver</span>
            </button>
            <h1 className="mant-titulo">Mantenimientos</h1>
            <button className="veh-btn-nuevo" onClick={() => { limpiarForm(); setMostrarForm(true); }}>
              <Plus size={16} />
            </button>
          </header>

          {mensaje && <p className="pf-ok">{mensaje}</p>}
          {error && !mostrarForm && <p className="az-error">{error}</p>}

          {/* Filtros */}
          <div className="mant-filtros">
            <button
              className={`mant-filtro-btn ${filtroTipo === '' ? 'mant-filtro-btn--activo' : ''}`}
              onClick={() => handleFiltro('')}
            >
              <SlidersHorizontal size={11} /> Todos
            </button>
            {tiposComunes.slice(0, 4).map(t => (
              <button
                key={t}
                className={`mant-filtro-btn ${filtroTipo === t ? 'mant-filtro-btn--activo' : ''}`}
                onClick={() => handleFiltro(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Lista */}
          {loading ? (
            <div className="mant-loading"><IonSpinner name="crescent" /></div>
          ) : filtrados.length === 0 ? (
            <div className="veh-vacio">
              <Wrench size={40} className="veh-vacio-icono" />
              <p className="veh-vacio-texto">No hay mantenimientos registrados</p>
              <button className="az-btn-primary veh-btn-primero"
                onClick={() => { limpiarForm(); setMostrarForm(true); }}>
                <Plus size={16} /> Registrar primero
              </button>
            </div>
          ) : (
            <div className="mant-lista">
              {filtrados.map(m => (
                <div key={m.id} className="mant-card" onClick={() => setDetalle(m)}>
                  <div className="mant-card-izq">
                    <div className="mant-icono-wrap">
                      <Wrench size={16} />
                    </div>
                    <div className="mant-card-info">
                      <span className="mant-tipo">{m.tipo}</span>
                      <span className="mant-vehiculo">
                        <Car size={11} /> {m.vehiculo}
                      </span>
                      {m.piezas && <span className="mant-piezas">{m.piezas}</span>}
                      <div className="mant-meta">
                        <span className="mant-fecha">
                          <CalendarDays size={11} />
                          {new Date(m.fecha).toLocaleDateString('es-DO')}
                        </span>
                        {m.fotos?.length > 0 && (
                          <span className="mant-fotos-tag">
                            <ImageIcon size={11} /> {m.fotos.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mant-card-der">
                    <span className="mant-costo">RD$ {m.costo?.toLocaleString()}</span>
                    <ChevronRight size={14} className="mant-chevron" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal — Nuevo mantenimiento */}
          {mostrarForm && (
            <div className="modal-overlay" onClick={() => setMostrarForm(false)}>
              <div className="modal-box" onClick={e => e.stopPropagation()}>

                <div className="modal-header">
                  <h2 className="modal-titulo">Nuevo mantenimiento</h2>
                  <button className="modal-close" onClick={() => { setMostrarForm(false); limpiarForm(); }}>
                    <X size={18} />
                  </button>
                </div>

                {/* Vehiculo */}
                <div className="az-field">
                  <label className="az-label">Vehiculo *</label>
                  <div className="az-input-wrap">
                    <Car size={14} className="az-input-icon" />
                    <select
                      className="az-input az-select"
                      value={form.vehiculo_id}
                      onChange={e => setForm(prev => ({ ...prev, vehiculo_id: e.target.value }))}
                    >
                      <option value="">Selecciona un vehiculo</option>
                      {vehiculos.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.apodo} — {v.marca} {v.modelo}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tipo */}
                <div className="az-field">
                  <label className="az-label">Tipo *</label>
                  <div className="az-input-wrap">
                    <Wrench size={14} className="az-input-icon" />
                    <select
                      className="az-input az-select"
                      value={form.tipo}
                      onChange={e => setForm(prev => ({ ...prev, tipo: e.target.value }))}
                    >
                      <option value="">Selecciona un tipo</option>
                      {tiposComunes.map(t => <option key={t} value={t}>{t}</option>)}
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>

                {form.tipo === 'otro' && (
                  <div className="az-field">
                    <label className="az-label">Especifica el tipo *</label>
                    <div className="az-input-wrap">
                      <input className="az-input" type="text" placeholder="Tipo de mantenimiento"
                        onChange={e => setForm(prev => ({ ...prev, tipo: e.target.value }))} />
                    </div>
                  </div>
                )}

                {/* Costo */}
                <div className="az-field">
                  <label className="az-label">Costo (RD$) *</label>
                  <div className="az-input-wrap">
                    <DollarSign size={14} className="az-input-icon" />
                    <input className="az-input" type="number" placeholder="0.00"
                      value={form.costo}
                      onChange={e => setForm(prev => ({ ...prev, costo: e.target.value }))} />
                  </div>
                </div>

                {/* Piezas */}
                <div className="az-field">
                  <label className="az-label">Piezas utilizadas</label>
                  <div className="az-input-wrap">
                    <input className="az-input" type="text"
                      placeholder="Ej: Filtro de aceite, bujias"
                      value={form.piezas}
                      onChange={e => setForm(prev => ({ ...prev, piezas: e.target.value }))} />
                  </div>
                </div>

                {/* Fecha */}
                <div className="az-field">
                  <label className="az-label">Fecha *</label>
                  <div className="az-input-wrap">
                    <CalendarDays size={14} className="az-input-icon" />
                    <input className="az-input" type="date"
                      value={form.fecha}
                      onChange={e => setForm(prev => ({ ...prev, fecha: e.target.value }))} />
                  </div>
                </div>

                {/* Fotos */}
                <div className="az-field">
                  <label className="az-label">Fotos (max 5)</label>
                  <label className="mant-file-label">
                    <ImageIcon size={14} />
                    {fotos.length > 0
                      ? `${fotos.length} foto${fotos.length > 1 ? 's' : ''} seleccionada${fotos.length > 1 ? 's' : ''}`
                      : 'Seleccionar fotos'}
                    <input type="file" accept="image/*" multiple
                      onChange={handleFotos} style={{ display: 'none' }} />
                  </label>
                </div>

                {error && <p className="az-error">{error}</p>}

                <div className="modal-acciones">
                  <button className="modal-btn-cancelar"
                    onClick={() => { setMostrarForm(false); limpiarForm(); }}>
                    Cancelar
                  </button>
                  <button className="az-btn-primary modal-btn-guardar"
                    onClick={handleGuardar} disabled={subiendo}>
                    {subiendo
                      ? <IonSpinner name="crescent" style={{ width: 18, height: 18 }} />
                      : 'Guardar'}
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* Modal — Detalle */}
          {detalle && (
            <div className="modal-overlay" onClick={() => setDetalle(null)}>
              <div className="modal-box" onClick={e => e.stopPropagation()}>

                <div className="modal-header">
                  <h2 className="modal-titulo">{detalle.tipo}</h2>
                  <button className="modal-close" onClick={() => setDetalle(null)}>
                    <X size={18} />
                  </button>
                </div>

                <div className="pf-datos-card mant-detalle-card">
                  {[
                    { label: 'Vehiculo', valor: detalle.vehiculo },
                    { label: 'Costo',    valor: `RD$ ${detalle.costo?.toLocaleString()}` },
                    { label: 'Fecha',    valor: new Date(detalle.fecha).toLocaleDateString('es-DO') },
                    ...(detalle.piezas ? [{ label: 'Piezas', valor: detalle.piezas }] : [])
                  ].map(({ label, valor }) => (
                    <div key={label} className="pf-dato-fila">
                      <span className="pf-dato-label">{label}</span>
                      <span className="pf-dato-valor">{valor}</span>
                    </div>
                  ))}
                </div>

                {detalle.fotos?.length > 0 && (
                  <div className="mant-detalle-galeria">
                    <p className="dash-seccion-label" style={{ marginBottom: 10 }}>Fotos</p>
                    <div className="mant-galeria-grid">
                      {detalle.fotos.map((f, i) => (
                        <img key={i} src={f} alt={`foto ${i + 1}`} className="mant-galeria-foto" />
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Mantenimientos;