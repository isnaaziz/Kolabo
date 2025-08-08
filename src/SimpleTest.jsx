import React from "react";

const SimpleTest = () => {
    return (
        <div style={{
            padding: '40px',
            backgroundColor: '#f0f0f0',
            minHeight: '100vh',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1 style={{
                color: '#333',
                fontSize: '3rem',
                textAlign: 'center',
                marginBottom: '20px'
            }}>
                🚀 SIMPLE TEST
            </h1>

            <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                textAlign: 'center',
                maxWidth: '600px',
                margin: '0 auto'
            }}>
                <h2 style={{ color: 'green', marginBottom: '20px' }}>
                    ✅ React App Berjalan!
                </h2>
                <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#666' }}>
                    Jika Anda melihat halaman ini, berarti:
                </p>
                <ul style={{
                    textAlign: 'left',
                    fontSize: '16px',
                    color: '#555',
                    maxWidth: '400px',
                    margin: '20px auto'
                }}>
                    <li>✓ React berhasil di-render</li>
                    <li>✓ Vite dev server berjalan</li>
                    <li>✓ Bundle JavaScript dimuat</li>
                    <li>✓ DOM manipulation berfungsi</li>
                </ul>

                <div style={{
                    marginTop: '30px',
                    padding: '20px',
                    backgroundColor: '#e3f2fd',
                    borderRadius: '8px',
                    border: '2px solid #2196f3'
                }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#1976d2' }}>
                        Timestamp: {new Date().toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SimpleTest;
