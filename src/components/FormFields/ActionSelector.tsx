import React, { useEffect, useState } from 'react';
import { AutomatedAction } from '../../types/api';

interface ActionSelectorProps {
  label: string;
  actions: AutomatedAction[];
  selectedActionId: string;
  parameters: Record<string, string>;
  onActionChange: (actionId: string, actionLabel: string) => void;
  onParametersChange: (parameters: Record<string, string>) => void;
  error?: string;
  loading?: boolean;
  required?: boolean;
}

export const ActionSelector: React.FC<ActionSelectorProps> = ({
  label,
  actions,
  selectedActionId,
  parameters,
  onActionChange,
  onParametersChange,
  error,
  loading = false,
  required = false
}) => {
  const [selectedAction, setSelectedAction] = useState<AutomatedAction | null>(null);

  useEffect(() => {
    const action = actions.find(a => a.id === selectedActionId);
    setSelectedAction(action || null);
  }, [selectedActionId, actions]);

  const handleActionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const actionId = e.target.value;
    const action = actions.find(a => a.id === actionId);
    
    if (action) {
      onActionChange(action.id, action.label);
      // Initialize parameters with empty strings for all params
      const initialParams = action.params.reduce((acc, param) => {
        acc[param] = parameters[param] || '';
        return acc;
      }, {} as Record<string, string>);
      onParametersChange(initialParams);
    } else {
      onActionChange('', '');
      onParametersChange({});
    }
  };

  const handleParameterChange = (paramName: string, value: string) => {
    const updatedParams = {
      ...parameters,
      [paramName]: value
    };
    onParametersChange(updatedParams);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <select
          value={selectedActionId}
          onChange={handleActionSelect}
          disabled={loading}
          required={required}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : undefined}
        >
          <option value="">
            {loading ? 'Loading actions...' : 'Select an action'}
          </option>
          {actions.map(action => (
            <option key={action.id} value={action.id}>
              {action.label}
            </option>
          ))}
        </select>

        {error && (
          <p id={`${label}-error`} className="text-sm text-red-600 mt-1" role="alert">
            {error}
          </p>
        )}
      </div>

      {selectedAction && selectedAction.params.length > 0 && (
        <div className="space-y-3 pl-4 border-l-2 border-gray-200">
          <p className="text-sm font-medium text-gray-600">Action Parameters</p>
          
          {selectedAction.params.map(param => (
            <div key={param} className="space-y-1">
              <label htmlFor={`param-${param}`} className="block text-sm font-medium text-gray-700 capitalize">
                {param.replace(/_/g, ' ')}
              </label>
              <input
                id={`param-${param}`}
                type="text"
                value={parameters[param] || ''}
                onChange={(e) => handleParameterChange(param, e.target.value)}
                placeholder={`Enter ${param.replace(/_/g, ' ')}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
