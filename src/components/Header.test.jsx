import { render, screen } from '@testing-library/react';
import Header from './Header';
import { describe, it, expect } from 'vitest';

describe('Header Component', () => {
  it('renders title and tagline from translation prop', () => {
    const mockT = {
      title: 'Test Title',
      tagline: 'Test Tagline',
      mis: 'MIS 123'
    };

    render(<Header t={mockT} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Tagline')).toBeInTheDocument();
    expect(screen.getByText('MIS 123')).toBeInTheDocument();
    expect(screen.getByText('Skill India')).toBeInTheDocument();
  });
});
