import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';
import { describe, it, expect } from 'vitest';

describe('Footer Component', () => {
  it('renders footer links and contact info', () => {
    const mockT = {
      impLinks: 'Important Links',
      home: 'Home Test',
      about: 'About Test',
      contactAddress: 'Contact Address Test',
      location: 'Test Location 123',
      webPolicies: 'Policies Test'
    };

    render(
      <MemoryRouter>
        <Footer t={mockT} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Important Links')).toBeInTheDocument();
    expect(screen.getByText('Contact Address Test')).toBeInTheDocument();
    expect(screen.getByText('Test Location 123')).toBeInTheDocument();
    expect(screen.getByText('Policies Test')).toBeInTheDocument();
    expect(screen.getByText('Home Test')).toBeInTheDocument();
    expect(screen.getAllByText('sunshineiti8@gmail.com').length).toBeGreaterThan(0);
  });
});
