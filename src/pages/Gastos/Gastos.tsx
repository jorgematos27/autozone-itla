import {
  IonPage,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonList,
  IonText
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { get, post } from '../../services/api';


const Gastos = () => {
  const [modo, setModo] = useState<'gastos' | 'ingresos'>('gastos');
  const [vehiculoId, setVehiculoId] = useState('');
  const [categorias, setCategorias] = useState<any[]>([]);
  const [categoriaId, setCategoriaId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [lista, setLista] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState('');

  const cargarCategorias = async () => {
    try {
      const res = await get('/gastos/categorias');
      if (res.success) setCategorias(res.data || []);
    } catch {}
  };

  const cargarLista = async () => {
    if (!vehiculoId) return;
    try {
      const ruta = modo === 'gastos'
        ? `/gastos?vehiculo_id=${vehiculoId}`
        : `/ingresos?vehiculo_id=${vehiculoId}`;

      const res = await get(ruta);
      if (res.success) setLista(res.data || []);
    } catch {}
  };

  const guardar = async () => {
    setMensaje('');
    try {
      const data = modo === 'gastos'
        ? {
            vehiculo_id: vehiculoId,
            categoria_id: categoriaId,
            descripcion,
            monto: Number(monto)
          }
        : {
            vehiculo_id: vehiculoId,
            descripcion,
            monto: Number(monto)
          };

      const ruta = modo === 'gastos' ? '/gastos' : '/ingresos';
      const res = await post(ruta, data);

      if (res.success) {
        setMensaje('Registro guardado correctamente');
        setDescripcion('');
        setMonto('');
        cargarLista();
      } else {
        setMensaje(res.message || 'No se pudo guardar');
      }
    } catch {
      setMensaje('No se pudo conectar con el servidor');
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  useEffect(() => {
    cargarLista();
  }, [modo, vehiculoId]);

  return (
    <IonPage>
      <IonContent className="gastos-content">
        <div className="gastos-header">
          <h1>Gastos e Ingresos</h1>
        </div>

        <IonSegment value={modo} onIonChange={e => setModo(e.detail.value as 'gastos' | 'ingresos')}>
          <IonSegmentButton value="gastos"><IonLabel>Gastos</IonLabel></IonSegmentButton>
          <IonSegmentButton value="ingresos"><IonLabel>Ingresos</IonLabel></IonSegmentButton>
        </IonSegment>

        <IonItem>
          <IonInput label="Vehículo ID" labelPlacement="stacked" value={vehiculoId} onIonInput={e => setVehiculoId(e.detail.value || '')} />
        </IonItem>

        {modo === 'gastos' && (
          <IonItem>
            <IonSelect label="Categoría" labelPlacement="stacked" value={categoriaId} onIonChange={e => setCategoriaId(e.detail.value)}>
              {categorias.map((cat, index) => (
                <IonSelectOption key={cat.id || index} value={cat.id}>
                  {cat.nombre || cat.descripcion || `Categoría ${index + 1}`}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        )}

        <IonItem>
          <IonInput label="Descripción" labelPlacement="stacked" value={descripcion} onIonInput={e => setDescripcion(e.detail.value || '')} />
        </IonItem>

        <IonItem>
          <IonInput label="Monto" labelPlacement="stacked" type="number" value={monto} onIonInput={e => setMonto(e.detail.value || '')} />
        </IonItem>

        <div className="gastos-actions">
          <IonButton expand="block" onClick={guardar}>Guardar</IonButton>
        </div>

        {mensaje && <IonText><p className="mensaje-box">{mensaje}</p></IonText>}

        <IonList>
          {lista.map((item, index) => (
            <IonItem key={item.id || index}>
              <IonLabel>
                <h2>{item.descripcion || 'Sin descripción'}</h2>
                <p>RD$ {item.monto}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Gastos;