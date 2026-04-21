import { useEffect, useState } from 'react'
import axios from '../api/axios'
import Navbar from '../components/Navbar'
import AddTransactionForm from '../components/AddTransactionForm'
import TransactionItem from '../components/TransactionItem'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '../context/ThemeContext'
import dayjs from 'dayjs'

const Dashboard = () => {
const [transactions, setTransactions] = useState([])
const [me, setMe] = useState(null)
const [total, setTotal] = useState(0)
const [categoryData, setCategoryData] = useState([])
const [filtered, setFiltered] = useState([])
const [filter, setFilter] = useState('all')
const [suggestions, setSuggestions] = useState([])
const { dark } = useTheme()

const monthlyLimit = 150000

useEffect(() => {
axios.get('/me').then(res => setMe(res.data))
axios.get('/transactions').then(res => {
setTransactions(res.data)
})
}, [])

useEffect(() => {
const filteredData = filterTransactions(transactions, filter)
setFiltered(filteredData)
updateSummary(filteredData)
}, [transactions, filter])

const filterTransactions = (list, type) => {
const now = dayjs()
switch (type) {
case 'thisMonth':
return list.filter(t => dayjs(t.date).isSame(now, 'month'))
case 'lastMonth':
return list.filter(t => dayjs(t.date).isSame(now.subtract(1, 'month'), 'month'))
case 'thisWeek':
return list.filter(t => dayjs(t.date).isSame(now, 'week'))
default:
return list
}
}

const updateSummary = (list) => {
const sum = list.reduce((acc, t) => acc + Number(t.amount || 0), 0)
setTotal(sum)


const grouped = list.reduce((acc, t) => {
  const title = t.title.toLowerCase()
  acc[title] = (acc[title] || 0) + Number(t.amount || 0)
  return acc
}, {})

const data = Object.entries(grouped).map(([key, value]) => ({
  name: key,
  value
}))
setCategoryData(data)

const suggestionList = []

data.forEach(item => {
  const ratio = item.value / sum
  if (ratio > 0.4) {
    suggestionList.push(
      `🔍 "${item.name}" kategorisi toplam harcamanın %${(ratio * 100).toFixed(1)}'ini oluşturuyor. Gözden geçirebilirsiniz.`
    )
  }
  if (item.value > 5000) {
    suggestionList.push(`💸 "${item.name}" kategorisinde 5000₺ üzeri harcama yaptınız.`)
  }
})

if (sum === 0) {
  suggestionList.push('🕒 Henüz harcama yapılmadı. Bütçenizi planlamak için iyi bir zaman.')
} else if (sum > 10000) {
  suggestionList.push('⚠️ Toplam harcamanız 10.000₺ üzeri. Aylık harcama limitinizi gözden geçirin.')
}

setSuggestions(suggestionList)
}

const handleAdd = (newTransaction) => {
const newList = [newTransaction, ...transactions]
setTransactions(newList)
}

const handleDelete = (id) => {
const updated = transactions.filter(t => t.id !== id)
setTransactions(updated)
}

const handleUpdate = (updatedTransaction) => {
const updated = transactions.map(t =>
t.id === updatedTransaction.id ? updatedTransaction : t
)
setTransactions(updated)
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00c49f', '#d0ed57']
const background = dark ? '#1e1e1e' : '#eef2f7'
const card = dark ? '#2b2b2b' : '#ffffff'
const text = dark ? '#f1f1f1' : '#2b2d42'

const currentMonthSpending = transactions
.filter(t => dayjs(t.date).isSame(dayjs(), 'month'))
.reduce((acc, t) => acc + Number(t.amount || 0), 0)

const remainingBudget = Math.max(0, monthlyLimit - currentMonthSpending)

return (
<div
className="dashboard-container"
style={{
maxWidth: '950px',
margin: '0 auto',
padding: '30px',
fontFamily: 'Segoe UI, sans-serif',
backgroundColor: background,
borderRadius: '10px',
color: text,
minHeight: '100vh',
display: 'flex',
flexDirection: 'column',
gap: '24px'
}}
>
<Navbar />
<h2>
Merhaba, <span style={{ color: '#1e90ff' }}>{me?.username}</span>
</h2>

  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
    <div style={{
      flex: 1,
      backgroundColor: card,
      borderRadius: '8px',
      padding: '16px',
      boxShadow: dark ? '0 0 8px rgba(255,255,255,0.05)' : '0 2px 6px rgba(0,0,0,0.1)'
    }}>
      <h4>Toplam Harcama</h4>
      <p style={{ fontSize: '20px', color: '#e74c3c', fontWeight: 'bold' }}>
        {Number(total).toFixed(2)}₺
      </p>
    </div>
    <div style={{
      flex: 1,
      backgroundColor: card,
      borderRadius: '8px',
      padding: '16px',
      boxShadow: dark ? '0 0 8px rgba(255,255,255,0.05)' : '0 2px 6px rgba(0,0,0,0.1)'
    }}>
      <h4>Bu Ayki Harcama</h4>
      <p style={{ fontSize: '20px', color: '#3498db', fontWeight: 'bold' }}>
        {Number(currentMonthSpending).toFixed(2)}₺
      </p>
    </div>
    <div style={{
      flex: 1,
      backgroundColor: card,
      borderRadius: '8px',
      padding: '16px',
      boxShadow: dark ? '0 0 8px rgba(255,255,255,0.05)' : '0 2px 6px rgba(0,0,0,0.1)'
    }}>
      <h4>Kalan Limit</h4>
      <p style={{ fontSize: '20px', color: '#27ae60', fontWeight: 'bold' }}>
        {Number(remainingBudget).toFixed(2)}₺
      </p>
    </div>
  </div>

  <AddTransactionForm onAdd={handleAdd} />

  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
    <div style={{
      backgroundColor: card,
      padding: '20px',
      borderRadius: '8px',
      boxShadow: dark ? '0 0 10px rgba(255,255,255,0.05)' : '0 2px 8px rgba(0,0,0,0.05)',
      flex: 1,
      minWidth: '300px'
    }}>
      <h4 style={{ marginBottom: '16px' }}>Kategori Dağılımı</h4>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {categoryData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>

    <div style={{ flex: 1 }}>
      <h4>Tavsiyeler</h4>
      <ul style={{ paddingLeft: '20px' }}>
        {suggestions.map((s, i) => (
          <li key={i} style={{ marginBottom: '6px' }}>{s}</li>
        ))}
      </ul>
    </div>
  </div>

  <div style={{ marginTop: '20px' }}>
    <h4>Filtre</h4>
    <select
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      style={{
        padding: '8px',
        borderRadius: '6px',
        border: `1px solid ${dark ? '#444' : '#ccc'}`,
        backgroundColor: card,
        color: text
      }}
    >
      <option value="all">Tümü</option>
      <option value="thisMonth">Bu Ay</option>
      <option value="lastMonth">Geçen Ay</option>
      <option value="thisWeek">Bu Hafta</option>
    </select>
  </div>

  <div style={{ marginTop: '20px' }}>
    <h4>Harcamalar</h4>
    {filtered.map((t) => (
      <TransactionItem
        key={t.id}
        transaction={t}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    ))}
  </div>
</div>
)
}

export default Dashboard