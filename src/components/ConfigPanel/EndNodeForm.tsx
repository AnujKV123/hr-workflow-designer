import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { endNodeSchema, EndNodeFormData } from '../../types/forms';
import { EndNodeData } from '../../types/nodes';

interface EndNodeFormProps {
  nodeData: EndNodeData;
  onUpdate: (data: Partial<EndNodeData>) => void;
}

export const EndNodeForm: React.FC<EndNodeFormProps> = ({ nodeData, onUpdate }) => {
  const isInitialMount = useRef(true);
  
  const {
    register,
    watch,
    formState: { errors }
  } = useForm<EndNodeFormData>({
    resolver: zodResolver(endNodeSchema),
    defaultValues: {
      endMessage: nodeData.endMessage || '',
      showSummary: nodeData.showSummary || false
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
        <label htmlFor="endMessage" className="block text-sm font-medium text-gray-700">
          End Message
        </label>
        <textarea
          id="endMessage"
          {...register('endMessage')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter completion message"
        />
        {errors.endMessage && (
          <p className="text-sm text-red-600 mt-1" role="alert">
            {errors.endMessage.message}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="showSummary"
          type="checkbox"
          {...register('showSummary')}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="showSummary" className="text-sm font-medium text-gray-700">
          Show workflow summary
        </label>
      </div>
      {errors.showSummary && (
        <p className="text-sm text-red-600 mt-1" role="alert">
          {errors.showSummary.message}
        </p>
      )}
    </form>
  );
};
