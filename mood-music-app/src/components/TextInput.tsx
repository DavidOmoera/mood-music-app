import { useState } from 'react';
import { analyzeText } from '../utils/sentimentAnalysis';

interface TextInputProps {
  onMoodDetected: (mood: string) => void;
}

const TextInput = ({ onMoodDetected }: TextInputProps) => {
  const [mood, setMood] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mood.trim()) {
      const detectedMood = analyzeText(mood);
      onMoodDetected(detectedMood);
      setMood('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your mood (e.g., happy, sad, angry, excited)"
        className="bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-full px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
      />
      <button
        onClick={handleSubmit}
        disabled={!mood.trim()}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-semibold transition-colors disabled:opacity-50"
      >
        Submit
      </button>
    </div>
  );
};

export default TextInput;