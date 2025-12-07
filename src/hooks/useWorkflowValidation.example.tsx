/**
 * Example usage of useWorkflowValidation hook
 * This file demonstrates how to use the hook in a component
 */

import React from 'react';
import { useWorkflowValidation } from './useWorkflowValidation';

export function ValidationDisplay() {
  const { errors, warnings, isValid, hasWarnings } = useWorkflowValidation();

  return (
    <div className="validation-panel">
      {/* Success indicator */}
      {isValid && !hasWarnings && (
        <div className="validation-success">
          ✓ Workflow is valid
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="validation-errors">
          <h3>Errors</h3>
          <ul>
            {errors.map((error, index) => (
              <li key={index} className="error-item">
                {error.nodeId && <span>Node {error.nodeId}: </span>}
                {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="validation-warnings">
          <h3>Warnings</h3>
          <ul>
            {warnings.map((warning, index) => (
              <li key={index} className="warning-item">
                {warning.nodeId && <span>Node {warning.nodeId}: </span>}
                {warning.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
