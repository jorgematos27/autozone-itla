import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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

const Mantenimientos: React.FC = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [detalle, setDetalle] = useState<Mantenimiento | null>(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState('');
  const history = useHistory();

  const [form, setForm] = useState({
    vehiculo_id: '',
    tipo: '',
    costo: '',
    piezas: '',
    fecha: new Date().toISOString().split('T')[0]
  });
  const [fotos, setFotos] = useState<File[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

 const cargarDatos = async () => {
  setLoading(true);
  try {
    const resV = await get('/vehiculos');
    if (resV.success && resV.data.length > 0) {
      setVehiculos(resV.data);
      // Carga mantenimientos de todos los vehiculos
      const todos: Mantenimiento[] = [];
      for (const v of resV.data) {
        const resM = await get(`/mantenimientos?vehiculo_id=${v.id}`);
        if (resM.success && resM.data) {
          // Agrega el apodo del vehiculo a cada mantenimiento
          const conVehiculo = resM.data.map((m: Mantenimiento) => ({
            ...m,
            vehiculo: `${v.apodo} - ${v.marca} ${v.modelo}`
          }));
          todos.push(...conVehiculo);
        }
      }
      setMantenimientos(todos);
    }
  } catch {
    setError('No se pudo conectar');
  } finally {
    setLoading(false);
  }
};

const cargarMantenimientos = async (tipo = '') => {
  try {
    const todos: Mantenimiento[] = [];
    for (const v of vehiculos) {
      let endpoint = `/mantenimientos?vehiculo_id=${v.id}`;
      if (tipo) endpoint += `&tipo=${tipo}`;
      const res = await get(endpoint);
      if (res.success && res.data) {
        const conVehiculo = res.data.map((m: Mantenimiento) => ({
          ...m,
          vehiculo: `${v.apodo} - ${v.marca} ${v.modelo}`
        }));
        todos.push(...conVehiculo);
      }
    }
    setMantenimientos(todos);
  } catch {
    setError('No se pudo cargar');
  }
};

  const handleFiltro = (tipo: string) => {
    setFiltroTipo(tipo);
    cargarMantenimientos(tipo);
  };

  const handleFotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivos = Array.from(e.target.files || []);
    if (archivos.length > 5) {
      setError('Maximo 5 fotos por mantenimiento');
      return;
    }
    setFotos(archivos);
    setError('');
  };

  const handleGuardar = async () => {
    if (!form.vehiculo_id || !form.tipo || !form.costo || !form.fecha) {
      setError('Completa los campos obligatorios');
      return;
    }

    setSubiendo(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('datax', JSON.stringify({
        vehiculo_id: Number(form.vehiculo_id),
        tipo: form.tipo,
        costo: Number(form.costo),
        piezas: form.piezas,
        fecha: form.fecha
      }));

      fotos.forEach(foto => {
        formData.append('fotos[]', foto);
      });

      const res = await postForm('/mantenimientos', formData);

      if (res.success) {
        setMensaje('Mantenimiento registrado');
        setMostrarForm(false);
        limpiarForm();
        cargarMantenimientos(filtroTipo);
      } else {
        setError(res.message || 'Error al guardar');
      }
    } catch {
      setError('No se pudo conectar');
    } finally {
      setSubiendo(false);
    }
  };

  const limpiarForm = () => {
    setForm({
      vehiculo_id: '',
      tipo: '',
      costo: '',
      piezas: '',
      fecha: new Date().toISOString().split('T')[0]
    });
    setFotos([]);
    setError('');
  };

  const tiposComunes = [
    'Cambio de aceite', 'Cambio de frenos', 'Cambio de filtro',
    'Revision general', 'Cambio de correa', 'Alineacion y balanceo',
    'Cambio de bateria', 'Reparacion de motor'
  ];

  const mantenimientosFiltrados = filtroTipo
    ? mantenimientos.filter(m => m.tipo.toLowerCase().includes(filtroTipo.toLowerCase()))
    : mantenimientos;

  return (
    <IonPage>
      <IonContent className="mant-content">
        <div className="mant-wrapper">

          <header className="mant-header">
            <button className="btn-volver" onClick={() => history.push('/dashboard')}>Volver</button>
            <h1 className="mant-titulo">Mantenimientos</h1>
            <button className="btn-nuevo" onClick={() => { limpiarForm(); setMostrarForm(true); }}>Nuevo</button>
          </header>

          {mensaje && <p className="msg-ok">{mensaje}</p>}
          {error && !mostrarForm && <p className="msg-error">{error}</p>}

          {/* Filtros por tipo */}
          <div className="mant-filtros">
            <button
              className={`filtro-btn ${filtroTipo === '' ? 'activo' : ''}`}
              onClick={() => handleFiltro('')}
            >
              Todos
            </button>
            {tiposComunes.slice(0, 4).map(t => (
              <button
                key={t}
                className={`filtro-btn ${filtroTipo === t ? 'activo' : ''}`}
                onClick={() => handleFiltro(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="mant-loading"><IonSpinner name="crescent" /></div>
          ) : mantenimientosFiltrados.length === 0 ? (
            <div className="mant-vacio">
              <p>No hay mantenimientos registrados.</p>
              <button className="btn-nuevo-grande" onClick={() => { limpiarForm(); setMostrarForm(true); }}>
                Registrar primero
              </button>
            </div>
          ) : (
            <div className="mant-lista">
              {mantenimientosFiltrados.map(m => (
                <div key={m.id} className="mant-card" onClick={() => setDetalle(m)}>
                  <div className="mant-card-top">
                    <div>
                      <span className="mant-tipo">{m.tipo}</span>
                      <span className="mant-vehiculo">{m.vehiculo}</span>
                    </div>
                    <span className="mant-costo">RD$ {m.costo?.toLocaleString()}</span>
                  </div>
                  <div className="mant-card-bottom">
                    <span className="mant-fecha">{new Date(m.fecha).toLocaleDateString('es-DO')}</span>
                    {m.fotos?.length > 0 && (
                      <span className="mant-fotos-count">{m.fotos.length} foto{m.fotos.length > 1 ? 's' : ''}</span>
                    )}
                  </div>
                  {m.piezas && <p className="mant-piezas">{m.piezas}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Modal formulario */}
          {mostrarForm && (
            <div className="modal-overlay" onClick={() => setMostrarForm(false)}>
              <div className="modal-box" onClick={e => e.stopPropagation()}>
                <h2 className="modal-titulo">Nuevo Mantenimiento</h2>

                <div className="form-campo">
                  <label className="form-label">Vehiculo *</label>
                  <select
                    className="form-input"
                    value={form.vehiculo_id}
                    onChange={e => setForm(prev => ({ ...prev, vehiculo_id: e.target.value }))}
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
                  <label className="form-label">Tipo *</label>
                  <select
                    className="form-input"
                    value={form.tipo}
                    onChange={e => setForm(prev => ({ ...prev, tipo: e.target.value }))}
                  >
                    <option value="">Selecciona un tipo</option>
                    {tiposComunes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                    <option value="otro">Otro</option>
                  </select>
                </div>

                {form.tipo === 'otro' && (
                  <div className="form-campo">
                    <label className="form-label">Especifica el tipo *</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Tipo de mantenimiento"
                      onChange={e => setForm(prev => ({ ...prev, tipo: e.target.value }))}
                    />
                  </div>
                )}

                <div className="form-campo">
                  <label className="form-label">Costo (RD$) *</label>
                  <input
                    className="form-input"
                    type="number"
                    value={form.costo}
                    onChange={e => setForm(prev => ({ ...prev, costo: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>

                <div className="form-campo">
                  <label className="form-label">Piezas utilizadas</label>
                  <input
                    className="form-input"
                    type="text"
                    value={form.piezas}
                    onChange={e => setForm(prev => ({ ...prev, piezas: e.target.value }))}
                    placeholder="Ej: Filtro de aceite, bujias"
                  />
                </div>

                <div className="form-campo">
                  <label className="form-label">Fecha *</label>
                  <input
                    className="form-input"
                    type="date"
                    value={form.fecha}
                    onChange={e => setForm(prev => ({ ...prev, fecha: e.target.value }))}
                  />
                </div>

                <div className="form-campo">
                  <label className="form-label">Fotos (max 5)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFotos}
                    className="form-input-file"
                  />
                  {fotos.length > 0 && (
                    <p className="fotos-seleccionadas">{fotos.length} foto{fotos.length > 1 ? 's' : ''} seleccionada{fotos.length > 1 ? 's' : ''}</p>
                  )}
                </div>

                {error && <p className="msg-error">{error}</p>}

                <div className="modal-acciones">
                  <button className="btn-cancelar" onClick={() => { setMostrarForm(false); limpiarForm(); }}>
                    Cancelar
                  </button>
                  <button className="btn-guardar" onClick={handleGuardar} disabled={subiendo}>
                    {subiendo ? <IonSpinner name="crescent" /> : 'Guardar'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal detalle */}
          {detalle && (
            <div className="modal-overlay" onClick={() => setDetalle(null)}>
              <div className="modal-box" onClick={e => e.stopPropagation()}>
                <h2 className="modal-titulo">{detalle.tipo}</h2>
                <div className="detalle-fila">
                  <span className="detalle-label">Vehiculo</span>
                  <span className="detalle-valor">{detalle.vehiculo}</span>
                </div>
                <div className="detalle-fila">
                  <span className="detalle-label">Costo</span>
                  <span className="detalle-valor">RD$ {detalle.costo?.toLocaleString()}</span>
                </div>
                <div className="detalle-fila">
                  <span className="detalle-label">Fecha</span>
                  <span className="detalle-valor">{new Date(detalle.fecha).toLocaleDateString('es-DO')}</span>
                </div>
                {detalle.piezas && (
                  <div className="detalle-fila">
                    <span className="detalle-label">Piezas</span>
                    <span className="detalle-valor">{detalle.piezas}</span>
                  </div>
                )}
                {detalle.fotos?.length > 0 && (
                  <div className="detalle-galeria">
                    {detalle.fotos.map((f, i) => (
                      <img key={i} src={f} alt={`foto ${i + 1}`} className="detalle-foto" />
                    ))}
                  </div>
                )}
                <button className="btn-cerrar" onClick={() => setDetalle(null)}>Cerrar</button>
              </div>
            </div>
          )}

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Mantenimientos;