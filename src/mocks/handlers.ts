// MSW request handlers for mock API

import { http, HttpResponse } from 'msw';
import { automations } from './data/automations';
import { simulateWorkflow } from './data/simulations';
import { WorkflowGraph } from '../types/workflow';

export const handlers = [
  // GET /api/automations - Returns available automated actions
  http.get('/api/automations', () => {
    return HttpResponse.json(automations);
  }),
  
  // POST /api/simulate - Simulates workflow execution
  http.post('/api/simulate', async ({ request }) => {
    const workflow = await request.json() as WorkflowGraph;
    const result = simulateWorkflow(workflow);
    return HttpResponse.json(result);
  })
];
