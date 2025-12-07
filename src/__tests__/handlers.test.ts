// Tests for MSW mock API handlers

import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from '../mocks/handlers';
import { getAutomations, simulateWorkflowAPI } from '../services/api';
import { WorkflowGraph } from '../types/workflow';
import { NodeType } from '../types/nodes';

// Set up MSW server for testing
const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('MSW Mock API Handlers', () => {
  describe('GET /api/automations', () => {
    it('should return list of automated actions', async () => {
      const automations = await getAutomations();
      
      expect(automations).toBeDefined();
      expect(Array.isArray(automations)).toBe(true);
      expect(automations.length).toBeGreaterThan(0);
      
      // Verify structure of first automation
      const firstAutomation = automations[0];
      expect(firstAutomation).toHaveProperty('id');
      expect(firstAutomation).toHaveProperty('label');
      expect(firstAutomation).toHaveProperty('params');
      expect(Array.isArray(firstAutomation.params)).toBe(true);
    });
    
    it('should include expected automation actions', async () => {
      const automations = await getAutomations();
      const actionIds = automations.map(a => a.id);
      
      expect(actionIds).toContain('send_email');
      expect(actionIds).toContain('generate_doc');
      expect(actionIds).toContain('create_ticket');
      expect(actionIds).toContain('update_database');
      expect(actionIds).toContain('send_notification');
    });
  });
  
  describe('POST /api/simulate', () => {
    it('should accept workflow and return simulation result', async () => {
      const workflow: WorkflowGraph = {
        nodes: [
          {
            id: '1',
            type: 'start',
            position: { x: 0, y: 0 },
            data: {
              id: '1',
              type: NodeType.START,
              label: 'Start',
              title: 'Start Workflow',
              metadata: {}
            }
          },
          {
            id: '2',
            type: 'end',
            position: { x: 200, y: 0 },
            data: {
              id: '2',
              type: NodeType.END,
              label: 'End',
              endMessage: 'Workflow complete',
              showSummary: true
            }
          }
        ],
        edges: [
          {
            id: 'e1-2',
            source: '1',
            target: '2'
          }
        ]
      };
      
      const result = await simulateWorkflowAPI(workflow);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('steps');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('executionTime');
      expect(Array.isArray(result.steps)).toBe(true);
      expect(Array.isArray(result.errors)).toBe(true);
    });
    
    it('should return validation errors for invalid workflow', async () => {
      const invalidWorkflow: WorkflowGraph = {
        nodes: [
          {
            id: '1',
            type: 'task',
            position: { x: 0, y: 0 },
            data: {
              id: '1',
              type: NodeType.TASK,
              label: 'Task',
              title: 'Some Task',
              description: '',
              assignee: '',
              dueDate: '',
              customFields: {}
            }
          }
        ],
        edges: []
      };
      
      const result = await simulateWorkflowAPI(invalidWorkflow);
      
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.message.includes('Start Node'))).toBe(true);
    });
  });
});
