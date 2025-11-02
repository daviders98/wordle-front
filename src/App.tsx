import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Onboarding from './components/Onboarding';
import Game from './components/Game';
import WakeUpApp from './components/WakeUpApp';

function App() {
  return (<>
  <WakeUpApp/>
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/play" element={<Game />} />
      </Routes>
    </BrowserRouter>
  </>
    
  );
}

export default App;
