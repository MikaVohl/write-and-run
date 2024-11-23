import React from 'react';
import { Language } from '@/types/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

export interface LanguageDrop {
  id: Language | undefined;
  name: string;
  icon?: string;
}

export interface LanguageDropdownProps {
  language?: string;
  onSelect?: (language: LanguageDrop) => void;
  disabled?: boolean;
  className?: string;

}

const languages: LanguageDrop[] = [
  { id: Language.python, name: 'Python' },
  { id: Language.c, name: 'C' },
  { id: Language.bash, name: 'Bash' },
  { id: Language.java, name: 'Java' },
];

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  language,
  onSelect,
  disabled = false,
  className
}) => {
  const handleValueChange = (value: string) => {
    const selectedLanguage = languages.find(lang => lang.id === value);
    if (selectedLanguage) {
      onSelect?.(selectedLanguage);
    }
  };

  return (
    <div>
      <Select
        value={language}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            "w-64 h-9 px-3 py-2",
            "bg-white dark:bg-neutral-900",
            "border-gray-200 dark:border-neutral-800",
            "hover:bg-gray-50 dark:hover:bg-neutral-800",
            className
          )}
        >
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem
              key={lang.id}
              value={lang.id || ''}
              className="h-9"
            >
              <div className="flex items-center justify-between">
                {lang.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageDropdown;