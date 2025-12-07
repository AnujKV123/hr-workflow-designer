import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NodeSidebar } from '../components/Sidebar/NodeSidebar';

describe('NodeSidebar', () => {
  it('renders the sidebar with title and description', () => {
    render(<NodeSidebar />);
    
    expect(screen.getByText('Node Types')).toBeDefined();
    expect(screen.getByText('Drag nodes to the canvas')).toBeDefined();
  });

  it('renders all node type templates', () => {
    render(<NodeSidebar />);
    
    expect(screen.getByText('Start')).toBeDefined();
    expect(screen.getByText('Task')).toBeDefined();
    expect(screen.getByText('Approval')).toBeDefined();
    expect(screen.getByText('Automated Step')).toBeDefined();
    expect(screen.getByText('End')).toBeDefined();
  });

  it('renders node descriptions', () => {
    render(<NodeSidebar />);
    
    expect(screen.getByText('Workflow entry point')).toBeDefined();
    expect(screen.getByText('Human task assignment')).toBeDefined();
    expect(screen.getByText('Approval step with role')).toBeDefined();
    expect(screen.getByText('System automation')).toBeDefined();
    expect(screen.getByText('Workflow completion')).toBeDefined();
  });
});
