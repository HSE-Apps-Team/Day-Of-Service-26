
import NavBar from './components/NavBar';
import Screen from './components/Screen';
import { ScreenProvider } from './contexts/ScreenContext';


function App() {
  return (
    <ScreenProvider>
      <NavBar />
      <Screen />
    </ScreenProvider>
  );
}

export default App;


