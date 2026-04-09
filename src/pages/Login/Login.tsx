import {
  IonPage, IonContent, IonItem, IonLabel,
  IonInput, IonButton, IonText, IonSpinner
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { post } from '../../services/api';
import './Login.css';

const Login: React.FC = () => {
  const [matricula, setMatricula] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    if (!matricula || !contrasena) {
      setError('Completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await post('/auth/login', { matricula, contrasena }, false);

      if (res.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        localStorage.setItem('usuario', JSON.stringify({
          id: res.data.id,
          nombre: res.data.nombre,
          apellido: res.data.apellido,
          correo: res.data.correo,
          fotoUrl: res.data.fotoUrl
        }));
        history.push('/dashboard');
      } else {
        setError(res.message || 'Credenciales incorrectas');
      }
    } catch (e) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleOlvidar = async () => {
    if (!matricula) {
      setError('Ingresa tu matrícula primero');
      return;
    }
    try {
      const res = await post('/auth/olvidar', { matricula }, false);
      if (res.success) {
        setError('');
        alert('Se envió una contraseña temporal a tu correo');
      } else {
        setError(res.message || 'Error al recuperar contraseña');
      }
    } catch (e) {
      setError('No se pudo conectar con el servidor');
    }
  };

  return (
    <IonPage>
      <IonContent className="login-content">
        <div className="login-container">
          <div className="login-header">
            <h1>🚗 AutoZone</h1>
            <p>Inicia sesión para continuar</p>
          </div>

          <div className="login-form">
            <IonItem>
              <IonLabel position="floating">Matrícula ITLA</IonLabel>
              <IonInput
                value={matricula}
                onIonChange={e => setMatricula(e.detail.value!)}
                type="text"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Contraseña</IonLabel>
              <IonInput
                type="password"
                value={contrasena}
                onIonChange={e => setContrasena(e.detail.value!)}
              />
            </IonItem>

            {error && (
              <IonText color="danger">
                <p className="error-text">{error}</p>
              </IonText>
            )}

            <IonButton
              expand="block"
              className="login-btn"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? <IonSpinner name="crescent" /> : 'Iniciar Sesión'}
            </IonButton>

            <IonButton
              expand="block"
              fill="clear"
              onClick={handleOlvidar}
            >
              ¿Olvidaste tu contraseña?
            </IonButton>

            <IonButton
              expand="block"
              fill="clear"
              onClick={() => history.push('/registro')}
            >
              ¿No tienes cuenta? Regístrate
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;