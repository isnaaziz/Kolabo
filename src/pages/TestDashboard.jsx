import React from 'react';

const TestDashboard = () => {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f3f4f6',
            padding: '20px',
            fontFamily: 'sans-serif'
        }}>
            <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: '#111827'
            }}>
                🎯 Dashboard Test
            </h1>

            <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                marginBottom: '20px'
            }}>
                <h2 style={{ color: '#059669', marginBottom: '10px' }}>✅ Dashboard Berhasil Dimuat!</h2>
                <p style={{ color: '#6b7280' }}>
                    Jika Anda melihat halaman ini, berarti routing dan rendering React sudah berfungsi dengan baik.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginTop: '20px'
            }}>
                <div style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>Total Tasks</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>127</div>
                </div>

                <div style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>Completed</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>89</div>
                </div>

                <div style={{
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>In Progress</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>31</div>
                </div>

                <div style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>Pending</h3>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>7</div>
                </div>
            </div>

            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                marginTop: '20px'
            }}>
                <h3 style={{ marginBottom: '15px', color: '#111827' }}>🚀 Navigation Links</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {[
                        { name: 'Kanban Board', path: '/kanban-board' },
                        { name: 'Sprint Planning', path: '/sprint-planning' },
                        { name: 'Analytics', path: '/analytics-dashboard' },
                        { name: 'Team Management', path: '/team-management' },
                        { name: 'Task Detail', path: '/task-detail' },
                        { name: 'Login', path: '/login-register' }
                    ].map(link => (
                        <a
                            key={link.path}
                            href={link.path}
                            style={{
                                backgroundColor: '#6366f1',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                textDecoration: 'none',
                                fontSize: '14px',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#6366f1'}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>
            </div>

            <div style={{
                marginTop: '30px',
                padding: '15px',
                backgroundColor: '#fef3c7',
                border: '1px solid #fbbf24',
                borderRadius: '8px'
            }}>
                <p style={{ margin: 0, color: '#92400e' }}>
                    <strong>Debug Info:</strong> Ini adalah versi test sederhana untuk memastikan dashboard bisa dimuat.
                    Komponen utama akan dikembalikan setelah masalah routing diselesaikan.
                </p>
            </div>
        </div>
    );
};

export default TestDashboard;
