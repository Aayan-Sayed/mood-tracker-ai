import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  const { themeColors } = useTheme();

  return (
    <div className="fade-in min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-8xl mb-6">😕</div>
      <h1 className={`text-4xl font-bold ${themeColors.text} mb-2`}>Page Not Found</h1>
      <p className={`${themeColors.textSecondary} text-lg mb-8`}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className={`px-6 py-3 rounded-lg ${themeColors.primary} text-white font-medium transition-all hover:opacity-90`}
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;