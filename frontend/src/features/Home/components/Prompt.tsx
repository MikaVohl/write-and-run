import React, { useState, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';

const Prompt = ({ onSubmit }: { onSubmit: (content: string) => void }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {

    setIsLoading(true);

    // Trigger callback to parent
    onSubmit(content);

    // Simulate API call or clear the input after submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div>
      <div className="p-4">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Give some optional context here..."
            className="w-full min-h-[50px] max-h-[50px] p-3 text-gray-800 bg-gray-50 
                      rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500
                      focus:border-transparent outline-none resize-none
                      transition-all duration-200"
            maxLength={200}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="absolute right-3 top-7 transform -translate-y-2/3 
                       w-8 h-8 flex items-center justify-center
                       rounded-lg text-gray-400 hover:text-blue-500 
                       disabled:text-gray-300 disabled:hover:text-gray-300
                       transition-colors duration-200"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Prompt;
