import {
  IonPage, IonContent, IonItem, IonLabel,
  IonInput, IonButton, IonText, IonSpinner
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { post } from '../../services/api';
import './Activar.css';

const Activar: React.FC = () => {
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();

  const handleActivar = async () => {
    if (!contrasena || !confirmar) {
      setError('Completa todos los campos');
      return;
    }
    if (contrasena.length < 6) {
      setError('La contraseña debe tener mínimo 6 caracteres');
      return;
    }
    if (contrasena !== confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError('');

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
    } catch (e) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="activar-content">
        <div className="activar-container">
          <div className="activar-header">
            <h1>🔑 Activar Cuenta</h1>
            <p>Establece tu contraseña para continuar</p>
          </div>

          <div className="activar-form">
            <IonItem>
              <IonLabel position="floating">Contraseña</IonLabel>
              <IonInput
                type="password"
                value={contrasena}
                onIonChange={e => setContrasena(e.detail.value!)}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Confirmar contraseña</IonLabel>
              <IonInput
                type="password"
                value={confirmar}
                onIonChange={e => setConfirmar(e.detail.value!)}
              />
            </IonItem>

            {error && (
              <IonText color="danger">
                <p className="error-text">{error}</p>
              </IonText>
            )}

            <IonButton
              expand="block"
              className="activar-btn"
              onClick={handleActivar}
              disabled={loading}
            >
              {loading ? <IonSpinner name="crescent" /> : 'Activar Cuenta'}
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Activar;