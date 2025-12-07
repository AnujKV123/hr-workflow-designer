import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { startNodeSchema, StartNodeFormData } from '../../types/forms';
import { StartNodeData } from '../../types/nodes';
import { KeyValueInput } from '../FormFields/KeyValueInput';

interface StartNodeFormProps {
  nodeData: StartNodeData;
  onUpdate: (data: Partial<StartNodeData>) => void;
}

export const StartNodeForm: React.FC<StartNodeFormProps> = ({ nodeData, onUpdate }) => {
  const isInitialMount = useRef(true);
  
  const {
    register,
    control,
    watch,
    formState: { errors }
  } = useForm<StartNodeFormData>({
    resolver: zodResolver(startNodeSchema),
    defaultValues: {
      title: nodeData.title || '',
      metadata: nodeData.metadata || {}
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
          placeholder="Enter start node title"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="text-sm text-red-600 mt-1" role="alert">
            {errors.title.message}
          </p>
        )}
      </div>

      <Controller
        name="metadata"
        control={control}
        render={({ field }) => (
          <KeyValueInput
            label="Metadata"
            value={field.value}
            onChange={field.onChange}
            placeholder={{ key: 'Key', value: 'Value' }}
          />
        )}
      />
    </form>
  );
};
