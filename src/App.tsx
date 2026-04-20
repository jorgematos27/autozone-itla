import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Registro from './pages/Registro/Registro';
import Activar from './pages/Activar/Activar';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Perfil from './pages/Perfil/Perfil';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import Vehiculos from './pages/Vehiculos/Vehiculos';
import Mantenimientos from './pages/Mantenimientos/Mantenimientos';
import Foro from './pages/Foro/Foro';
import Videos from './pages/Videos/Videos';
import Noticias from './pages/Noticias/Noticias';
import Catalogo from './pages/Catalogo/Catalogo';
import Acerca from './pages/Acerca/Acerca';
import Gastos from './pages/Gastos/Gastos';
import Combustible from './pages/Combustible/Combustible';
import Gomas from './pages/Gomas/Gomas';


/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import './theme/autozone.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>

  <Route exact path="/">
    <Redirect to="/login" />
  </Route>

  <Route exact path="/login">
    <Login />
  </Route>

  <Route exact path="/home">
    <Home />
  </Route>

  <Route exact path="/registro">
    <Registro />
  </Route>

  <Route exact path="/activar">
    <Activar />
  </Route>

  <Route exact path="/dashboard">
    <Dashboard />
  </Route>  

  <Route exact path="/perfil">
    <Perfil />
  </Route>

  <Route exact path="/vehiculos">
  <Vehiculos />
</Route>

<Route exact path="/mantenimientos">
  <Mantenimientos />
</Route>

<Route exact path="/foro">
  <Foro />
</Route>

<Route exact path="/Videos">
  <Videos />
</Route>

<Route exact path="/Noticias">
  <Noticias />
</Route>

<Route exact path="/catalogo">
  <Catalogo />
</Route>

<Route exact path="/acerca">
  <Acerca />
</Route>

<Route exact path="/Gastos">     
  <Gastos />
</Route>

<Route exact path="/Combustible">     
  <Combustible />
</Route>


<Route exact path="/gomas">
  <Gomas />
</Route>

</IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;