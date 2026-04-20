import { IonPage, IonContent } from '@ionic/react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Car, Wrench, Fuel, CircleDot,
  Wallet, MessageSquare, Newspaper,
  BookOpen, Sun, Moon, LogOut, ChevronRight
} from 'lucide-react';
import './Dashboard.css';

const slides = [
  {
    titulo: 'Conoce tu vehiculo',
    subtitulo: 'Cada kilometro cuenta. Registra y controla tu historial completo.',
    bg: '#0F172A'
  },
  {
    titulo: 'Mantenimiento inteligente',
    subtitulo: 'Un motor bien cuidado es una inversion que siempre rinde.',
    bg: '#1E3A5F'
  },
  {
    titulo: 'Controla tus gastos',
    subtitulo: 'Saber cuanto gastas es el primer paso para gastar menos.',
    bg: '#1E293B'
  }
];

const motivaciones = [
  'Revisa el aceite de tu motor cada 5,000 kilometros.',
  'Mantener la presion correcta en las gomas ahorra combustible.',
  'Un freno revisado a tiempo puede salvar una vida.',
  'La bateria dura mas si evitas arranques cortos frecuentes.',
  'Limpiar el filtro de aire mejora el rendimiento del motor.'
];

const accesos = [
  { label: 'Mis Vehiculos',   ruta: '/vehiculos',      Icono: Car },
  { label: 'Mantenimientos',  ruta: '/mantenimientos', Icono: Wrench },
  { label: 'Combustible',     ruta: '/combustible',    Icono: Fuel },
  { label: 'Gomas',           ruta: '/gomas',          Icono: CircleDot },
  { label: 'Gastos',          ruta: '/gastos',         Icono: Wallet },
  { label: 'Foro',            ruta: '/foro',           Icono: MessageSquare },
  { label: 'Noticias',        ruta: '/noticias',       Icono: Newspaper },
  { label: 'Catalogo',        ruta: '/catalogo',       Icono: BookOpen },
];

const Dashboard: React.FC = () => {
  const [slideActual, setSlideActual] = useState(0);
  const [motivacion, setMotivacion]   = useState(0);
  const [oscuro, setOscuro] = useState(() => localStorage.getItem('tema') === 'oscuro');
  const history = useHistory();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    const s = setInterval(() => setSlideActual(p => (p + 1) % slides.length), 4000);
    const m = setInterval(() => setMotivacion(p => (p + 1) % motivaciones.length), 5000);
    return () => { clearInterval(s); clearInterval(m); };
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-tema', oscuro ? 'oscuro' : 'claro');
    localStorage.setItem('tema', oscuro ? 'oscuro' : 'claro');
  }, [oscuro]);

  const handleLogout = () => { localStorage.clear(); history.push('/login'); };

  return (
    <IonPage>
      <IonContent className="az-content">
        <div className="dash-wrapper">

          {/* Header */}
          <header className="dash-header">
            <button className="dash-perfil-btn" onClick={() => history.push('/perfil')}>
              <div className="dash-avatar">
                {usuario.nombre?.[0]}{usuario.apellido?.[0]}
              </div>
              <div className="dash-saludo-texto">
                <span className="dash-saludo-sub">Bienvenido</span>
                <span className="dash-saludo-nombre">
                  {usuario.nombre || 'Usuario'} {usuario.apellido || ''}
                </span>
              </div>
              <ChevronRight size={16} className="dash-chevron" />
            </button>
            <div className="dash-header-acciones">
              <button className="dash-icon-btn" onClick={() => setOscuro(!oscuro)} title="Cambiar tema">
                {oscuro ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className="dash-icon-btn dash-icon-btn--salir" onClick={handleLogout} title="Salir">
                <LogOut size={18} />
              </button>
            </div>
          </header>

          {/* Slider */}
          <section className="dash-slider">
            <div className="slide-inner" style={{ backgroundColor: slides[slideActual].bg }}>
              <span className="slide-index">{String(slideActual + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
              <h1 className="slide-titulo">{slides[slideActual].titulo}</h1>
              <p className="slide-subtitulo">{slides[slideActual].subtitulo}</p>
              <div className="slide-dots">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    className={`dot ${i === slideActual ? 'dot--activo' : ''}`}
                    onClick={() => setSlideActual(i)}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Consejo */}
          <section className="dash-consejo">
            <span className="consejo-tag">Consejo del dia</span>
            <p className="consejo-texto">{motivaciones[motivacion]}</p>
          </section>

          {/* Accesos */}
          <section className="dash-accesos">
            <p className="dash-seccion-label">Accesos rapidos</p>
            <div className="accesos-grid">
              {accesos.map(({ label, ruta, Icono }) => (
                <button key={ruta} className="acceso-card" onClick={() => history.push(ruta)}>
                  <div className="acceso-icono-wrap">
                    <Icono size={20} />
                  </div>
                  <span className="acceso-label">{label}</span>
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