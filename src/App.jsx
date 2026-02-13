import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import CreateType from './pages/CreateType';
import CreateMessage from './pages/CreateMessage';
import CreateStory from './pages/CreateStory';
import ViewStory from './pages/ViewStory';
import Expired from './pages/Expired';
import ViewMessage from './pages/ViewMessage';
import './styles/index.css';
import './styles/theme.css';
import './styles/ValentinesLanding.css';
import './styles/envelope.css';
import './styles/createMessage.css';

export default function App() {
  const [route, setRoute] = useState(
    window.location.hash || '#/'
  );

  useEffect(() => {
    const onHashChange = () =>
      setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', onHashChange);
    return () =>
      window.removeEventListener('hashchange', onHashChange);
  }, []);

  const renderPage = () => {
    if (route.startsWith('#/vm/')) return <ViewMessage />;
    if (route.startsWith('#/vs/')) return <ViewStory />;

    switch (route) {
      case '#/create':
        return <CreateType />;
      case '#/create/message':
        return <CreateMessage />;
      case '#/create/story':
        return <CreateStory />;
      case '#/expired':
        return <Expired />;
      case '#/view/message':
        return <ViewMessage />;  
      case '#/':
      default:
        return <Landing />;
    }
  };

  return <div className="app">{renderPage()}</div>;
}