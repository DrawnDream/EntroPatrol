import { useState } from 'react';
import Navbar from './components/Navbar';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SoilData from './components/SoilData';
import CropData from './components/CropData';
import WeatherData from './components/WeatherData';
import LocationMap from './components/LocationMap';
import Analysis from './components/Analysis';
import AIAnalysis from './components/AIAnalysis';
import HomePage from './components/HomePage';
import LoginModal from './components/LoginModal';
import './App.css';

type Page = 'home' | 'dashboard' | 'soil' | 'crop' | 'weather' | 'location' | 'analysis' | 'ai';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleFeatureClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handlePageChange = (page: string) => {
    if (page === 'home') {
      setCurrentPage('home');
      if (isLoggedIn) {
        setIsLoggedIn(false);
      }
    } else {
      setCurrentPage(page as Page);
    }
  };

  const renderPage = () => {
    if (currentPage === 'home') {
      return (
        <>
          <Navbar 
            currentPage={currentPage} 
            onPageChange={handlePageChange}
            isLoggedIn={isLoggedIn}
            onLoginClick={() => setShowLoginModal(true)}
          />
          <HomePage onFeatureClick={handleFeatureClick} />
        </>
      );
    }

    return (
      <>
        <Navbar 
          currentPage={currentPage} 
          onPageChange={handlePageChange}
          isLoggedIn={isLoggedIn}
          onLoginClick={() => setShowLoginModal(true)}
        />
        <div className="main-content" style={{ marginTop: '60px' }}>
          <Sidebar currentPage={currentPage as any} onPageChange={(page) => setCurrentPage(page as Page)} />
          <div className="content-area">
            {(() => {
              switch (currentPage) {
                case 'dashboard':
                  return <Dashboard />;
                case 'soil':
                  return <SoilData />;
                case 'crop':
                  return <CropData />;
                case 'weather':
                  return <WeatherData />;
                case 'location':
                  return <LocationMap />;
                case 'analysis':
                  return <Analysis />;
                case 'ai':
                  return <AIAnalysis />;
                default:
                  return <Dashboard />;
              }
            })()}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="app-container">
      {renderPage()}
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;
