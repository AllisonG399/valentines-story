import { useState, useEffect } from 'react';

import Landing from './pages/Landing';
import CreateType from './pages/CreateType';
import CreateMessage from './pages/CreateMessage';
import CreateStory from './pages/CreateStory';
import ViewStory from './pages/ViewStory';
import Expired from './pages/Expired';
import ViewMessage from './pages/ViewMessage';
import Intro from './storyScenes/IntroScene';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import './styles/index.css';
import './styles/theme.css';
import './styles/ValentinesLanding.css';
import './styles/envelope.css';
import './styles/createMessage.css';
import './styles/createStory.css';

export default function App() {
  const [route, setRoute] = useState(
    window.location.hash || '#/'
  );

  // Tracks whether the current page has information that would be lost if the user navigates away
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Listen for changes to the hash-based route
  useEffect(() => {
    const onHashChange = () =>
      setRoute(window.location.hash || '#/');

    window.addEventListener('hashchange', onHashChange);

    return () =>
      window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Reset unsaved changes when leaving
  useEffect(() => {
    setHasUnsavedChanges(false);
  }, [route]);

  const renderPage = () => {
    if (route.startsWith('#/vm/')) return <ViewMessage />;
    if (route.startsWith('#/vs/')) return <ViewStory />;

    switch (route) {
      case '#/create':
        return <CreateType />;
      case '#/create/message':
        return (
          <CreateMessage 
            setHasUnsavedChanges={setHasUnsavedChanges}
          />
        );
      case '#/create/story':
        return (
          <CreateStory 
            setHasUnsavedChanges={setHasUnsavedChanges}
          />
        );
      case '#/expired':
        return <Expired />;
      case '#/view/message':
        return <ViewMessage />;  
      case '#/view/story':
        return <ViewStory />;
      case '#/scene/intro':
        return <Intro />;
      case '#/':
      default:
        return <Landing />;
    }
  };

  return (
    <div className="app">
      <Navbar 
        currentRoute={route}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      <main>
        {renderPage()}
      </main>

      <Footer />
    </div>
  );
}