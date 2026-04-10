import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Registro from './pages/Registro/Registro';
import Activar from './pages/Activar/Activar';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';


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

</IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;