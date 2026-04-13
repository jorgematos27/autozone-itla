import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { get, post, postForm } from '../../services/api';
import './Vehiculos.css';

interface Vehiculo {
  id: number;
  apodo: string;
  marca: string;
  modelo: string;
  ano: number;
  color: string;
  placa: string;
  chasis: string;
  kilometraje: number;
  fotoUrl: string;
  totalGastos: number;
  totalIngresos: number;
}

const Vehiculos: React.FC = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<Vehiculo | null>(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const history = useHistory();

  const [form, setForm] = useState({
    apodo: '', marca: '', modelo: '', ano: '',
    color: '', placa: '', kilometraje: '', chasis: '',
    cantidadRuedas: ''
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
    setForm({
      apodo: '', marca: '', modelo: '', ano: '',
      color: '', placa: '', kilometraje: '', chasis: '',
      cantidadRuedas: ''
    });
    setEditando(null);
    setError('');
    setMensaje('');
  };

  const abrirCrear = () => { limpiarForm(); setMostrarForm(true); };

  const abrirEditar = (v: Vehiculo) => {
    setForm({
      apodo: v.apodo,
      marca: v.marca,
      modelo: v.modelo,
      ano: String(v.ano),
      color: v.color,
      placa: v.placa,
      kilometraje: String(v.kilometraje),
      chasis: v.chasis || '',
      cantidadRuedas: ''
    });
    setEditando(v);
    setMostrarForm(true);
  };

  const handleGuardar = async () => {
    if (!form.apodo || !form.marca || !form.modelo || !form.ano || !form.placa || !form.chasis || !form.cantidadRuedas) {
      setError('Completa los campos obligatorios: apodo, marca, modelo, ano, placa, chasis y cantidad de ruedas');
      return;
    }

    try {
      const datos = {
        placa: form.placa.trim(),
        chasis: form.chasis.trim(),
        marca: form.marca.trim(),
        modelo: form.modelo.trim(),
        anio: Number(form.ano),
        cantidadRuedas: Number(form.cantidadRuedas)
      };

      const res = editando
        ? await post(`/vehiculos/editar`, { id: editando.id, ...datos })
        : await post('/vehiculos', datos);

      if (res.success) {
        setMensaje(editando ? 'Vehiculo actualizado' : 'Vehiculo creado');
        setMostrarForm(false);
        limpiarForm();
        cargarVehiculos();
      } else {
        setError(res.message || 'Error al guardar');
      }
    } catch { setError('No se pudo conectar'); }
  };

  // ⚠️ NO EXISTE ENDPOINT EN LA API
  const handleEliminar = async (id: number) => {
    alert('Eliminar no disponible en la API');
  };

  const handleFoto = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setSubiendo(true);

    try {
      const formData = new FormData();

      formData.append('datax', JSON.stringify({ id }));
      formData.append('foto', archivo);

      const res = await postForm(`/vehiculos/foto`, formData);

      if (res.success) {
        setMensaje('Foto actualizada');
        cargarVehiculos();
      } else {
        setError(res.message || 'Error al subir foto');
      }
    } catch {
      setError('No se pudo subir la foto');
    } finally {
      setSubiendo(false);
    }
  };

  const campo = (key: keyof typeof form, label: string, tipo = 'text') => (
    <div className="form-campo">
      <label className="form-label">{label}</label>
      <input
        className="form-input"
        type={tipo}
        value={form[key]}
        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
        placeholder={label}
      />
    </div>
  );

  return (
    <IonPage>
      <IonContent className="veh-content">
        <div className="veh-wrapper">

          <header className="veh-header">
            <button className="btn-volver" onClick={() => history.push('/dashboard')}>Volver</button>
            <h1 className="veh-titulo">Mis Vehiculos</h1>
            <button className="btn-nuevo" onClick={abrirCrear}>Nuevo</button>
          </header>

          {mensaje && <p className="msg-ok">{mensaje}</p>}
          {error && <p className="msg-error">{error}</p>}

          {loading ? (
            <div className="veh-loading"><IonSpinner name="crescent" /></div>
          ) : vehiculos.length === 0 ? (
            <div className="veh-vacio">
              <p>No tienes vehiculos registrados.</p>
              <button className="btn-nuevo-grande" onClick={abrirCrear}>Agregar primer vehiculo</button>
            </div>
          ) : (
            <div className="veh-lista">
              {vehiculos.map(v => (
                <div key={v.id} className="veh-card">
                  <div className="veh-card-foto-wrap">
                    <img
                      src={v.fotoUrl || 'https://dummyimage.com/80x60/cccccc/000000&text=Auto'}
                      alt={v.apodo}
                      className="veh-foto"
                    />
                    {subiendo ? (
                      <div className="veh-foto-overlay"><IonSpinner name="crescent" /></div>
                    ) : (
                      <label className="veh-foto-btn">
                        Foto
                        <input type="file" accept="image/*" capture="environment"
                          onChange={e => handleFoto(e, v.id)} style={{ display: 'none' }} />
                      </label>
                    )}
                  </div>

                  <div className="veh-card-info">
                    <span className="veh-apodo">{v.apodo}</span>
                    <span className="veh-detalle">{v.marca} {v.modelo} {v.ano}</span>
                    <span className="veh-detalle">{v.placa} &middot; {v.color}</span>
                    <span className="veh-km">{v.kilometraje?.toLocaleString()} km</span>
                  </div>

                  <div className="veh-card-fin">
                    <div className="fin-fila">
                      <span className="fin-label">Gastos</span>
                      <span className="fin-valor fin-gasto">RD$ {v.totalGastos?.toLocaleString() || 0}</span>
                    </div>
                    <div className="fin-fila">
                      <span className="fin-label">Ingresos</span>
                      <span className="fin-valor fin-ingreso">RD$ {v.totalIngresos?.toLocaleString() || 0}</span>
                    </div>
                  </div>

                  <div className="veh-card-acciones">
                    <button className="btn-editar" onClick={() => abrirEditar(v)}>Editar</button>
                    <button className="btn-eliminar" onClick={() => handleEliminar(v.id)}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {mostrarForm && (
            <div className="modal-overlay" onClick={() => setMostrarForm(false)}>
              <div className="modal-box" onClick={e => e.stopPropagation()}>
                <h2 className="modal-titulo">{editando ? 'Editar Vehiculo' : 'Nuevo Vehiculo'}</h2>
                {campo('apodo', 'Apodo *')}
                {campo('marca', 'Marca *')}
                {campo('modelo', 'Modelo *')}
                {campo('ano', 'Ano *', 'number')}
                {campo('chasis', 'Chasis *')}
                {campo('placa', 'Placa *')}
                {campo('color', 'Color')}
                {campo('kilometraje', 'Kilometraje', 'number')}
                {campo('cantidadRuedas', 'Cantidad de ruedas *', 'number')}
                {error && <p className="msg-error">{error}</p>}
                <div className="modal-acciones">
                  <button className="btn-cancelar" onClick={() => { setMostrarForm(false); limpiarForm(); }}>Cancelar</button>
                  <button className="btn-guardar" onClick={handleGuardar}>Guardar</button>
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