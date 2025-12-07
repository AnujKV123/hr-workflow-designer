import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { approvalNodeSchema, ApprovalNodeFormData } from '../../types/forms';
import { ApprovalNodeData } from '../../types/nodes';

interface ApprovalNodeFormProps {
  nodeData: ApprovalNodeData;
  onUpdate: (data: Partial<ApprovalNodeData>) => void;
}

export const ApprovalNodeForm: React.FC<ApprovalNodeFormProps> = ({ nodeData, onUpdate }) => {
  const isInitialMount = useRef(true);
  
  const {
    register,
    watch,
    formState: { errors }
  } = useForm<ApprovalNodeFormData>({
    resolver: zodResolver(approvalNodeSchema),
    defaultValues: {
      title: nodeData.title || '',
      approverRole: nodeData.approverRole || '',
      autoApproveThreshold: nodeData.autoApproveThreshold || 0
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
          placeholder="Enter approval node title"
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
        <label htmlFor="approverRole" className="block text-sm font-medium text-gray-700">
          Approver Role <span className="text-red-500">*</span>
        </label>
        <input
          id="approverRole"
          type="text"
          {...register('approverRole')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
            errors.approverRole
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="e.g., Manager, HR Director"
          aria-invalid={!!errors.approverRole}
          aria-describedby={errors.approverRole ? 'approverRole-error' : undefined}
        />
        {errors.approverRole && (
          <p id="approverRole-error" className="text-sm text-red-600 mt-1" role="alert">
            {errors.approverRole.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="autoApproveThreshold" className="block text-sm font-medium text-gray-700">
          Auto-Approve Threshold
        </label>
        <input
          id="autoApproveThreshold"
          type="number"
          {...register('autoApproveThreshold', { valueAsNumber: true })}
          min="0"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
            errors.autoApproveThreshold
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="0"
          aria-invalid={!!errors.autoApproveThreshold}
          aria-describedby={errors.autoApproveThreshold ? 'threshold-error' : undefined}
        />
        {errors.autoApproveThreshold && (
          <p id="threshold-error" className="text-sm text-red-600 mt-1" role="alert">
            {errors.autoApproveThreshold.message}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Number of approvals required before auto-approval
        </p>
      </div>
    </form>
  );
};
