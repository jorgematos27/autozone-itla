import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { LogIn, KeyRound, Hash } from 'lucide-react';
import { post } from '../../services/api';
import './Login.css';

const Login: React.FC = () => {
  const [matricula, setMatricula]   = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    if (!matricula || !contrasena) { setError('Completa todos los campos'); return; }
    setLoading(true); setError('');
    try {
      const res = await post('/auth/login', { matricula, contrasena }, false);
      if (res.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        localStorage.setItem('usuario', JSON.stringify({
          id: res.data.id, nombre: res.data.nombre,
          apellido: res.data.apellido, correo: res.data.correo,
          fotoUrl: res.data.fotoUrl
        }));
        history.push('/dashboard');
      } else {
        setError(res.message || 'Credenciales incorrectas');
      }
    } catch { setError('No se pudo conectar con el servidor'); }
    finally { setLoading(false); }
  };

  const handleOlvidar = async () => {
    if (!matricula) { setError('Ingresa tu matricula primero'); return; }
    try {
      const res = await post('/auth/olvidar', { matricula }, false);
      if (res.success) { setError(''); alert('Se envio una contrasena temporal a tu correo'); }
      else setError(res.message || 'Error al recuperar contrasena');
    } catch { setError('No se pudo conectar con el servidor'); }
  };

  return (
    <IonPage>
      <IonContent className="az-content">
        <div className="az-auth-wrapper">

          <div className="az-brand">
            <div className="az-brand-mark">AZ</div>
            <div>
              <h1 className="az-brand-nombre">AutoZone</h1>
              <p className="az-brand-sub">ITLA — Gestion Vehicular</p>
            </div>
          </div>

          <div className="az-card">
            <h2 className="az-card-titulo">Iniciar sesion</h2>

            <div className="az-field">
              <label className="az-label">Matricula ITLA</label>
              <div className="az-input-wrap">
                <Hash size={15} className="az-input-icon" />
                <input
                  className="az-input"
                  type="text"
                  placeholder="2020-1234"
                  value={matricula}
                  onChange={e => setMatricula(e.target.value)}
                />
              </div>
            </div>

            <div className="az-field">
              <label className="az-label">Contrasena</label>
              <div className="az-input-wrap">
                <KeyRound size={15} className="az-input-icon" />
                <input
                  className="az-input"
                  type="password"
                  placeholder="••••••"
                  value={contrasena}
                  onChange={e => setContrasena(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="az-error">{error}</p>}

            <button className="az-btn-primary" onClick={handleLogin} disabled={loading}>
              {loading
                ? <IonSpinner name="crescent" style={{ width: 18, height: 18 }} />
                : <><LogIn size={16} /> Iniciar sesion</>
              }
            </button>

            <div className="az-divider" />

            <button className="az-btn-ghost" onClick={handleOlvidar}>
              Olvide mi contrasena
            </button>
            <button className="az-btn-ghost" onClick={() => history.push('/registro')}>
              No tengo cuenta — Registrarme
            </button>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;