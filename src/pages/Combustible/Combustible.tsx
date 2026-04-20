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

const Combustible = () => {
  const [vehiculoId, setVehiculoId] = useState('');
  const [tipo, setTipo] = useState('combustible');
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('galones');
  const [monto, setMonto] = useState('');
  const [registros, setRegistros] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const cargarRegistros = async () => {
    if (!vehiculoId.trim()) return;

    setLoading(true);
    setMensaje('');

    try {
      const res = await get(`/combustibles?vehiculo_id=${vehiculoId}`);

      if (res.success) {
        setRegistros(res.data || []);
      } else {
        setMensaje(res.message || 'No se pudieron cargar los registros');
      }
    } catch (error) {
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
      const res = await post('/combustibles', {
        vehiculo_id: Number(vehiculoId),
        tipo,
        cantidad: Number(cantidad),
        unidad,
        monto: Number(monto)
      });

      if (res.success) {
        setMensaje('Registro guardado correctamente');
        setCantidad('');
        setMonto('');
        cargarRegistros();
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
    if (vehiculoId) {
      cargarRegistros();
    }
  }, [vehiculoId]);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1>Combustible y Aceite</h1>
        <p>Registra cargas de combustible o cambios de aceite</p>

        <IonItem>
          <IonInput
            label="Vehículo ID"
            labelPlacement="stacked"
            type="number"
            value={vehiculoId}
            onIonInput={(e) => setVehiculoId(e.detail.value || '')}
          />
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

        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <IonButton expand="block" onClick={guardarRegistro} disabled={loading}>
            {loading ? <IonSpinner name="crescent" /> : 'Guardar registro'}
          </IonButton>

          <IonButton expand="block" fill="outline" onClick={cargarRegistros}>
            Cargar registros
          </IonButton>
        </div>

        {mensaje && (
          <IonText color="primary">
            <p style={{ textAlign: 'center', marginTop: '12px' }}>{mensaje}</p>
          </IonText>
        )}

        <IonList>
          {registros.map((item, index) => (
            <IonItem key={item.id || index}>
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