import { I18nProvider } from './contexts/I18nContext';
import { Header } from './components/layout/Header';
import { DivinationCore } from './components/divination/DivinationCore';

function App() {
  return (
    <I18nProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <DivinationCore />
      </div>
    </I18nProvider>
  );
}

export default App;
