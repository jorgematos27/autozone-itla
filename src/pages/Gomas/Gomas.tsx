import {
  IonPage,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonList,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonText,
  IonSpinner
} from '@ionic/react';
import { useState } from 'react';
import { get, post } from '../../services/api';

const Gomas = () => {
  const [vehiculoId, setVehiculoId] = useState('');
  const [gomas, setGomas] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const cargarGomas = async () => {
    if (!vehiculoId.trim()) {
      setMensaje('Ingresa el ID del vehículo');
      return;
    }

    setLoading(true);
    setMensaje('');

    try {
      const res = await get(`/gomas?vehiculo_id=${vehiculoId}`);

      if (res.success) {
        setGomas(res.data || []);
      } else {
        setMensaje(res.message || 'No se pudieron cargar las gomas');
      }
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (gomaId: number, nuevoEstado: string) => {
    try {
      const res = await post('/gomas/actualizar', {
        goma_id: gomaId,
        estado: nuevoEstado
      });

      if (res.success) {
        setMensaje('Estado actualizado correctamente');
        cargarGomas();
      } else {
        setMensaje(res.message || 'No se pudo actualizar la goma');
      }
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor');
    }
  };

  const registrarPinchazo = async (gomaId: number) => {
    try {
      const res = await post('/gomas/pinchazos', {
        goma_id: gomaId,
        descripcion: 'Pinchazo registrado desde la app',
        fecha: new Date().toISOString().split('T')[0]
      });

      if (res.success) {
        setMensaje('Pinchazo registrado correctamente');
      } else {
        setMensaje(res.message || 'No se pudo registrar el pinchazo');
      }
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor');
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1>Gomas del Vehículo</h1>
        <p>Consulta, actualiza estado y registra pinchazos</p>

        <IonItem>
          <IonInput
            label="Vehículo ID"
            labelPlacement="stacked"
            type="number"
            value={vehiculoId}
            onIonInput={(e) => setVehiculoId(e.detail.value || '')}
          />
        </IonItem>

        <div style={{ marginTop: '16px' }}>
          <IonButton expand="block" onClick={cargarGomas} disabled={loading}>
            {loading ? <IonSpinner name="crescent" /> : 'Cargar gomas'}
          </IonButton>
        </div>

        {mensaje && (
          <IonText color="primary">
            <p style={{ textAlign: 'center', marginTop: '12px' }}>{mensaje}</p>
          </IonText>
        )}

        <IonList>
          {gomas.map((goma, index) => (
            <IonItem key={goma.id || index}>
              <IonLabel>
                <h2>{goma.posicion || `Goma ${index + 1}`}</h2>
                <p>Eje: {goma.eje || 'No disponible'}</p>
                <p>Estado actual: {goma.estado}</p>

                <IonSelect
                  placeholder="Cambiar estado"
                  onIonChange={(e) =>
                    actualizarEstado(goma.id, e.detail.value)
                  }
                >
                  <IonSelectOption value="buena">Buena</IonSelectOption>
                  <IonSelectOption value="regular">Regular</IonSelectOption>
                  <IonSelectOption value="mala">Mala</IonSelectOption>
                  <IonSelectOption value="reemplazada">Reemplazada</IonSelectOption>
                </IonSelect>

                <IonButton
                  size="small"
                  color="warning"
                  onClick={() => registrarPinchazo(goma.id)}
                  style={{ marginTop: '10px' }}
                >
                  Registrar pinchazo
                </IonButton>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Gomas;