import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonText,
  IonSpinner,
  IonButton,
  IonItem,
  IonInput,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { get } from '../../services/api';


interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  descripcion: string;
  imagenUrl?: string;
}

const Catalogo = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anio, setAnio] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');

  const cargarCatalogo = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (marca) params.append('marca', marca);
      if (modelo) params.append('modelo', modelo);
      if (anio) params.append('anio', anio);
      if (precioMin) params.append('precioMin', precioMin);
      if (precioMax) params.append('precioMax', precioMax);

      const ruta = params.toString() ? `/catalogo?${params.toString()}` : '/catalogo';
      const res = await get(ruta);

      if (res.success) {
        setVehiculos(res.data || []);
      } else {
        setError(res.message || 'No se pudo cargar el catálogo');
      }
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCatalogo();
  }, []);

  return (
    <IonPage>
      <IonContent className="catalogo-content">
        <div className="catalogo-header">
          <h1>Catálogo de Vehículos</h1>
          <p>Explora y filtra vehículos disponibles</p>
        </div>

        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <IonItem>
                <IonInput label="Marca" labelPlacement="stacked" value={marca} onIonInput={e => setMarca(e.detail.value || '')} />
              </IonItem>
            </IonCol>
            <IonCol size="6">
              <IonItem>
                <IonInput label="Modelo" labelPlacement="stacked" value={modelo} onIonInput={e => setModelo(e.detail.value || '')} />
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="4">
              <IonItem>
                <IonInput label="Año" labelPlacement="stacked" value={anio} onIonInput={e => setAnio(e.detail.value || '')} />
              </IonItem>
            </IonCol>
            <IonCol size="4">
              <IonItem>
                <IonInput label="Precio mín." labelPlacement="stacked" value={precioMin} onIonInput={e => setPrecioMin(e.detail.value || '')} />
              </IonItem>
            </IonCol>
            <IonCol size="4">
              <IonItem>
                <IonInput label="Precio máx." labelPlacement="stacked" value={precioMax} onIonInput={e => setPrecioMax(e.detail.value || '')} />
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>

        <div className="catalogo-actions">
          <IonButton expand="block" onClick={cargarCatalogo}>Buscar</IonButton>
        </div>

        {loading && <div className="loading-box"><IonSpinner name="crescent" /><p>Cargando catálogo...</p></div>}
        {!loading && error && <div className="error-box"><IonText color="danger"><p>{error}</p></IonText></div>}

        {!loading && !error && vehiculos.map((item) => (
          <IonCard key={item.id} className="catalogo-card">
            {item.imagenUrl && <img src={item.imagenUrl} alt={`${item.marca} ${item.modelo}`} className="catalogo-img" />}
            <IonCardHeader>
              <IonCardTitle>{item.marca} {item.modelo}</IonCardTitle>
              <IonCardSubtitle>Año: {item.anio} • Precio: RD$ {item.precio}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{item.descripcion}</p>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Catalogo;