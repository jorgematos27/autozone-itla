import {
  IonPage,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonText,
  IonSpinner,
  IonSelect,
  IonSelectOption,
  IonList,
  IonLabel
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { get, post } from '../../services/api';

interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
}

interface RegistroCombustible {
  id: number;
  tipo: string;
  cantidad: number;
  unidad: string;
  monto: number;
}

const Combustible = () => {
  const [vehiculoId, setVehiculoId] = useState<string>('');
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [tipo, setTipo] = useState<string>('combustible');
  const [cantidad, setCantidad] = useState<string>('');
  const [unidad, setUnidad] = useState<string>('galones');
  const [monto, setMonto] = useState<string>('');
  const [registros, setRegistros] = useState<RegistroCombustible[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingVehiculos, setLoadingVehiculos] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>('');

  const cargarVehiculos = async () => {
    setLoadingVehiculos(true);
    setMensaje('');

    try {
      const res = await get('/vehiculos');

      if (res.success) {
        setVehiculos(res.data || []);
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

  const cargarRegistros = async () => {
    if (!vehiculoId) {
      setRegistros([]);
      setMensaje('Selecciona un vehículo');
      return;
    }

    setLoading(true);
    setMensaje('');

    try {
      const res = await get(`/combustibles?vehiculo_id=${vehiculoId}`);

      if (res.success) {
        setRegistros(res.data || []);
      } else {
        setRegistros([]);
        setMensaje(res.message || 'No se pudieron cargar los registros');
      }
    } catch (error) {
      setRegistros([]);
      setMensaje('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const guardarRegistro = async () => {
    if (!vehiculoId || !cantidad || !monto) {
      setMensaje('Completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    setMensaje('');

    try {
      const payload = {
        vehiculo_id: Number(vehiculoId),
        tipo,
        cantidad: Number(cantidad),
        unidad,
        monto: Number(monto)
      };

      const res = await post('/combustibles', payload);

      if (res.success) {
        setMensaje('Registro guardado correctamente');
        setCantidad('');
        setMonto('');
        await cargarRegistros();
      } else {
        setMensaje(res.message || 'No se pudo guardar el registro');
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

  useEffect(() => {
    if (vehiculoId) {
      cargarRegistros();
    } else {
      setRegistros([]);
    }
  }, [vehiculoId]);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1>Combustible y Aceite</h1>
        <p>Registra cargas de combustible o cambios de aceite</p>

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

        <IonItem>
          <IonSelect
            label="Tipo"
            labelPlacement="stacked"
            value={tipo}
            onIonChange={(e) => setTipo(e.detail.value)}
          >
            <IonSelectOption value="combustible">Combustible</IonSelectOption>
            <IonSelectOption value="aceite">Aceite</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonInput
            label="Cantidad"
            labelPlacement="stacked"
            type="number"
            value={cantidad}
            onIonInput={(e) => setCantidad(e.detail.value || '')}
          />
        </IonItem>

        <IonItem>
          <IonSelect
            label="Unidad"
            labelPlacement="stacked"
            value={unidad}
            onIonChange={(e) => setUnidad(e.detail.value)}
          >
            <IonSelectOption value="galones">Galones</IonSelectOption>
            <IonSelectOption value="litros">Litros</IonSelectOption>
            <IonSelectOption value="qt">QT</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonInput
            label="Monto (RD$)"
            labelPlacement="stacked"
            type="number"
            value={monto}
            onIonInput={(e) => setMonto(e.detail.value || '')}
          />
        </IonItem>

        <div
          style={{
            marginTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <IonButton
            expand="block"
            onClick={guardarRegistro}
            disabled={loading || loadingVehiculos}
          >
            {loading ? <IonSpinner name="crescent" /> : 'Guardar registro'}
          </IonButton>

          <IonButton
            expand="block"
            fill="outline"
            onClick={cargarRegistros}
            disabled={!vehiculoId || loading}
          >
            Cargar registros
          </IonButton>
        </div>

        {mensaje && (
          <IonText color="primary">
            <p style={{ textAlign: 'center', marginTop: '12px' }}>{mensaje}</p>
          </IonText>
        )}

        <IonList>
          {registros.map((item) => (
            <IonItem key={item.id}>
              <IonLabel>
                <h2>{item.tipo}</h2>
                <p>
                  Cantidad: {item.cantidad} {item.unidad}
                </p>
                <p>Monto: RD$ {item.monto}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Combustible;