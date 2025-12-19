'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1rem' }}>500</h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#9ca3af' }}>
        Something went wrong
      </p>
      {error?.message && (
        <p style={{ fontSize: '0.875rem', marginBottom: '2rem', color: '#6b7280' }}>
          {error.message}
        </p>
      )}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={reset}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6b7280',
            color: 'white',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '500',
          }}
        >
          Go back home
        </a>
      </div>
    </div>
  );
}

