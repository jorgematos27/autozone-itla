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
  IonText,
  IonSpinner
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { get, post } from '../../services/api';
import './Gastos.css';

interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
}

interface CategoriaGasto {
  id: number;
  nombre: string;
}

interface Gasto {
  id: number;
  vehiculo_id: number;
  categoria_id: number;
  categoriaNombre: string;
  monto: number;
  descripcion: string;
  fecha: string;
}

interface Ingreso {
  id: number;
  vehiculo_id: number;
  monto: number;
  concepto: string;
  fecha: string;
}

const Gastos = () => {
  const [modo, setModo] = useState<'gastos' | 'ingresos'>('gastos');
  const [vehiculoId, setVehiculoId] = useState('');
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [categorias, setCategorias] = useState<CategoriaGasto[]>([]);
  const [categoriaId, setCategoriaId] = useState('');
  const [texto, setTexto] = useState('');
  const [monto, setMonto] = useState('');
  const [listaGastos, setListaGastos] = useState<Gasto[]>([]);
  const [listaIngresos, setListaIngresos] = useState<Ingreso[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingVehiculos, setLoadingVehiculos] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(false);

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
    } catch {
      setVehiculos([]);
      setMensaje('No se pudo conectar con el servidor');
    } finally {
      setLoadingVehiculos(false);
    }
  };

  const cargarCategorias = async () => {
    setLoadingCategorias(true);

    try {
      const res = await get('/gastos/categorias');

      if (res.success) {
        setCategorias(Array.isArray(res.data) ? res.data : []);
      } else {
        setCategorias([]);
      }
    } catch {
      setCategorias([]);
    } finally {
      setLoadingCategorias(false);
    }
  };

  const cargarLista = async () => {
    if (!vehiculoId) {
      setListaGastos([]);
      setListaIngresos([]);
      return;
    }

    setLoading(true);
    setMensaje('');

    try {
      if (modo === 'gastos') {
        const res = await get(`/gastos?vehiculo_id=${vehiculoId}`);

        if (res.success) {
          setListaGastos(Array.isArray(res.data) ? res.data : []);
        } else {
          setListaGastos([]);
          setMensaje(res.message || 'No se pudieron cargar los gastos');
        }
      } else {
        const res = await get(`/ingresos?vehiculo_id=${vehiculoId}`);

        if (res.success) {
          setListaIngresos(Array.isArray(res.data) ? res.data : []);
        } else {
          setListaIngresos([]);
          setMensaje(res.message || 'No se pudieron cargar los ingresos');
        }
      }
    } catch {
      if (modo === 'gastos') {
        setListaGastos([]);
      } else {
        setListaIngresos([]);
      }
      setMensaje('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const guardar = async () => {
    setMensaje('');

    if (!vehiculoId || !texto || !monto) {
      setMensaje('Completa todos los campos obligatorios');
      return;
    }

    if (modo === 'gastos' && !categoriaId) {
      setMensaje('Selecciona una categoría');
      return;
    }

    setLoading(true);

    try {
      let res;

      if (modo === 'gastos') {
        res = await post('/gastos', {
          vehiculo_id: Number(vehiculoId),
          categoriaId: Number(categoriaId),
          monto: Number(monto),
          descripcion: texto
        });
      } else {
        res = await post('/ingresos', {
          vehiculo_id: Number(vehiculoId),
          monto: Number(monto),
          concepto: texto
        });
      }

      if (res.success) {
        setMensaje('Registro guardado correctamente');
        setTexto('');
        setMonto('');
        if (modo === 'gastos') {
          setCategoriaId('');
        }
        await cargarLista();
      } else {
        setMensaje(res.message || 'No se pudo guardar');
      }
    } catch {
      setMensaje('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVehiculos();
    cargarCategorias();
  }, []);

  useEffect(() => {
    if (vehiculoId) {
      cargarLista();
    } else {
      setListaGastos([]);
      setListaIngresos([]);
    }
  }, [modo, vehiculoId]);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1>Gastos e Ingresos</h1>

        <IonSegment
          value={modo}
          onIonChange={(e) => setModo(e.detail.value as 'gastos' | 'ingresos')}
        >
          <IonSegmentButton value="gastos">
            <IonLabel>Gastos</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="ingresos">
            <IonLabel>Ingresos</IonLabel>
          </IonSegmentButton>
        </IonSegment>

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

        {modo === 'gastos' && (
          <IonItem>
            <IonSelect
              label="Categoría"
              labelPlacement="stacked"
              value={categoriaId}
              placeholder={loadingCategorias ? 'Cargando categorías...' : 'Selecciona una categoría'}
              onIonChange={(e) => setCategoriaId(e.detail.value)}
            >
              {categorias.map((cat) => (
                <IonSelectOption key={cat.id} value={String(cat.id)}>
                  {cat.nombre}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        )}

        <IonItem>
          <IonInput
            label={modo === 'gastos' ? 'Descripción' : 'Concepto'}
            labelPlacement="stacked"
            value={texto}
            onIonInput={(e) => setTexto(e.detail.value || '')}
          />
        </IonItem>

        <IonItem>
          <IonInput
            label="Monto"
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
          <IonButton expand="block" onClick={guardar} disabled={loading || loadingVehiculos}>
            {loading ? <IonSpinner name="crescent" /> : 'Guardar'}
          </IonButton>

          <IonButton expand="block" fill="outline" onClick={cargarLista} disabled={!vehiculoId || loading}>
            Cargar {modo}
          </IonButton>
        </div>

        {mensaje && (
          <IonText color="primary">
            <p style={{ textAlign: 'center', marginTop: '12px' }}>{mensaje}</p>
          </IonText>
        )}

        <IonList>
          {modo === 'gastos' &&
            listaGastos.map((item) => (
              <IonItem key={item.id}>
                <IonLabel>
                  <h2>{item.descripcion || 'Sin descripción'}</h2>
                  <p>Categoría: {item.categoriaNombre}</p>
                  <p>Monto: RD$ {item.monto}</p>
                  <p>Fecha: {item.fecha}</p>
                </IonLabel>
              </IonItem>
            ))}

          {modo === 'ingresos' &&
            listaIngresos.map((item) => (
              <IonItem key={item.id}>
                <IonLabel>
                  <h2>{item.concepto || 'Sin concepto'}</h2>
                  <p>Monto: RD$ {item.monto}</p>
                  <p>Fecha: {item.fecha}</p>
                </IonLabel>
              </IonItem>
            ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Gastos;