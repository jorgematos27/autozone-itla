import {
  IonPage, IonContent, IonButton
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './Dashboard.css';

const slides = [
  {
    titulo: 'Conoce tu vehiculo',
    subtitulo: 'Cada kilometro cuenta. Registra y controla tu historial completo.',
    bg: '#1a1a2e'
  },
  {
    titulo: 'Mantenimiento inteligente',
    subtitulo: 'Un motor bien cuidado es una inversion que siempre rinde.',
    bg: '#0f3460'
  },
  {
    titulo: 'Controla tus gastos',
    subtitulo: 'Saber cuanto gastas es el primer paso para gastar menos.',
    bg: '#16213e'
  }
];

const motivaciones = [
  'Revisa el aceite de tu motor cada 5,000 kilometros.',
  'Mantener la presion correcta en las gomas ahorra combustible.',
  'Un freno revisado a tiempo puede salvar una vida.',
  'La bateria de tu vehiculo dura mas si evitas arranques cortos frecuentes.',
  'Limpiar el filtro de aire mejora el rendimiento del motor.'
];

const accesos = [
  { label: 'Mis Vehiculos', ruta: '/vehiculos', icono: 'V' },
  { label: 'Mantenimientos', ruta: '/mantenimientos', icono: 'M' },
  { label: 'Combustible', ruta: '/combustible', icono: 'C' },
  { label: 'Gomas', ruta: '/gomas', icono: 'G' },
  { label: 'Gastos', ruta: '/gastos', icono: '$' },
  { label: 'Foro', ruta: '/foro', icono: 'F' },
  { label: 'Noticias', ruta: '/noticias', icono: 'N' },
  { label: 'Catalogo', ruta: '/catalogo', icono: 'K' },
];

const Dashboard: React.FC = () => {
  const [slideActual, setSlideActual] = useState(0);
  const [motivacion, setMotivacion] = useState(0);
  const [oscuro, setOscuro] = useState(() => {
    return localStorage.getItem('tema') === 'oscuro';
  });
  const history = useHistory();

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    const intervaloSlide = setInterval(() => {
      setSlideActual(prev => (prev + 1) % slides.length);
    }, 4000);
    const intervaloMotiv = setInterval(() => {
      setMotivacion(prev => (prev + 1) % motivaciones.length);
    }, 5000);
    return () => {
      clearInterval(intervaloSlide);
      clearInterval(intervaloMotiv);
    };
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-tema', oscuro ? 'oscuro' : 'claro');
    localStorage.setItem('tema', oscuro ? 'oscuro' : 'claro');
  }, [oscuro]);

  const handleLogout = () => {
    localStorage.clear();
    history.push('/login');
  };

  return (
    <IonPage>
      <IonContent className="dash-content">
        <div className="dash-wrapper">

          {/* Header */}
          <header className="dash-header">
            <div className="dash-saludo">
              <span className="dash-label">Bienvenido</span>
              <h2 className="dash-nombre">{usuario.nombre || 'Usuario'} {usuario.apellido || ''}</h2>
            </div>
            <div className="dash-acciones">
              <button
                className="btn-tema"
                onClick={() => setOscuro(!oscuro)}
                title="Cambiar tema"
              >
                {oscuro ? 'Claro' : 'Oscuro'}
              </button>
              <button className="btn-salir" onClick={handleLogout}>
                Salir
              </button>
            </div>
          </header>

          {/* Slider */}
          <section className="dash-slider">
            <div
              className="slide-inner"
              style={{ backgroundColor: slides[slideActual].bg }}
            >
              <div className="slide-numero">{String(slideActual + 1).padStart(2, '0')}</div>
              <h1 className="slide-titulo">{slides[slideActual].titulo}</h1>
              <p className="slide-subtitulo">{slides[slideActual].subtitulo}</p>
              <div className="slide-dots">
                {slides.map((_, i) => (
                  <span
                    key={i}
                    className={`dot ${i === slideActual ? 'activo' : ''}`}
                    onClick={() => setSlideActual(i)}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Motivacion */}
          <section className="dash-motivacion">
            <span className="motiv-tag">Consejo del dia</span>
            <p className="motiv-texto">{motivaciones[motivacion]}</p>
          </section>

          {/* Accesos rapidos */}
          <section className="dash-accesos">
            <h3 className="seccion-titulo">Accesos rapidos</h3>
            <div className="accesos-grid">
              {accesos.map((a) => (
                <button
                  key={a.ruta}
                  className="acceso-card"
                  onClick={() => history.push(a.ruta)}
                >
                  <span className="acceso-icono">{a.icono}</span>
                  <span className="acceso-label">{a.label}</span>
                </button>
              ))}
            </div>
          </section>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;