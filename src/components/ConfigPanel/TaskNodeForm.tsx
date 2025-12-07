import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskNodeSchema, TaskNodeFormData } from '../../types/forms';
import { TaskNodeData } from '../../types/nodes';
import { KeyValueInput } from '../FormFields/KeyValueInput';
import { DateInput } from '../FormFields/DateInput';

interface TaskNodeFormProps {
  nodeData: TaskNodeData;
  onUpdate: (data: Partial<TaskNodeData>) => void;
}

export const TaskNodeForm: React.FC<TaskNodeFormProps> = ({ nodeData, onUpdate }) => {
  const isInitialMount = useRef(true);
  
  const {
    register,
    control,
    watch,
    formState: { errors }
  } = useForm<TaskNodeFormData>({
    resolver: zodResolver(taskNodeSchema),
    defaultValues: {
      title: nodeData.title || '',
      description: nodeData.description || '',
      assignee: nodeData.assignee || '',
      dueDate: nodeData.dueDate || '',
      customFields: nodeData.customFields || {}
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
          placeholder="Enter task title"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="text-sm text-red-600 mt-1" role="alert">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task description"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">
          Assignee
        </label>
        <input
          id="assignee"
          type="text"
          {...register('assignee')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter assignee name"
        />
      </div>

      <Controller
        name="dueDate"
        control={control}
        render={({ field }) => (
          <DateInput
            label="Due Date"
            value={field.value}
            onChange={field.onChange}
            error={errors.dueDate?.message}
          />
        )}
      />

      <Controller
        name="customFields"
        control={control}
        render={({ field }) => (
          <KeyValueInput
            label="Custom Fields"
            value={field.value}
            onChange={field.onChange}
            placeholder={{ key: 'Field Name', value: 'Field Value' }}
          />
        )}
      />
    </form>
  );
};
