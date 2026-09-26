import React, { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Anwendungsfehler gefangen:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#08090d',
          color: '#e2e4eb',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
        }}>
          <h1 style={{ color: '#d4af37', fontSize: '1.75rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
            Sol & Ilay Photography
          </h1>
          <p style={{ maxWidth: '500px', color: '#9ca3af', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Beim Laden der Seite ist ein unerwarteter Fehler aufgetreten:
          </p>
          <pre style={{
            background: '#11131a',
            padding: '1rem',
            borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#f87171',
            fontSize: '0.85rem',
            maxWidth: '90%',
            overflowX: 'auto',
            marginBottom: '1.5rem',
          }}>
            {this.state.error?.message || 'Unbekannter Fehler'}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#d4af37',
              color: '#08090d',
              border: 'none',
              padding: '0.75rem 1.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              borderRadius: '2px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Seite neu laden
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
);
