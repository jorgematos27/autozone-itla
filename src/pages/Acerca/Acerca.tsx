import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent
} from '@ionic/react';


const equipo = [
  {
    nombre: 'Christofer Laurencio',
    matricula: '2022-1346',
    telefono: '',
    telegram: '',
    correo: '',
    foto: ''
  },
  {
    nombre: 'Jorge Matos',
    matricula: '2022-0177',
    telefono: '',
    telegram: '',
    correo: '',
    foto: ''
  }
];

const Acerca = () => {
  return (
    <IonPage>
      <IonContent className="acerca-content">
        <div className="acerca-header">
          <h1>Acerca De</h1>
          <p>Equipo de desarrollo</p>
        </div>

        {equipo.map((persona, index) => (
          <IonCard key={index} className="acerca-card">
            <img src={persona.foto} alt={persona.nombre} className="acerca-img" />
            <IonCardHeader>
              <IonCardTitle>{persona.nombre}</IonCardTitle>
              <IonCardSubtitle>{persona.matricula}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <p><strong>Tel:</strong> <a href={`tel:${persona.telefono}`}>{persona.telefono}</a></p>
              <p><strong>Telegram:</strong> <a href={persona.telegram} target="_blank" rel="noreferrer">Abrir</a></p>
              <p><strong>Correo:</strong> <a href={`mailto:${persona.correo}`}>{persona.correo}</a></p>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Acerca;