import {
  IonPage, IonContent, IonItem, IonLabel,
  IonInput, IonButton, IonText, IonSpinner
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { post } from '../../services/api';
import './Registro.css';

const Registro = () => {
  const [matricula, setMatricula] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();

  const handleRegistro = async () => {
    if (!matricula.trim()) {
      setError('Ingresa tu matrícula');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await post('/auth/registro', { matricula }, false);
      
      if (res.success) {
        
        //aqui lo que se hace es guardar el token temporal que se recibe del backend en el localStorage, junto con la matricula, para luego usarlo en la pagina de activacion
       
        localStorage.setItem('tokenTemporal', res.data.token);
        localStorage.setItem('matricula', matricula);
        history.push('/activar');
      } else {
        setError(res.message || 'Error al registrarse');
      }
    } catch (e) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="registro-content">
        <div className="registro-container">
          <div className="registro-header">
            <h1>🚗 AutoZone</h1>
            <p>Ingresa tu matrícula del ITLA para registrarte</p>
          </div>

          <div className="registro-form">
            <IonItem>
              <IonLabel position="floating">Matrícula ITLA</IonLabel>
              <IonInput
                value={matricula}
                onIonChange={e => setMatricula(e.detail.value)}
                placeholder="Ej: 2020-1234"
                type="text"
              />
            </IonItem>

            {error && (
              <IonText color="danger">
                <p className="error-text">{error}</p>
              </IonText>
            )}

            <IonButton
              expand="block"
              className="registro-btn"
              onClick={handleRegistro}
              disabled={loading}
            >
              {loading ? <IonSpinner name="crescent" /> : 'Registrarme'}
            </IonButton>

            <IonButton
              expand="block"
              fill="clear"
              onClick={() => history.push('/login')}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Registro;