import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useMood } from '../contexts/MoodContext';

// TODO: Add word count feature to track journal entry length

const ReflectionJournal: React.FC = () => {
  const { themeColors } = useTheme();
  const { getEntryByDate, updateEntry } = useMood();
  const [note, setNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayEntry = getEntryByDate(today);

  useEffect(() => {
    if (todayEntry) {
      setNote(todayEntry.note || '');
    }
  }, [todayEntry]);

  const handleSave = () => {
    if (!todayEntry) return;
    
    setIsSaving(true);
    
    // Update entry with new note
    updateEntry(todayEntry.id, { note });
    
    // Show success message briefly
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 1500);
    }, 500);
  };

  // const analyzeJournalSentiment = () => {
  //   // Future feature: analyze text sentiment to suggest mood
  //   // This could use NLP to detect emotional tone
  //   // and provide feedback or suggestions
  //   console.log("Analyzing journal content...");
  // };

  if (!todayEntry) return null;

  return (
    <div className={`${themeColors.card} rounded-xl shadow-md p-6 journal-container`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`${themeColors.text} text-xl font-semibold`}>Reflection Journal</h2>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className={`px-3 py-1 rounded ${themeColors.secondary} text-white`}
          >
            {note ? 'Edit' : 'Add'} Note
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 rounded text-sm bg-gray-200 text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-3 py-1 rounded-md text-sm ${themeColors.primary} text-white flex items-center`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving
                </>
              ) : 'Save'}
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your thoughts and reflections for today..."
          className={`w-full min-h-[120px] p-3 rounded ${themeColors.border} border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
        />
      ) : note ? (
        <p className={`text-gray-800 p-3 bg-gray-50 rounded min-h-[80px]`}>
          {note}
        </p>
      ) : (
        <p className={`${themeColors.textSecondary} text-center p-6`}>
          Add your thoughts and reflections for today...
        </p>
      )}

      {showSuccess && (
        <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-lg text-center slide-in-up">
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Reflection saved successfully!
          </span>
        </div>
      )}
    </div>
  );
};

export default ReflectionJournal;