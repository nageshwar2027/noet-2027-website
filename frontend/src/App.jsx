import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import InfoBar from './components/InfoBar';
import About from './components/About';
import Themes from './components/Themes';
import ImportantDates from './components/ImportantDates';
import Committees from './components/Committees';
import Registration from './components/Registration';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import { warmupBackend } from './config';

function App() {
  useEffect(() => {
    // Non-blocking background warm-up ping to wake Render backend
    warmupBackend();
  }, []);

  return (
    <div className="app">
      <Header />
      <Hero />
      <InfoBar />
      <About />
      <Themes />
      <ImportantDates />
      <Committees />
      <Registration />
      <Footer />
      <FloatingActions />
    </div>
  );
}

export default App;
