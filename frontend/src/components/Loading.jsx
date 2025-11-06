const Loading = ({ message = "Loading..." }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    color: '#7c9a6d',
    fontSize: '1.1rem'
  }}>
    <div style={{
      width: '20px',
      height: '20px',
      border: '2px solid #e9e4d5',
      borderTop: '2px solid #7c9a6d',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '0.5rem'
    }}></div>
    {message}
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default Loading;