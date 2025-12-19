'use client';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: '#9ca3af' }}>
        Page not found
      </p>
      <a
        href="/"
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: '500',
        }}
      >
        Go back home
      </a>
    </div>
  );
}

