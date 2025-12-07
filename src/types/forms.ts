// Form type definitions for node configuration forms

import { z } from 'zod';

// StartNode Form Schema
export const startNodeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  metadata: z.record(z.string(), z.string())
});

export type StartNodeFormData = z.infer<typeof startNodeSchema>;

// TaskNode Form Schema
export const taskNodeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  assignee: z.string(),
  dueDate: z.string(),
  customFields: z.record(z.string(), z.string())
});

export type TaskNodeFormData = z.infer<typeof taskNodeSchema>;

// ApprovalNode Form Schema
export const approvalNodeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  approverRole: z.string().min(1, 'Approver role is required'),
  autoApproveThreshold: z.number().min(0)
});

export type ApprovalNodeFormData = z.infer<typeof approvalNodeSchema>;

// AutomatedStepNode Form Schema
export const automatedStepNodeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  actionId: z.string().min(1, 'Action is required'),
  actionLabel: z.string(),
  parameters: z.record(z.string(), z.string())
});

export type AutomatedStepNodeFormData = z.infer<typeof automatedStepNodeSchema>;

// EndNode Form Schema
export const endNodeSchema = z.object({
  endMessage: z.string(),
  showSummary: z.boolean()
});

export type EndNodeFormData = z.infer<typeof endNodeSchema>;
