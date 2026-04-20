import { IonPage, IonContent, IonSpinner } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { post } from '../../services/api';
import './Activar.css';

const Activar: React.FC = () => {
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar]   = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const history = useHistory();

  const handleActivar = async () => {
    if (!contrasena || !confirmar) { setError('Completa todos los campos'); return; }
    if (contrasena.length < 6)     { setError('Minimo 6 caracteres'); return; }
    if (contrasena !== confirmar)  { setError('Las contrasenas no coinciden'); return; }

    setLoading(true); setError('');
    try {
      const tokenTemporal = localStorage.getItem('tokenTemporal');
      const res = await post('/auth/activar', { token: tokenTemporal, contrasena }, false);
      if (res.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        history.push('/login');
      } else {
        setError(res.message || 'Error al activar la cuenta');
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
            <h2 className="az-card-titulo">Activar cuenta</h2>
            <p className="az-card-desc">
              Establece una contrasena de minimo 6 caracteres para activar tu cuenta.
            </p>

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

            <div className="az-field">
              <label className="az-label">Confirmar contrasena</label>
              <div className="az-input-wrap">
                <KeyRound size={15} className="az-input-icon" />
                <input
                  className="az-input"
                  type="password"
                  placeholder="••••••"
                  value={confirmar}
                  onChange={e => setConfirmar(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="az-error">{error}</p>}

            <button className="az-btn-primary" onClick={handleActivar} disabled={loading}>
              {loading
                ? <IonSpinner name="crescent" style={{ width: 18, height: 18 }} />
                : <><ShieldCheck size={16} /> Activar cuenta</>
              }
            </button>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Activar;