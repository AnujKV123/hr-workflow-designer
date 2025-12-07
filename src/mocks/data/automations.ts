// Mock data for automated actions

import { AutomatedAction } from '../../types/api';

export const automations: AutomatedAction[] = [
  {
    id: 'send_email',
    label: 'Send Email',
    params: ['to', 'subject', 'body']
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    params: ['template', 'recipient']
  },
  {
    id: 'create_ticket',
    label: 'Create Support Ticket',
    params: ['title', 'priority', 'assignee']
  },
  {
    id: 'update_database',
    label: 'Update Database Record',
    params: ['table', 'recordId', 'fields']
  },
  {
    id: 'send_notification',
    label: 'Send Push Notification',
    params: ['userId', 'message']
  }
];
