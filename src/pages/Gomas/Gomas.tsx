import {
  IonPage,
  IonContent,
  IonItem,
  IonButton,
  IonList,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonText,
  IonSpinner
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { get, post } from '../../services/api';
import './Gomas.css';
interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
}

interface Goma {
  id: number;
  vehiculo_id: number;
  posicion: string;
  eje: number;
  estado: string;
  totalPinchazos: number;
}

const Gomas = () => {
  const [vehiculoId, setVehiculoId] = useState<string>('');
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [gomas, setGomas] = useState<Goma[]>([]);
  const [cantidadRuedas, setCantidadRuedas] = useState<number>(0);
  const [mensaje, setMensaje] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingVehiculos, setLoadingVehiculos] = useState<boolean>(false);

  const cargarVehiculos = async () => {
    setLoadingVehiculos(true);
    setMensaje('');

    try {
      const res = await get('/vehiculos');

      if (res.success) {
        setVehiculos(Array.isArray(res.data) ? res.data : []);
      } else {
        setVehiculos([]);
        setMensaje(res.message || 'No se pudieron cargar los vehículos');
      }
    } catch (error) {
      setVehiculos([]);
      setMensaje('No se pudo conectar con el servidor');
    } finally {
      setLoadingVehiculos(false);
    }
  };

  const cargarGomas = async () => {
    if (!vehiculoId) {
      setMensaje('Selecciona un vehículo');
      setGomas([]);
      setCantidadRuedas(0);
      return;
    }

    setLoading(true);
    setMensaje('');

    try {
      const res = await get(`/gomas?vehiculo_id=${vehiculoId}`);

      if (res.success) {
        setCantidadRuedas(res.data?.cantidadRuedas || 0);
        setGomas(res.data?.gomas || []);

        if (!res.data?.gomas || res.data.gomas.length === 0) {
          setMensaje('No hay gomas registradas para este vehículo');
        }
      } else {
        setGomas([]);
        setCantidadRuedas(0);
        setMensaje(res.message || 'No se pudieron cargar las gomas');
      }
    } catch (error) {
      setGomas([]);
      setCantidadRuedas(0);
      setMensaje('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (gomaId: number, nuevoEstado: string) => {
    setLoading(true);
    setMensaje('');

    try {
      const res = await post('/gomas/actualizar', {
        goma_id: gomaId,
        estado: nuevoEstado
      });

      if (res.success) {
        setMensaje('Estado actualizado correctamente');
        await cargarGomas();
      } else {
        setMensaje(res.message || 'No se pudo actualizar la goma');
      }
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const registrarPinchazo = async (gomaId: number) => {
    setLoading(true);
    setMensaje('');

    try {
      const res = await post('/gomas/pinchazos', {
        goma_id: gomaId,
        descripcion: 'Pinchazo registrado desde la app',
        fecha: new Date().toISOString().split('T')[0]
      });

      if (res.success) {
        setMensaje('Pinchazo registrado correctamente');
        await cargarGomas();
      } else {
        setMensaje(res.message || 'No se pudo registrar el pinchazo');
      }
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1>Gomas del Vehículo</h1>
        <p>Consulta, actualiza estado y registra pinchazos</p>

        <IonItem>
          <IonSelect
            label="Vehículo"
            labelPlacement="stacked"
            value={vehiculoId}
            placeholder={loadingVehiculos ? 'Cargando vehículos...' : 'Selecciona un vehículo'}
            onIonChange={(e) => setVehiculoId(e.detail.value)}
          >
            {vehiculos.map((vehiculo) => (
              <IonSelectOption key={vehiculo.id} value={String(vehiculo.id)}>
                {vehiculo.marca} {vehiculo.modelo} {vehiculo.anio}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <div style={{ marginTop: '16px' }}>
          <IonButton
            expand="block"
            onClick={cargarGomas}
            disabled={loading || loadingVehiculos || !vehiculoId}
          >
            {loading ? <IonSpinner name="crescent" /> : 'Cargar gomas'}
          </IonButton>
        </div>

        {mensaje && (
          <IonText color="primary">
            <p style={{ textAlign: 'center', marginTop: '12px' }}>{mensaje}</p>
          </IonText>
        )}

        {cantidadRuedas > 0 && (
          <IonText color="medium">
            <p style={{ textAlign: 'center', marginTop: '12px' }}>
              Cantidad de ruedas: {cantidadRuedas}
            </p>
          </IonText>
        )}

        <IonList>
          {gomas.map((goma, index) => (
            <IonItem key={goma.id || index}>
              <IonLabel>
                <h2>{goma.posicion || `Goma ${index + 1}`}</h2>
                <p>Eje: {goma.eje}</p>
                <p>Estado actual: {goma.estado}</p>
                <p>Pinchazos: {goma.totalPinchazos}</p>

                <IonSelect
                  placeholder="Cambiar estado"
                  interface="popover"
                  onIonChange={(e) => actualizarEstado(goma.id, e.detail.value)}
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
                  disabled={loading}
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