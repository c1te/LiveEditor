import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroPanel from './pages/HeroPanel.tsx'
import TextWindow from './pages/TextWindow.tsx';
import { SocketProvider } from './context/SocketProvider.tsx';
import { CodeProvider } from './context/CodeProvider.tsx';
import { RemoteUpdateProvider } from './context/RemoteUpdateProvider.tsx';

function App() {
  return (
    <RemoteUpdateProvider>
      <CodeProvider>
        <SocketProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HeroPanel />} />
              <Route path="/session/:id" element={<TextWindow />} />
            </Routes>
          </Router>
        </SocketProvider>
      </CodeProvider>
    </RemoteUpdateProvider>
  );
}

export default App;
