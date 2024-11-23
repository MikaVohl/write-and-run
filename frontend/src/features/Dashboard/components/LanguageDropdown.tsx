import { useState, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Language } from '@/types/types';

export interface LanguageDrop {
  id: Language | undefined;
  name: string;
  icon?: string;
}

export interface LanguageDropdownProps {
  language?: string;
  onSelect?: (language: LanguageDrop) => void;
}

const languages: LanguageDrop[] = [
  { id: undefined, name: 'Find Language' },
  { id: Language.python, name: 'Python' },
  { id: Language.c, name: 'C' },
  { id: Language.bash, name: 'Bash' },
  { id: Language.java, name: 'Java' },
];

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  language,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageDrop>(() => {
    return languages.find(lang => lang.id === language) || languages[0];
  });

  // Update selected language when prop changes
  useEffect(() => {
    const newLanguage = languages.find(lang => lang.id === language);
    if (newLanguage) {
      setSelectedLanguage(newLanguage);
    }
  }, [language]);

  const handleSelect = (language: LanguageDrop) => {
    if (language.id === undefined) return;
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