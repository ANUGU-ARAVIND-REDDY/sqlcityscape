
import React, { useState } from 'react';
import { Play, X, Check, HelpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface CodeEditorProps {
  initialCode?: string;
  challenge?: {
    id: number;
    title: string;
    description: string;
    hints?: string[];
    initialCode?: string;
    solution?: string;
  };
  onExecute?: (code: string, success: boolean) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  initialCode = "-- Write your SQL query here\nSELECT * FROM buildings;",
  challenge,
  onExecute = (code, success) => console.log("Executing:", code, "Success:", success)
}) => {
  const [code, setCode] = useState(initialCode);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; success: boolean } | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [tableData, setTableData] = useState<any>(null);
  const { session } = useAuth();

  const handleExecute = async () => {
    // Reset feedback
    setFeedback(null);
    setIsExecuting(true);
    setTableData(null);
    
    try {
      // Call the Supabase edge function to execute the query, with AI validation if a challenge is provided
      const { data, error } = await supabase.functions.invoke("execute_sql_query", {
        body: { 
          query: code,
          challenge: challenge, 
          validateWithAI: !!challenge 
        },
      });
      
      if (error) {
        setFeedback({
          message: `Error: ${error.message}`,
          success: false
        });
        onExecute(code, false);
        setIsExecuting(false);
        return;
      }
      
      console.log("Response from execute_sql_query:", data);
      
      // Different response format depending on whether we used AI validation
      if (challenge) {
        // Handle AI validation response
        const isCorrect = data.is_correct;
        setTableData(data.table_data);
        
        setFeedback({
          message: data.feedback || (isCorrect ? "Query is correct!" : "Query is incorrect."),
          success: isCorrect
        });
        
        onExecute(code, isCorrect);
      } else {
        // Handle regular execution response
        const isValid = data && typeof data === 'object';
        
        setFeedback({
          message: isValid 
            ? "Query executed successfully!" 
            : "Error: Invalid result returned",
          success: isValid
        });
        
        if (isValid) {
          setTableData(data);
          onExecute(code, true);
        } else {
          onExecute(code, false);
        }
      }
    } catch (error) {
      console.error("Error executing query:", error);
      setFeedback({
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        success: false
      });
      onExecute(code, false);
    } finally {
      setIsExecuting(false);
    }
  };

  // Function to render table data if available
  const renderTableData = () => {
    if (!tableData) return null;
    
    // Handle different data formats
    const rows = Array.isArray(tableData) ? tableData : 
               (tableData.data ? tableData.data : null);
    
    if (!rows || rows.length === 0) return <p className="text-sm text-gray-500">No data returned</p>;
    
    // Get column names from the first row
    const columns = Object.keys(rows[0]);
    
    return (
      <div className="mt-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {columns.map((column, i) => (
                <th 
                  key={i}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td 
                    key={`${rowIndex}-${colIndex}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                  >
                    {String(row[column] !== null ? row[column] : 'null')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
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
          disabled={isExecuting}
          className={`px-4 py-2 bg-primary text-white rounded-md flex items-center space-x-2 ${
            isExecuting ? 'opacity-50 cursor-not-allowed' : 'button-hover-effect'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>{isExecuting ? 'Running...' : 'Run'}</span>
        </button>
      </div>
      
      {/* Table Data Display */}
      {tableData && renderTableData()}
    </div>
  );
};

export default CodeEditor;
