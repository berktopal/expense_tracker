import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();

  useEffect(() => {
    axios.get('/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <nav
      style={{
        padding: '1rem',
        borderBottom: `1px solid ${dark ? '#444' : '#ddd'}`,
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: dark ? '#2b2b2b' : '#f9f9f9',
        color: dark ? '#f1f1f1' : '#2b2d42',
        borderRadius: '8px'
      }}
    >
      <div>
        <span style={{ marginRight: '1rem', fontWeight: 'bold' }}>💰 Harcama Takip</span>
        {user && (
          <span style={{ marginRight: '1rem' }}>👤 {user.username}</span>
        )}
      </div>

      <div>
        <button
          onClick={toggleTheme}
          style={{
            marginRight: '10px',
            padding: '6px 12px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: dark ? '#444' : '#e0e0e0',
            color: dark ? '#fff' : '#333',
            cursor: 'pointer'
          }}
        >
          {dark ? '🌞 Aydınlık Mod' : '🌙 Karanlık Mod'}
        </button>

        {user && (
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: '5px',
              backgroundColor: '#e74c3c',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            Çıkış Yap
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
