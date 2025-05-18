import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from './Navbar';
import BackgroundAnimation from './BackgroundAnimation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { themeColors } = useTheme();

  return (
    <div className={`min-h-screen ${themeColors.background} theme-transition overflow-hidden`}>
      <BackgroundAnimation />
      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto px-4 py-5 pb-24">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;