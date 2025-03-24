// src/components/ui/SearchableSelect.tsx
import { Combobox } from "@headlessui/react";
import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
}

export function SearchableSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
}: SearchableSelectProps) {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.label.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Combobox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <Combobox.Input
            className={cn(
              "w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            displayValue={(val: string) =>
              options.find((option) => option.value === val)?.label || ""
            }
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </Combobox.Button>
          {filteredOptions?.length > 0 && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
              {filteredOptions.map((option) => (
                <Combobox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    `cursor-pointer select-none relative py-2 pl-10 pr-4 transition-colors duration-150 ${
                      active ? "bg-blue-50 text-blue-800" : "text-gray-900"
                    }`
                  }
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.label}
                      </span>
                      {selected && (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-blue-800" : "text-blue-600"
                          }`}
                        >
                          <Check className="w-5 h-5" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    </div>
  );
}
