import { render, screen } from '@testing-library/react';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import { describe, it, expect } from 'vitest';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(
      <LanguageProvider>
        <App />
      </LanguageProvider>
    );
    // Add an assertion here if needed, or simply verify it renders
    expect(true).toBeTruthy();
  });
});
