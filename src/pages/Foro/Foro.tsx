import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { get, post } from '../../services/api';
import './Foro.css';

interface Tema {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  vehiculo: string;
  vehiculoFoto: string;
  autor: string;
  totalRespuestas: number;
  ultimaRespuesta?: string;
}

interface Respuesta {
  id: number;
  contenido: string;
  fecha: string;
  autor: string;
}

interface TemaDetalle extends Tema {
  respuestas: Respuesta[];
}

const Foro: React.FC = () => {
  const [vista, setVista] = useState<'todos' | 'mis-temas'>('todos');
  const [temas, setTemas] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);
  const [detalle, setDetalle] = useState<TemaDetalle | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [vehiculos, setVehiculos] = useState<{ id: number; apodo: string; marca: string; modelo: string }[]>([]);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [respondiendo, setRespondiendo] = useState(false);
  const history = useHistory();

  const [formTema, setFormTema] = useState({ vehiculo_id: '', titulo: '', descripcion: '' });
  const [formRespuesta, setFormRespuesta] = useState('');

  useEffect(() => { cargarTemas(); cargarVehiculos(); }, []);

  const cargarTemas = async (seccion = 'todos') => {
    setLoading(true);
    setError('');
    try {
      const endpoint = seccion === 'mis-temas' ? '/foro/mis-temas' : '/foro/temas';
      const res = await get(endpoint);
      if (res.success) setTemas(res.data || []);
      else setError(res.message || 'Error al cargar temas');
    } catch { setError('No se pudo conectar'); }
    finally { setLoading(false); }
  };

  const cargarVehiculos = async () => {
    try {
      const res = await get('/vehiculos');
      if (res.success) setVehiculos(res.data || []);
    } catch {}
  };

  const cambiarVista = (v: 'todos' | 'mis-temas') => {
    setVista(v);
    setTemas([]);
    cargarTemas(v);
  };

  const verDetalle = async (id: number) => {
    setLoadingDetalle(true);
    setDetalle(null);
    try {
      const res = await get(`/foro/detalle?id=${id}`);
      if (res.success) setDetalle(res.data);
      else setError(res.message || 'Error al cargar detalle');
    } catch { setError('No se pudo conectar'); }
    finally { setLoadingDetalle(false); }
  };

  const handleCrearTema = async () => {
    if (!formTema.vehiculo_id || !formTema.titulo || !formTema.descripcion) {
      setError('Completa todos los campos');
      return;
    }
    setGuardando(true);
    setError('');
    try {
      const res = await post('/foro/crear', {
        vehiculo_id: Number(formTema.vehiculo_id),
        titulo: formTema.titulo,
        descripcion: formTema.descripcion
      });
      if (res.success) {
        setMensaje('Tema creado correctamente');
        setMostrarForm(false);
        setFormTema({ vehiculo_id: '', titulo: '', descripcion: '' });
        cargarTemas(vista);
      } else {
        setError(res.message || 'Error al crear tema');
      }
    } catch { setError('No se pudo conectar'); }
    finally { setGuardando(false); }
  };

  const handleResponder = async () => {
    if (!formRespuesta.trim()) { setError('Escribe una respuesta'); return; }
    if (!detalle) return;
    setRespondiendo(true);
    setError('');
    try {
      const res = await post('/foro/responder', {
        tema_id: detalle.id,
        contenido: formRespuesta
      });
      if (res.success) {
        setFormRespuesta('');
        setMensaje('Respuesta publicada');
        verDetalle(detalle.id);
      } else {
        setError(res.message || 'Error al responder');
      }
    } catch { setError('No se pudo conectar'); }
    finally { setRespondiendo(false); }
  };

  const formatFecha = (f: string) => {
    try { return new Date(f).toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch { return f; }
  };

  return (
    <IonPage>
      <IonContent className="foro-content">
        <div className="foro-wrapper">

          <header className="foro-header">
            <button className="btn-volver" onClick={() => history.push('/dashboard')}>Volver</button>
            <h1 className="foro-titulo">Foro</h1>
            <button className="btn-nuevo" onClick={() => { setMostrarForm(true); setError(''); }}>Nuevo</button>
          </header>

          {mensaje && <p className="msg-ok">{mensaje}</p>}
          {error && !mostrarForm && !detalle && <p className="msg-error">{error}</p>}

          <div className="foro-tabs">
            <button
              className={`tab-btn ${vista === 'todos' ? 'activo' : ''}`}
              onClick={() => cambiarVista('todos')}
            >
              Todos los temas
            </button>
            <button
              className={`tab-btn ${vista === 'mis-temas' ? 'activo' : ''}`}
              onClick={() => cambiarVista('mis-temas')}
            >
              Mis temas
            </button>
          </div>

          {loading ? (
            <div className="foro-loading"><IonSpinner name="crescent" /></div>
          ) : temas.length === 0 ? (
            <div className="foro-vacio">
              <p>No hay temas en esta seccion.</p>
              <button className="btn-nuevo-grande" onClick={() => setMostrarForm(true)}>
                Crear primer tema
              </button>
            </div>
          ) : (
            <div className="foro-lista">
              {temas.map(t => (
                <div key={t.id} className="foro-card" onClick={() => verDetalle(t.id)}>
                  <div className="foro-card-top">
                    {t.vehiculoFoto && (
                      <img src={t.vehiculoFoto} alt={t.vehiculo} className="foro-veh-foto" />
                    )}
                    <div className="foro-card-info">
                      <span className="foro-card-titulo">{t.titulo}</span>
                      <span className="foro-card-autor">{t.autor} &middot; {t.vehiculo}</span>
                    </div>
                  </div>
                  <p className="foro-card-desc">{t.descripcion}</p>
                  <div className="foro-card-bottom">
                    <span className="foro-fecha">{formatFecha(t.fecha)}</span>
                    <span className="foro-respuestas">
                      {t.totalRespuestas} respuesta{t.totalRespuestas !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal crear tema */}
          {mostrarForm && (
            <div className="modal-overlay" onClick={() => setMostrarForm(false)}>
              <div className="modal-box" onClick={e => e.stopPropagation()}>
                <h2 className="modal-titulo">Nuevo Tema</h2>

                <div className="form-campo">
                  <label className="form-label">Vehiculo * (debe tener foto)</label>
                  <select
                    className="form-input"
                    value={formTema.vehiculo_id}
                    onChange={e => setFormTema(prev => ({ ...prev, vehiculo_id: e.target.value }))}
                  >
                    <option value="">Selecciona un vehiculo</option>
                    {vehiculos.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.apodo} - {v.marca} {v.modelo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-campo">
                  <label className="form-label">Titulo *</label>
                  <input
                    className="form-input"
                    type="text"
                    value={formTema.titulo}
                    onChange={e => setFormTema(prev => ({ ...prev, titulo: e.target.value }))}
                    placeholder="Ej: Ruido en el motor"
                  />
                </div>

                <div className="form-campo">
                  <label className="form-label">Descripcion *</label>
                  <textarea
                    className="form-input form-textarea"
                    value={formTema.descripcion}
                    onChange={e => setFormTema(prev => ({ ...prev, descripcion: e.target.value }))}
                    placeholder="Describe tu consulta con detalle..."
                    rows={4}
                  />
                </div>

                {error && <p className="msg-error">{error}</p>}

                <div className="modal-acciones">
                  <button className="btn-cancelar" onClick={() => { setMostrarForm(false); setError(''); }}>
                    Cancelar
                  </button>
                  <button className="btn-guardar" onClick={handleCrearTema} disabled={guardando}>
                    {guardando ? <IonSpinner name="crescent" /> : 'Publicar'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal detalle */}
          {loadingDetalle && (
            <div className="modal-overlay">
              <div className="modal-box" style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <IonSpinner name="crescent" />
              </div>
            </div>
          )}

          {detalle && !loadingDetalle && (
            <div className="modal-overlay" onClick={() => { setDetalle(null); setError(''); setMensaje(''); }}>
              <div className="modal-box detalle-box" onClick={e => e.stopPropagation()}>
                <div className="detalle-header">
                  {detalle.vehiculoFoto && (
                    <img src={detalle.vehiculoFoto} alt={detalle.vehiculo} className="detalle-veh-foto" />
                  )}
                  <div>
                    <h2 className="detalle-titulo">{detalle.titulo}</h2>
                    <span className="detalle-meta">{detalle.autor} &middot; {detalle.vehiculo} &middot; {formatFecha(detalle.fecha)}</span>
                  </div>
                </div>

                <p className="detalle-desc">{detalle.descripcion}</p>

                <div className="detalle-separador">
                  <span>{detalle.totalRespuestas} respuesta{detalle.totalRespuestas !== 1 ? 's' : ''}</span>
                </div>

                <div className="detalle-respuestas">
                  {detalle.respuestas?.length === 0 && (
                    <p className="sin-respuestas">Se el primero en responder.</p>
                  )}
                  {detalle.respuestas?.map(r => (
                    <div key={r.id} className="respuesta-card">
                      <div className="respuesta-meta">
                        <span className="respuesta-autor">{r.autor}</span>
                        <span className="respuesta-fecha">{formatFecha(r.fecha)}</span>
                      </div>
                      <p className="respuesta-contenido">{r.contenido}</p>
                    </div>
                  ))}
                </div>

                {error && <p className="msg-error">{error}</p>}
                {mensaje && <p className="msg-ok">{mensaje}</p>}

                <div className="responder-box">
                  <textarea
                    className="form-input form-textarea"
                    value={formRespuesta}
                    onChange={e => setFormRespuesta(e.target.value)}
                    placeholder="Escribe tu respuesta..."
                    rows={3}
                  />
                  <div className="modal-acciones">
                    <button className="btn-cancelar" onClick={() => { setDetalle(null); setError(''); setMensaje(''); }}>
                      Cerrar
                    </button>
                    <button className="btn-guardar" onClick={handleResponder} disabled={respondiendo}>
                      {respondiendo ? <IonSpinner name="crescent" /> : 'Responder'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Foro;