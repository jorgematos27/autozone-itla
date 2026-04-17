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


interface VideoItem {
  id: number;
  youtubeId: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  url: string;
  thumbnail: string;
}

const Videos = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarVideos = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await get('/videos');
      if (res.success) {
        setVideos(res.data || []);
      } else {
        setError(res.message || 'No se pudieron cargar los videos');
      }
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    await cargarVideos();
    event.detail.complete();
  };

  useEffect(() => {
    cargarVideos();
  }, []);

  return (
    <IonPage>
      <IonContent className="videos-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="videos-header">
          <h1>Videos Educativos</h1>
          <p>Aprende sobre mantenimiento y cuidado vehicular</p>
        </div>

        {loading && (
          <div className="loading-box">
            <IonSpinner name="crescent" />
            <p>Cargando videos...</p>
          </div>
        )}

        {!loading && error && (
          <div className="error-box">
            <IonText color="danger"><p>{error}</p></IonText>
            <IonButton expand="block" onClick={cargarVideos}>Reintentar</IonButton>
          </div>
        )}

        {!loading && !error && videos.length === 0 && (
          <div className="empty-box">
            <IonText color="medium"><p>No hay videos disponibles.</p></IonText>
          </div>
        )}

        {!loading && !error && videos.map((video) => (
          <IonCard key={video.id} className="video-card">
            {video.thumbnail && <img src={video.thumbnail} alt={video.titulo} className="video-img" />}
            <IonCardHeader>
              <IonCardTitle>{video.titulo}</IonCardTitle>
              <IonCardSubtitle>{video.categoria}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{video.descripcion}</p>
              <IonButton expand="block" href={video.url} target="_blank" rel="noreferrer">
                Ver video
              </IonButton>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Videos;