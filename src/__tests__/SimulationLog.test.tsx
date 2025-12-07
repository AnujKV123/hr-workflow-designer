import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SimulationLog } from '../components/Sandbox/SimulationLog';
import { NodeType } from '../types/nodes';
import { SimulationStep } from '../../types/api';

describe('SimulationLog', () => {
  const mockSteps: SimulationStep[] = [
    {
      nodeId: '1',
      nodeType: NodeType.START,
      nodeTitle: 'Start Node',
      status: 'completed',
      timestamp: '2024-01-01T10:00:00Z',
      details: 'Workflow started'
    },
    {
      nodeId: '2',
      nodeType: NodeType.TASK,
      nodeTitle: 'Task Node',
      status: 'completed',
      timestamp: '2024-01-01T10:00:01Z'
    },
    {
      nodeId: '3',
      nodeType: NodeType.END,
      nodeTitle: 'End Node',
      status: 'completed',
      timestamp: '2024-01-01T10:00:02Z'
    }
  ];

  it('should render simulation log with all steps', () => {
    render(<SimulationLog steps={mockSteps} executionTime={150} success={true} />);
    
    expect(screen.getByText('Simulation Successful')).toBeInTheDocument();
    expect(screen.getByText('Execution time: 150ms')).toBeInTheDocument();
    expect(screen.getByText(/Execution Steps \(3\)/i)).toBeInTheDocument();
  });

  it('should display each step with node title, type, status, and timestamp', () => {
    render(<SimulationLog steps={mockSteps} executionTime={150} success={true} />);
    
    // Check first step
    expect(screen.getByText('Start Node')).toBeInTheDocument();
    expect(screen.getByText('start')).toBeInTheDocument();
    
    // Check that all steps show COMPLETED status (there are 3)
    const completedStatuses = screen.getAllByText('COMPLETED');
    expect(completedStatuses).toHaveLength(3);
    
    // Check second step
    expect(screen.getByText('Task Node')).toBeInTheDocument();
    expect(screen.getByText('task')).toBeInTheDocument();
    
    // Check third step
    expect(screen.getByText('End Node')).toBeInTheDocument();
    expect(screen.getByText('end')).toBeInTheDocument();
  });

  it('should display step details when provided', () => {
    render(<SimulationLog steps={mockSteps} executionTime={150} success={true} />);
    
    expect(screen.getByText('Workflow started')).toBeInTheDocument();
  });

  it('should show success styling when simulation succeeds', () => {
    const { container } = render(<SimulationLog steps={mockSteps} executionTime={150} success={true} />);
    
    const header = container.querySelector('.bg-green-50');
    expect(header).toBeInTheDocument();
    expect(screen.getByText('Simulation Successful')).toBeInTheDocument();
  });

  it('should show failure styling when simulation fails', () => {
    const failedSteps: SimulationStep[] = [
      {
        nodeId: '1',
        nodeType: NodeType.START,
        nodeTitle: 'Start Node',
        status: 'failed',
        timestamp: '2024-01-01T10:00:00Z',
        details: 'Failed to start'
      }
    ];

    const { container } = render(<SimulationLog steps={failedSteps} executionTime={50} success={false} />);
    
    const header = container.querySelector('.bg-red-50');
    expect(header).toBeInTheDocument();
    expect(screen.getByText('Simulation Failed')).toBeInTheDocument();
  });

  it('should display different status icons for different statuses', () => {
    const mixedSteps: SimulationStep[] = [
      {
        nodeId: '1',
        nodeType: NodeType.START,
        nodeTitle: 'Completed Step',
        status: 'completed',
        timestamp: '2024-01-01T10:00:00Z'
      },
      {
        nodeId: '2',
        nodeType: NodeType.TASK,
        nodeTitle: 'Failed Step',
        status: 'failed',
        timestamp: '2024-01-01T10:00:01Z'
      },
      {
        nodeId: '3',
        nodeType: NodeType.END,
        nodeTitle: 'Pending Step',
        status: 'pending',
        timestamp: '2024-01-01T10:00:02Z'
      }
    ];

    render(<SimulationLog steps={mixedSteps} executionTime={100} success={false} />);
    
    expect(screen.getByText('Completed Step')).toBeInTheDocument();
    expect(screen.getByText('Failed Step')).toBeInTheDocument();
    expect(screen.getByText('Pending Step')).toBeInTheDocument();
  });

  it('should handle empty steps array', () => {
    render(<SimulationLog steps={[]} executionTime={0} success={true} />);
    
    expect(screen.getByText('Simulation Successful')).toBeInTheDocument();
    expect(screen.getByText(/Execution Steps \(0\)/i)).toBeInTheDocument();
  });

  it('should format timestamps correctly', () => {
    const steps: SimulationStep[] = [
      {
        nodeId: '1',
        nodeType: NodeType.START,
        nodeTitle: 'Start',
        status: 'completed',
        timestamp: '2024-01-01T14:30:45Z'
      }
    ];

    render(<SimulationLog steps={steps} executionTime={100} success={true} />);
    
    // The timestamp should be formatted as a locale time string
    // We can't test the exact format as it depends on locale, but we can check it's rendered
    const timeElements = screen.getAllByText(/\d{1,2}:\d{2}:\d{2}/);
    expect(timeElements.length).toBeGreaterThan(0);
  });
});
