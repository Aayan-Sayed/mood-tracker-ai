import { useTheme } from '../contexts/ThemeContext';
import { ThemeType } from '../types';
// TODO: Add import for analytics tracking
import { Download, Trash2 } from 'lucide-react';

const Settings: React.FC = () => {
  const { themeColors, theme, setTheme } = useTheme();
  // const [showConfirmation, setShowConfirmation] = useState(false); // Commented out for future implementation

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    // localStorage.setItem('last-theme-change', new Date().toISOString()); // Removed analytics tracking temporarily
  };

  const handleExportData = () => {
    // Get all data from local storage
    const entries = localStorage.getItem('mood-tracker-entries');
    const streak = localStorage.getItem('mood-tracker-streak');
    
    /* 
      Data structure:
      - entries: array of mood entries with dates
      - streak: current streak information
      - exportDate: timestamp of export
    */
    const data = {
      entries: entries ? JSON.parse(entries) : [],
      streak: streak ? JSON.parse(streak) : null,
      exportDate: new Date().toISOString(),
    };
    
    // Create a downloadable file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mood-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone!')) {
      localStorage.removeItem('mood-tracker-entries');
      localStorage.removeItem('mood-tracker-streak');
      window.location.reload();
    }
  };

  return (
    <div className="settings-page">
      <div className="mb-8 text-center header">
        <h1 className={`text-3xl md:text-4xl font-bold ${themeColors.text} mb-2`}>
          Settings
        </h1>
        <p className={`${themeColors.textSecondary} text-lg`}>
          Customize your MoodTracker experience
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Theme Settings */}
        <div className={`${themeColors.card} rounded-lg shadow p-6 mb-6 theme-section`}>
          <h2 className={`${themeColors.text} text-xl font-semibold mb-4`}>App Theme</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ThemeOption
              name="Calm"
              color="bg-blue-500"
              isSelected={theme === 'calm'}
              onClick={() => handleThemeChange('calm')}
            />
            <ThemeOption
              name="Vibrant"
              color="bg-indigo-600"
              isSelected={theme === 'vibrant'}
              onClick={() => handleThemeChange('vibrant')}
            />
            <ThemeOption
              name="Minimal"
              color="bg-gray-600"
              isSelected={theme === 'minimal'}
              onClick={() => handleThemeChange('minimal')}
            />
            <ThemeOption
              name="Dark"
              color="bg-gray-900"
              isSelected={theme === 'dark'}
              onClick={() => handleThemeChange('dark')}
            />
          </div>
        </div>

        {/* Data Management */}
        <div className={`${themeColors.card} rounded-lg shadow p-6 mb-6 data-section`}>
          <h2 className={`${themeColors.text} text-xl font-semibold mb-4`}>Data Management</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className={`${themeColors.text} font-medium`}>Export Your Data</h3>
                <p className={`${themeColors.textSecondary} text-sm`}>
                  Download all your mood entries as a JSON file
                </p>
              </div>
              <button
                onClick={handleExportData}
                className={`px-4 py-2 rounded ${themeColors.secondary} text-white flex items-center`}
              >
                <Download size={18} className="mr-1" />
                Export
              </button>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`${themeColors.text} font-medium`}>Reset All Data</h3>
                  <p className={`${themeColors.textSecondary} text-sm`}>
                    Delete all mood entries and reset your streak (cannot be undone)
                  </p>
                </div>
                <button
                  onClick={handleResetData}
                  className="px-4 py-2 rounded bg-red-500 text-white flex items-center"
                >
                  <Trash2 size={18} className="mr-1" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className={`${themeColors.card} rounded-lg shadow p-6 about-section`}>
          <h2 className={`${themeColors.text} text-xl font-semibold mb-4`}>About MoodTracker</h2>
          
          <div className={`${themeColors.text}`}>
            <p className="mb-2">
              I built this MoodTracker app to help track emotional wellbeing through daily mood logging and visualization.
            </p>
            <p className="mb-2">
              The app uses React with TypeScript and stores all data locally in your browser's localStorage.
              {/* Future version will include cloud sync */}
            </p>
            <p>
              Your privacy matters - all data stays on your device and is never sent to any servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for theme selection
interface ThemeOptionProps {
  name: string;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({ 
  name, 
  color, 
  isSelected, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative p-4 rounded border-2 transition-all ${
        isSelected ? 'border-blue-500' : 'border-gray-200'
      } flex flex-col items-center`}
    >
      <div className={`w-10 h-10 rounded-full ${color} mb-2`}></div>
      <span className="text-sm font-medium">{name}</span>
      
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white">
          ✓
        </div>
      )}
    </button>
  );
};

export default Settings;