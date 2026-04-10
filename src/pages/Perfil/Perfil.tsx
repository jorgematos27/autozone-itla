import {
  IonPage, IonContent, IonSpinner, IonText
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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
  const [loading, setLoading] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const history = useHistory();

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    setLoading(true);
    try {
      const res = await get('/perfil');
      if (res.success) {
        setUsuario(res.data);
      } else if (res.message?.includes('401') || res.message?.includes('token')) {
        history.push('/login');
      } else {
        setError('No se pudo cargar el perfil');
      }
    } catch (e) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setSubiendo(true);
    setError('');
    setMensaje('');

    try {
      const formData = new FormData();
      formData.append('foto', archivo);
      const res = await postForm('/perfil/foto', formData);
      if (res.success) {
        setMensaje('Foto actualizada correctamente');
        cargarPerfil();
      } else {
        setError(res.message || 'Error al subir la foto');
      }
    } catch (e) {
      setError('No se pudo subir la foto');
    } finally {
      setSubiendo(false);
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent className="perfil-content">
          <div className="perfil-loading">
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent className="perfil-content">
        <div className="perfil-wrapper">

          <header className="perfil-header">
            <button className="btn-volver" onClick={() => history.push('/dashboard')}>
              Volver
            </button>
            <h1 className="perfil-titulo">Mi Perfil</h1>
          </header>

          {usuario && (
            <>
              <section className="perfil-foto-seccion">
                <div className="perfil-foto-contenedor">
                  <img
                    src={usuario.fotoUrl || 'https://via.placeholder.com/120'}
                    alt="Foto de perfil"
                    className="perfil-foto"
                  />
                  {subiendo && (
                    <div className="perfil-foto-overlay">
                      <IonSpinner name="crescent" />
                    </div>
                  )}
                </div>
                <label className="btn-cambiar-foto">
                  {subiendo ? 'Subiendo...' : 'Cambiar foto'}
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFoto}
                    style={{ display: 'none' }}
                  />
                </label>
              </section>

              {error && (
                <IonText color="danger">
                  <p className="perfil-mensaje">{error}</p>
                </IonText>
              )}
              {mensaje && (
                <p className="perfil-mensaje perfil-mensaje--ok">{mensaje}</p>
              )}

              <section className="perfil-datos">
                <div className="dato-fila">
                  <span className="dato-label">Nombre</span>
                  <span className="dato-valor">{usuario.nombre} {usuario.apellido}</span>
                </div>
                <div className="dato-fila">
                  <span className="dato-label">Correo</span>
                  <span className="dato-valor">{usuario.correo}</span>
                </div>
                <div className="dato-fila">
                  <span className="dato-label">Rol</span>
                  <span className="dato-valor">{usuario.rol || 'Estudiante'}</span>
                </div>
                <div className="dato-fila">
                  <span className="dato-label">Grupo</span>
                  <span className="dato-valor">{usuario.grupo || 'Sin grupo'}</span>
                </div>
              </section>
            </>
          )}

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Perfil;