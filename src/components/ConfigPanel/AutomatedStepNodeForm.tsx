import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { automatedStepNodeSchema, AutomatedStepNodeFormData } from '../../types/forms';
import { AutomatedStepNodeData } from '../../types/nodes';
import { ActionSelector } from '../FormFields/ActionSelector';
import { useAutomations } from '../../hooks/useAutomations';

interface AutomatedStepNodeFormProps {
  nodeData: AutomatedStepNodeData;
  onUpdate: (data: Partial<AutomatedStepNodeData>) => void;
}

export const AutomatedStepNodeForm: React.FC<AutomatedStepNodeFormProps> = ({ nodeData, onUpdate }) => {
  const isInitialMount = useRef(true);
  
  // Use the custom hook to fetch automations with caching and retry support
  const { actions, loading, error: apiError, refetch } = useAutomations();

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm<AutomatedStepNodeFormData>({
    resolver: zodResolver(automatedStepNodeSchema),
    defaultValues: {
      title: nodeData.title || '',
      actionId: nodeData.actionId || '',
      actionLabel: nodeData.actionLabel || '',
      parameters: nodeData.parameters || {}
    },
    mode: 'onChange'
  });

  // Watch all form values and update immediately
  const formValues = watch();
  const formValuesRef = useRef<string>('');

  useEffect(() => {
    const formValuesStr = JSON.stringify(formValues);
    
    // Skip if values haven't actually changed
    if (formValuesRef.current === formValuesStr) {
      return;
    }
    
    // Skip the initial mount to avoid infinite loop
    if (isInitialMount.current) {
      isInitialMount.current = false;
      formValuesRef.current = formValuesStr;
      return;
    }
    
    formValuesRef.current = formValuesStr;
    onUpdate(formValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues]);

  const handleActionChange = (actionId: string, actionLabel: string) => {
    setValue('actionId', actionId, { shouldValidate: true });
    setValue('actionLabel', actionLabel, { shouldValidate: true });
  };

  const handleParametersChange = (parameters: Record<string, string>) => {
    setValue('parameters', parameters, { shouldValidate: true });
  };

  return (
    <form className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
            errors.title
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Enter automated step title"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="text-sm text-red-600 mt-1" role="alert">
            {errors.title.message}
          </p>
        )}
      </div>

      {apiError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{apiError.message}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
          >
            Retry
          </button>
        </div>
      )}

      <Controller
        name="actionId"
        control={control}
        render={({ field }) => (
          <ActionSelector
            label="Action"
            actions={actions}
            selectedActionId={field.value}
            parameters={watch('parameters')}
            onActionChange={handleActionChange}
            onParametersChange={handleParametersChange}
            error={errors.actionId?.message}
            loading={loading}
            required
          />
        )}
      />
    </form>
  );
};
