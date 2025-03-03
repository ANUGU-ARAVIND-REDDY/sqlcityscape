
import React, { useState, useEffect } from 'react';
import { useAuthSession } from '@/hooks/useAuthSession';
import { supabase } from '@/integrations/supabase/client';
import CodeEditor from './CodeEditor';
import CityView from './CityView';
import { ChevronRight, ChevronLeft, Lightbulb, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Challenge {
  id: number;
  title: string;
  description: string;
  hints: string[];
  initialCode: string;
  solution: string; // Just for demo purposes
}

interface LevelInterfaceProps {
  levelNumber?: number;
  levelTitle?: string;
  challenges?: Challenge[];
}

const sampleChallenges: Challenge[] = [
  {
    id: 1,
    title: "Create Your First Building",
    description: "Write a SQL query to create a table named 'buildings' with columns for id, name, and height.",
    hints: [
      "Use CREATE TABLE to define a new table structure",
      "Remember to specify column types (INTEGER, TEXT, etc.)",
      "Don't forget to add a PRIMARY KEY"
    ],
    initialCode: "-- Create your buildings table below\n\n",
    solution: "CREATE TABLE buildings (\n  id INTEGER PRIMARY KEY,\n  name TEXT,\n  height INTEGER\n);"
  },
  {
    id: 2,
    title: "Add Your First Building",
    description: "Insert a record into your buildings table to create your first structure.",
    hints: [
      "Use INSERT INTO to add records to a table",
      "Specify both the column names and values",
      "Height values determine how tall your building will appear"
    ],
    initialCode: "-- Insert your first building\n\n",
    solution: "INSERT INTO buildings (name, height) VALUES ('Tower', 5);"
  }
];

const LevelInterface: React.FC<LevelInterfaceProps> = ({
  levelNumber = 1,
  levelTitle = "Welcome to SQLCityscape",
  challenges = sampleChallenges
}) => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);
  const [userCode, setUserCode] = useState(challenges[currentChallengeIndex].initialCode);
  const { user } = useAuthSession();
  const { toast } = useToast();
  
  const currentChallenge = challenges[currentChallengeIndex];
  
  // Load user progress when component mounts
  useEffect(() => {
    if (user) {
      loadUserProgress();
    }
  }, [user]);

  // Load user's progress from the database
  const loadUserProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('user_levels')
        .select('level_id, completed_at')
        .eq('user_id', user?.id)
        .is('completed_at', 'not.null');
      
      if (error) {
        console.error('Error loading user progress:', error);
        return;
      }
      
      if (data && data.length > 0) {
        const completedIds = data.map(level => level.level_id);
        setCompletedChallenges(completedIds);
      }
    } catch (error) {
      console.error('Failed to load user progress:', error);
    }
  };

  // Save user progress to the database
  const saveUserProgress = async (challengeId: number, completed: boolean) => {
    if (!user) return;

    try {
      if (completed) {
        const { error } = await supabase
          .from('user_levels')
          .upsert({
            user_id: user.id,
            level_id: challengeId,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id, level_id' });
          
        if (error) {
          console.error('Error saving progress:', error);
          toast({
            title: 'Error',
            description: 'Could not save your progress',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Failed to save user progress:', error);
    }
  };
  
  const handleExecute = async (code: string) => {
    setUserCode(code);
    
    // Simple solution check (in a real app, this would be validated by the backend)
    const normalizedCode = code.trim().toLowerCase().replace(/\s+/g, ' ');
    const normalizedSolution = currentChallenge.solution.trim().toLowerCase().replace(/\s+/g, ' ');
    
    const isCorrect = normalizedCode.includes(normalizedSolution);
    
    if (isCorrect) {
      if (!completedChallenges.includes(currentChallenge.id)) {
        setCompletedChallenges([...completedChallenges, currentChallenge.id]);
        
        // Save progress to the database
        await saveUserProgress(currentChallenge.id, true);
        
        // Show success message
        toast({
          title: 'Challenge Completed!',
          description: 'Great job! You can move to the next challenge now.',
        });
      }
    }
  };
  
  const handleNextChallenge = () => {
    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
      setUserCode(challenges[currentChallengeIndex + 1].initialCode);
      setShowHints(false);
    }
  };
  
  const handlePreviousChallenge = () => {
    if (currentChallengeIndex > 0) {
      setCurrentChallengeIndex(currentChallengeIndex - 1);
      setUserCode(challenges[currentChallengeIndex - 1].initialCode);
      setShowHints(false);
    }
  };
  
  const isChallengeCompleted = completedChallenges.includes(currentChallenge.id);

  return (
    <div className="level-interface w-full h-full flex flex-col">
      {/* Level Header */}
      <div className="p-4 md:p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              Level {levelNumber}
            </div>
            <h1 className="text-2xl font-bold">{levelTitle}</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {challenges.map((challenge, index) => (
              <div 
                key={challenge.id}
                className={`w-3 h-3 rounded-full ${
                  completedChallenges.includes(challenge.id)
                    ? 'bg-green-500'
                    : index === currentChallengeIndex
                    ? 'bg-primary'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-6 bg-gray-50 dark:bg-gray-900 overflow-auto">
        {/* Left Column - Challenge and Code Editor */}
        <div className="flex flex-col space-y-6">
          {/* Challenge Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-semibold">{currentChallenge.title}</h2>
              
              {isChallengeCompleted && (
                <div className="flex items-center space-x-1 text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full text-xs font-medium">
                  <Check className="w-3 h-3" />
                  <span>Completed</span>
                </div>
              )}
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {currentChallenge.description}
            </p>
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowHints(!showHints)}
                className="flex items-center space-x-1 text-primary hover:underline text-sm"
              >
                <Lightbulb className="w-4 h-4" />
                <span>{showHints ? 'Hide Hints' : 'Show Hints'}</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePreviousChallenge}
                  disabled={currentChallengeIndex === 0}
                  className={`p-2 rounded-full ${
                    currentChallengeIndex === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className="text-sm font-medium">
                  {currentChallengeIndex + 1} / {challenges.length}
                </span>
                
                <button
                  onClick={handleNextChallenge}
                  disabled={currentChallengeIndex === challenges.length - 1}
                  className={`p-2 rounded-full ${
                    currentChallengeIndex === challenges.length - 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Hints Section */}
            {showHints && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800/30 animate-fade-in">
                <h3 className="font-medium text-sm mb-2 text-blue-700 dark:text-blue-400">Hints:</h3>
                <ul className="space-y-1 text-sm text-blue-600 dark:text-blue-300">
                  {currentChallenge.hints.map((hint, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{hint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Code Editor */}
          <CodeEditor 
            initialCode={userCode} 
            onExecute={handleExecute}
          />
        </div>
        
        {/* Right Column - City Visualization */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 aspect-square max-h-[600px]">
          <CityView />
        </div>
      </div>
    </div>
  );
};

export default LevelInterface;
