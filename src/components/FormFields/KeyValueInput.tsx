import React, { useState } from 'react';

interface KeyValuePair {
  key: string;
  value: string;
}

interface KeyValueInputProps {
  label: string;
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  error?: string;
  placeholder?: {
    key: string;
    value: string;
  };
}

export const KeyValueInput: React.FC<KeyValueInputProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder = { key: 'Key', value: 'Value' }
}) => {
  const [pairs, setPairs] = useState<KeyValuePair[]>(() => {
    return Object.entries(value).map(([key, val]) => ({ key, value: val }));
  });

  const handleAddPair = () => {
    const newPairs = [...pairs, { key: '', value: '' }];
    setPairs(newPairs);
  };

  const handleRemovePair = (index: number) => {
    const newPairs = pairs.filter((_, i) => i !== index);
    setPairs(newPairs);
    
    // Convert to record and notify parent
    const record = newPairs.reduce((acc, pair) => {
      if (pair.key.trim()) {
        acc[pair.key] = pair.value;
      }
      return acc;
    }, {} as Record<string, string>);
    onChange(record);
  };

  const handlePairChange = (index: number, field: 'key' | 'value', newValue: string) => {
    const newPairs = [...pairs];
    newPairs[index][field] = newValue;
    setPairs(newPairs);

    // Convert to record and notify parent
    const record = newPairs.reduce((acc, pair) => {
      if (pair.key.trim()) {
        acc[pair.key] = pair.value;
      }
      return acc;
    }, {} as Record<string, string>);
    onChange(record);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="space-y-2">
        {pairs.map((pair, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={pair.key}
              onChange={(e) => handlePairChange(index, 'key', e.target.value)}
              placeholder={placeholder.key}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={pair.value}
              onChange={(e) => handlePairChange(index, 'value', e.target.value)}
              placeholder={placeholder.value}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => handleRemovePair(index)}
              className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
              aria-label="Remove pair"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddPair}
        className="w-full px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 border border-blue-300 rounded-md transition-colors"
      >
        + Add {label}
      </button>

      {error && (
        <p className="text-sm text-red-600 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
