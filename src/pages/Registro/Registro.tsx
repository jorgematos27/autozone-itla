import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Hash, UserPlus } from 'lucide-react';
import { post } from '../../services/api';
import './Registro.css';

const Registro: React.FC = () => {
  const [matricula, setMatricula] = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const history = useHistory();

  const handleRegistro = async () => {
    if (!matricula.trim()) { setError('Ingresa tu matricula'); return; }
    setLoading(true); setError('');
    try {
      const res = await post('/auth/registro', { matricula }, false);
      if (res.success) {
        localStorage.setItem('tokenTemporal', res.data.token);
        localStorage.setItem('matricula', matricula);
        history.push('/activar');
      } else {
        setError(res.message || 'Error al registrarse');
      }
    } catch { setError('No se pudo conectar con el servidor'); }
    finally { setLoading(false); }
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
            <h2 className="az-card-titulo">Crear cuenta</h2>
            <p className="az-card-desc">
              Ingresa tu matricula del ITLA. Recibirás un token para activar tu cuenta.
            </p>

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

            {error && <p className="az-error">{error}</p>}

            <button className="az-btn-primary" onClick={handleRegistro} disabled={loading}>
              {loading
                ? <IonSpinner name="crescent" style={{ width: 18, height: 18 }} />
                : <><UserPlus size={16} /> Crear cuenta</>
              }
            </button>

            <div className="az-divider" />

            <button className="az-btn-ghost" onClick={() => history.push('/login')}>
              Ya tengo cuenta — Iniciar sesion
            </button>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Registro;