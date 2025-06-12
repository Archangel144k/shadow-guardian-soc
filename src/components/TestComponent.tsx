const TestComponent = () => {
  return (
    <div style={{
      padding: '20px',
      border: '2px solid #ef4444',
      borderRadius: '8px',
      background: '#111'
    }}>
      <h2 style={{ color: '#ef4444', margin: 0 }}>TEST COMPONENT WORKING</h2>
      <p style={{ color: '#fff', margin: '10px 0' }}>
        If you see this, React is rendering correctly.
      </p>
      <button 
        style={{
          background: '#ef4444',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={() => alert('Button works!')}
      >
        TEST BUTTON
      </button>
    </div>
  );
};

export default TestComponent;
