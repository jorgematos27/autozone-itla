import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  ArrowLeft, Plus, Car, Camera,
  Pencil, Gauge, TrendingDown, TrendingUp, X
} from 'lucide-react';
import { get, post, postForm } from '../../services/api';
import './Vehiculos.css';

interface Vehiculo {
  id: number;
  placa: string;
  chasis: string;
  marca: string;
  modelo: string;
  anio: number;
  cantidad_ruedas: number;
  foto_url: string;
  fecha_registro: string;
  totalGastos?: number;
  totalIngresos?: number;
}

const Vehiculos: React.FC = () => {
  const [vehiculos, setVehiculos]     = useState<Vehiculo[]>([]);
  const [loading, setLoading]         = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando]       = useState<Vehiculo | null>(null);
  const [error, setError]             = useState('');
  const [mensaje, setMensaje]         = useState('');
  const [subiendo, setSubiendo]       = useState(false);
  const history = useHistory();

  const [form, setForm] = useState({
    apodo: '', marca: '', modelo: '', ano: '',
    color: '', placa: '', kilometraje: '', chasis: '', cantidadRuedas: ''
  });

  useEffect(() => { cargarVehiculos(); }, []);

  const cargarVehiculos = async () => {
    setLoading(true);
    try {
      const res = await get('/vehiculos');
      if (res.success) setVehiculos(res.data);
      else if (res.status === 401) history.push('/login');
    } catch { setError('No se pudo conectar'); }
    finally { setLoading(false); }
  };

  const limpiarForm = () => {
    setForm({ apodo: '', marca: '', modelo: '', ano: '', color: '', placa: '', kilometraje: '', chasis: '', cantidadRuedas: '' });
    setEditando(null); setError(''); setMensaje('');
  };

  const abrirCrear  = () => { limpiarForm(); setMostrarForm(true); };

  const abrirEditar = (v: Vehiculo) => {
    setForm({
      apodo: '',
      marca: v.marca,
      modelo: v.modelo,
      ano: String(v.anio),
      color: '',
      placa: v.placa,
      kilometraje: '',
      chasis: v.chasis,
      cantidadRuedas: String(v.cantidad_ruedas)
    });
    setEditando(v); setMostrarForm(true);
  };

  const handleGuardar = async () => {
    if (!form.marca || !form.modelo || !form.ano || !form.placa || !form.chasis || !form.cantidadRuedas) {
      setError('Completa todos los campos obligatorios'); return;
    }
    try {
      let res;
      if (editando) {
        res = await post('/vehiculos/editar', {
          id: editando.id,
          placa: form.placa.trim(),
          chasis: form.chasis.trim(),
          marca: form.marca.trim(),
          modelo: form.modelo.trim(),
          anio: Number(form.ano),
          cantidadRuedas: Number(form.cantidadRuedas)
        });
      } else {
        const datax = JSON.stringify({
          placa: form.placa.trim(),
          chasis: form.chasis.trim(),
          marca: form.marca.trim(),
          modelo: form.modelo.trim(),
          anio: Number(form.ano),
          cantidadRuedas: Number(form.cantidadRuedas)
        });
        const formData = new FormData();
        formData.append('datax', datax);
        res = await postForm('/vehiculos', formData);
      }

      if (res.success) {
        setMensaje(editando ? 'Vehiculo actualizado' : 'Vehiculo creado');
        setMostrarForm(false); limpiarForm(); cargarVehiculos();
      } else { setError(res.message || 'Error al guardar'); }
    } catch { setError('No se pudo conectar'); }
  };

  const handleFoto = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setSubiendo(true);
    try {
      const formData = new FormData();
      formData.append('datax', JSON.stringify({ id }));
      formData.append('foto', archivo);
      const res = await postForm('/vehiculos/foto', formData);
      if (res.success) { setMensaje('Foto actualizada'); cargarVehiculos(); }
      else setError(res.message || 'Error al subir foto');
    } catch { setError('No se pudo subir la foto'); }
    finally { setSubiendo(false); }
  };

  const campo = (key: keyof typeof form, label: string, tipo = 'text') => (
    <div className="az-field" key={key}>
      <label className="az-label">{label}</label>
      <div className="az-input-wrap">
        <input
          className="az-input"
          type={tipo}
          value={form[key]}
          placeholder={label}
          onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
        />
      </div>
    </div>
  );

  return (
    <IonPage>
      <IonContent className="az-content">
        <div className="veh-wrapper">

          {/* Header */}
          <header className="veh-header">
            <button className="pf-back-btn" onClick={() => history.push('/dashboard')}>
              <ArrowLeft size={16} /><span>Volver</span>
            </button>
            <h1 className="veh-titulo">Mis Vehiculos</h1>
            <button className="veh-btn-nuevo" onClick={abrirCrear}>
              <Plus size={16} />
            </button>
          </header>

          {mensaje && <p className="pf-ok">{mensaje}</p>}
          {error   && <p className="az-error">{error}</p>}

          {loading ? (
            <div className="veh-loading"><IonSpinner name="crescent" /></div>
          ) : vehiculos.length === 0 ? (
            <div className="veh-vacio">
              <Car size={40} className="veh-vacio-icono" />
              <p className="veh-vacio-texto">No tienes vehiculos registrados</p>
              <button className="az-btn-primary veh-btn-primero" onClick={abrirCrear}>
                <Plus size={16} /> Agregar primer vehiculo
              </button>
            </div>
          ) : (
            <div className="veh-lista">
              {vehiculos.map(v => (
                <div key={v.id} className="veh-card">

                  {/* Foto */}
                  <div className="veh-foto-wrap">
                    {subiendo
                      ? <div className="veh-foto-spinner"><IonSpinner name="crescent" /></div>
                      : <img
                          src={v.foto_url || 'https://dummyimage.com/400x200/1E293B/64748B&text=Sin+foto'}
                          alt={v.marca}
                          className="veh-foto"
                        />
                    }
                    <label className="veh-camara-btn" title="Cambiar foto">
                      <Camera size={14} />
                      <input type="file" accept="image/*" capture="environment"
                        onChange={e => handleFoto(e, v.id)} style={{ display: 'none' }} />
                    </label>
                  </div>

                  {/* Info */}
                  <div className="veh-card-body">
                    <div className="veh-card-top">
                      <div>
                        <p className="veh-apodo">{v.marca} {v.modelo}</p>
                        <p className="veh-detalle">{v.placa} · {v.anio}</p>
                        <p className="veh-detalle">{v.chasis}</p>
                      </div>
                      <button className="veh-edit-btn" onClick={() => abrirEditar(v)}>
                        <Pencil size={14} />
                      </button>
                    </div>

                    <div className="veh-km-row">
                      <Gauge size={14} className="veh-km-icono" />
                      <span className="veh-km">{v.cantidad_ruedas} ruedas</span>
                    </div>

                    {/* Financiero */}
                    <div className="veh-fin-row">
                      <div className="veh-fin-item">
                        <TrendingDown size={13} className="fin-icono-gasto" />
                        <span className="fin-label">Gastos</span>
                        <span className="fin-valor fin-gasto">RD$ {v.totalGastos?.toLocaleString() ?? 0}</span>
                      </div>
                      <div className="veh-fin-sep" />
                      <div className="veh-fin-item">
                        <TrendingUp size={13} className="fin-icono-ingreso" />
                        <span className="fin-label">Ingresos</span>
                        <span className="fin-valor fin-ingreso">RD$ {v.totalIngresos?.toLocaleString() ?? 0}</span>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Modal */}
          {mostrarForm && (
            <div className="modal-overlay" onClick={() => setMostrarForm(false)}>
              <div className="modal-box" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="modal-titulo">{editando ? 'Editar vehiculo' : 'Nuevo vehiculo'}</h2>
                  <button className="modal-close" onClick={() => { setMostrarForm(false); limpiarForm(); }}>
                    <X size={18} />
                  </button>
                </div>
                {campo('marca',          'Marca *')}
                {campo('modelo',         'Modelo *')}
                {campo('ano',            'Ano *',               'number')}
                {campo('chasis',         'Chasis *')}
                {campo('placa',          'Placa *')}
                {campo('cantidadRuedas', 'Cantidad de ruedas *', 'number')}
                {error && <p className="az-error">{error}</p>}
                <div className="modal-acciones">
                  <button className="modal-btn-cancelar"
                    onClick={() => { setMostrarForm(false); limpiarForm(); }}>
                    Cancelar
                  </button>
                  <button className="az-btn-primary modal-btn-guardar" onClick={handleGuardar}>
                    {editando ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Vehiculos;