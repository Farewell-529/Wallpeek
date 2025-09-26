import Router from './router';
import { SourceProvider } from './context/SourceContext';

function App() {
  return (
    <SourceProvider>
      <Router />
    </SourceProvider>
  );
}

export default App;