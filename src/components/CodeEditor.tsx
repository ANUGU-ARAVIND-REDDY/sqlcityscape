
import React, { useState } from 'react';
import { Play, X, Check, HelpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface CodeEditorProps {
  initialCode?: string;
  onExecute?: (code: string, success: boolean) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  initialCode = "-- Write your SQL query here\nSELECT * FROM buildings;",
  onExecute = (code, success) => console.log("Executing:", code, "Success:", success)
}) => {
  const [code, setCode] = useState(initialCode);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; success: boolean } | null>(null);
  const { session } = useAuth();

  const handleExecute = async () => {
    // Reset feedback
    setFeedback(null);
    
    try {
      // Call the Supabase edge function to execute the query
      const { data, error } = await supabase.functions.invoke("execute_sql_query", {
        body: { query: code },
      });
      
      if (error) {
        setFeedback({
          message: `Error: ${error.message}`,
          success: false
        });
        onExecute(code, false);
        return;
      }
      
      // Check if data exists and is valid
      const isValid = data && typeof data === 'object';
      
      setFeedback({
        message: isValid 
          ? "Query executed successfully!" 
          : "Error: Invalid result returned",
        success: isValid
      });
      
      if (isValid) {
        onExecute(code, true);
      } else {
        onExecute(code, false);
      }
    } catch (error) {
      console.error("Error executing query:", error);
      setFeedback({
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        success: false
      });
      onExecute(code, false);
    }
  };

  return (
    <div className="code-editor w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <div className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">SQL Editor</div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowHint(!showHint)}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            aria-label="Show hint"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Code Input */}
      <div className="relative flex-grow">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full min-h-[180px] p-4 font-mono text-sm bg-gray-900 text-green-400 resize-none focus:outline-none"
          spellCheck="false"
        />
        
        {/* Hint Popup */}
        {showHint && (
          <div className="absolute right-4 top-4 w-64 p-3 glass rounded-md shadow-md animate-fade-in z-10">
            <button 
              onClick={() => setShowHint(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
            <h4 className="font-medium text-sm mb-1">Hint</h4>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Try using CREATE TABLE to make a new building, or INSERT INTO to add details.
            </p>
          </div>
        )}
      </div>
      
      {/* Controls and Feedback */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
        <div className="flex-grow">
          {feedback && (
            <div className={`flex items-center text-sm ${feedback.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} animate-fade-in`}>
              {feedback.success ? (
                <Check className="w-4 h-4 mr-1.5" />
              ) : (
                <X className="w-4 h-4 mr-1.5" />
              )}
              {feedback.message}
            </div>
          )}
        </div>
        <button
          onClick={handleExecute}
          className="px-4 py-2 bg-primary text-white rounded-md flex items-center space-x-2 button-hover-effect"
        >
          <Play className="w-4 h-4" />
          <span>Run</span>
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
