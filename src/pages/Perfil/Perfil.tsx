import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ArrowLeft, Camera, User, Mail, Shield, Users } from 'lucide-react';
import { get, postForm } from '../../services/api';
import './Perfil.css';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;
  grupo: string;
  fotoUrl: string;
}

const Perfil: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading]   = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError]       = useState('');
  const [mensaje, setMensaje]   = useState('');
  const history = useHistory();

  useEffect(() => { cargarPerfil(); }, []);

  const cargarPerfil = async () => {
    setLoading(true);
    try {
      const res = await get('/perfil');
      if (res.success) setUsuario(res.data);
      else if (res.message?.includes('401') || res.message?.includes('token')) history.push('/login');
      else setError('No se pudo cargar el perfil');
    } catch { setError('No se pudo conectar con el servidor'); }
    finally { setLoading(false); }
  };

  const handleFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setSubiendo(true); setError(''); setMensaje('');
    try {
      const formData = new FormData();
      formData.append('foto', archivo);
      const res = await postForm('/perfil/foto', formData);
      if (res.success) { setMensaje('Foto actualizada correctamente'); cargarPerfil(); }
      else setError(res.message || 'Error al subir la foto');
    } catch { setError('No se pudo subir la foto'); }
    finally { setSubiendo(false); }
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent className="az-content">
          <div className="pf-loading"><IonSpinner name="crescent" /></div>
        </IonContent>
      </IonPage>
    );
  }

  const campos = usuario ? [
    { label: 'Nombre',  valor: `${usuario.nombre} ${usuario.apellido}`, Icono: User    },
    { label: 'Correo',  valor: usuario.correo,                          Icono: Mail    },
    { label: 'Rol',     valor: usuario.rol     || 'Estudiante',         Icono: Shield  },
    { label: 'Grupo',   valor: usuario.grupo   || 'Sin grupo',          Icono: Users   },
  ] : [];

  return (
    <IonPage>
      <IonContent className="az-content">
        <div className="pf-wrapper">

          {/* Header */}
          <header className="pf-header">
            <button className="pf-back-btn" onClick={() => history.push('/dashboard')}>
              <ArrowLeft size={16} />
              <span>Volver</span>
            </button>
            <h1 className="pf-titulo">Mi perfil</h1>
          </header>

          {usuario && (
            <>
              {/* Foto */}
              <section className="pf-foto-seccion">
                <div className="pf-foto-wrap">
                  {subiendo ? (
                    <div className="pf-foto-spinner"><IonSpinner name="crescent" /></div>
                  ) : (
                    <img
                      src={usuario.fotoUrl || 'https://via.placeholder.com/96'}
                      alt="Foto de perfil"
                      className="pf-foto"
                    />
                  )}
                  <label className="pf-foto-label" title="Cambiar foto">
                    <Camera size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFoto}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                <div className="pf-nombre-bloque">
                  <p className="pf-nombre-grande">{usuario.nombre} {usuario.apellido}</p>
                  <p className="pf-correo-sub">{usuario.correo}</p>
                </div>
              </section>

              {/* Mensajes */}
              {error   && <p className="az-error">{error}</p>}
              {mensaje && <p className="pf-ok">{mensaje}</p>}

              {/* Datos */}
              <section className="pf-datos-card">
                <p className="dash-seccion-label">Informacion de cuenta</p>
                {campos.map(({ label, valor, Icono }) => (
                  <div key={label} className="pf-dato-fila">
                    <div className="pf-dato-izq">
                      <Icono size={14} className="pf-dato-icono" />
                      <span className="pf-dato-label">{label}</span>
                    </div>
                    <span className="pf-dato-valor">{valor}</span>
                  </div>
                ))}
              </section>

              {/* Boton cambiar foto (alternativo para mobile) */}
              <label className="az-btn-primary pf-btn-foto-alt">
                {subiendo
                  ? <IonSpinner name="crescent" style={{ width: 18, height: 18 }} />
                  : <><Camera size={16} /> {subiendo ? 'Subiendo...' : 'Cambiar foto de perfil'}</>
                }
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFoto}
                  style={{ display: 'none' }}
                />
              </label>
            </>
          )}

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Perfil;