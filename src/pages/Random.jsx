const Random = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-deepest)',
      padding: '1.5rem',
      textAlign: 'center',
    }}>
      <div
        style={{
          fontSize: 'clamp(5rem, 25vw, 14rem)',
          lineHeight: 1,
          marginBottom: '1.5rem',
          animation: 'wiggle 1.2s ease-in-out infinite',
          display: 'inline-block',
          filter: 'drop-shadow(0 0 40px rgba(59,130,246,0.35))',
          userSelect: 'none',
        }}
      >
        🐒
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-main)',
          fontSize: 'clamp(2rem, 8vw, 5rem)',
          fontWeight: 800,
          background: 'var(--gradient-text)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          userSelect: 'none',
        }}
      >
        alip anj 🐒
      </h1>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-8deg) scale(1); }
          25%       { transform: rotate(8deg) scale(1.08); }
          50%       { transform: rotate(-5deg) scale(1.04); }
          75%       { transform: rotate(6deg) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default Random;
