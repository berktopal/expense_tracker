import { useState } from 'react';
import axios from '../api/axios';

const AddTransactionForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !amount || !date) return alert('Tüm alanları doldurun.');

    try {
      const res = await axios.post('/transactions', { title, amount, date });
      onAdd(res.data);
      setTitle('');
      setAmount('');
      setDate('');
    } catch (err) {
      alert('Harcamayı eklerken hata oluştu.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Başlık"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ marginRight: 8 }}
      />
      <input
        type="number"
        placeholder="Tutar"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        style={{ marginRight: 8 }}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        style={{ marginRight: 8 }}
      />
      <button type="submit">Ekle</button>
    </form>
  );
};

export default AddTransactionForm;
