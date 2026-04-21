import { useState } from 'react';
import axios from '../api/axios';

const TransactionItem = ({ transaction, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(transaction.title);
  const [amount, setAmount] = useState(transaction.amount);
  const [date, setDate] = useState(transaction.date);

  const handleSave = async () => {
    try {
      const res = await axios.put(`/transactions/${transaction.id}`, { title, amount, date });
      onUpdate(res.data);
      setIsEditing(false);
    } catch {
      alert('Güncellerken hata oluştu.');
    }
  };

  const handleDeleteClick = async () => {
    if (window.confirm('Silmek istediğine emin misin?')) {
      try {
        await axios.delete(`/transactions/${transaction.id}`);
        onDelete(transaction.id);
      } catch {
        alert('Silme işlemi başarısız.');
      }
    }
  };

  return (
    <li style={{ marginBottom: 8, borderBottom: '1px solid #ccc', paddingBottom: 8 }}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <button onClick={handleSave} style={{ marginRight: 8 }}>Kaydet</button>
          <button onClick={() => setIsEditing(false)}>İptal</button>
        </>
      ) : (
        <>
          <span>{transaction.title} - {transaction.amount}₺ - {transaction.date}</span>
          <button onClick={() => setIsEditing(true)} style={{ marginLeft: 8 }}>Düzenle</button>
          <button onClick={handleDeleteClick} style={{ marginLeft: 8 }}>Sil</button>
        </>
      )}
    </li>
  );
};

export default TransactionItem;
