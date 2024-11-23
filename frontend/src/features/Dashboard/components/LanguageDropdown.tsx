// LanguageDropdown.tsx
import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Language {
  id: string;
  name: string;
  icon?: string;
}

interface LanguageDropdownProps {
  onSelect?: (language: Language) => void;
  defaultLanguage?: Language;
}

const languages: Language[] = [
  { id: 'python', name: 'Python' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'csharp', name: 'C#' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'swift', name: 'Swift' },
];

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  onSelect,
  defaultLanguage = languages[0],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(defaultLanguage);

  const handleSelect = (language: Language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
    onSelect?.(language);
  };

  return (
    <div className="relative w-64">
      {/* Selected Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="text-gray-700">{selectedLanguage.name}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <ul className="py-1 max-h-60 overflow-auto">
            {languages.map((language) => (
              <li key={language.id}>
                <button
                  onClick={() => handleSelect(language)}
                  className="w-full px-4 py-2 text-left flex items-center justify-between hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                >
                  <span className="text-gray-700">{language.name}</span>
                  {selectedLanguage.id === language.id && (
                    <Check className="w-4 h-4 text-blue-500" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;