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
  IonRefresher,
  IonRefresherContent
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { get } from '../../services/api';


interface Noticia {
  id: number;
  titulo: string;
  resumen: string;
  imagenUrl: string;
  fecha: string;
  fuente: string;
  link: string;
}

const Noticias = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarNoticias = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await get('/noticias');

      if (res.success) {
        setNoticias(res.data || []);
      } else {
        setError(res.message || 'No se pudieron cargar las noticias');
      }
    } catch (e) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    await cargarNoticias();
    event.detail.complete();
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  return (
    <IonPage>
      <IonContent className="noticias-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="noticias-header">
          <h1>Noticias Automotrices</h1>
          <p>Entérate de las últimas novedades del mundo de los vehículos</p>
        </div>

        {loading && (
          <div className="loading-box">
            <IonSpinner name="crescent" />
            <p>Cargando noticias...</p>
          </div>
        )}

        {!loading && error && (
          <div className="error-box">
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
            <IonButton expand="block" onClick={cargarNoticias}>
              Reintentar
            </IonButton>
          </div>
        )}

        {!loading && !error && noticias.length === 0 && (
          <div className="empty-box">
            <IonText color="medium">
              <p>No hay noticias disponibles.</p>
            </IonText>
          </div>
        )}

        {!loading && !error && noticias.map((noticia) => (
          <IonCard key={noticia.id} className="noticia-card">
            {noticia.imagenUrl && (
              <img
                src={noticia.imagenUrl}
                alt={noticia.titulo}
                className="noticia-img"
              />
            )}

            <IonCardHeader>
              <IonCardTitle>{noticia.titulo}</IonCardTitle>
              <IonCardSubtitle>
                {noticia.fecha} • {noticia.fuente}
              </IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
              <p>{noticia.resumen}</p>

              <IonButton
                expand="block"
                className="leer-mas-btn"
                href={noticia.link}
                target="_blank"
                rel="noreferrer"
              >
                Leer noticia completa
              </IonButton>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Noticias;