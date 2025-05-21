const express = require('express');
const path = require('path');
const db = require('./firebase-admin');

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/rentals', async (req, res) => {
  const { userId, price } = req.query;
  try {
    const snapshot = await db.collection('rentals').get();
    let rentals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (userId) {
      rentals = rentals.filter(r => r.userId === userId);
    }
    if (price) {
      rentals = rentals.filter(r => r.price >= parseFloat(price));
    }

    res.status(200).json(rentals);
  } catch (err) {
    console.error('Помилка отримання оренд:', err);
    res.status(500).json({ error: 'Не вдалося отримати оренди' });
  }
});

app.post('/api/rentals', async (req, res) => {
  const { userId, equipmentId, startDate, endDate, quantity, price } = req.body;

  if (!userId || !equipmentId || !startDate || !endDate || !price) {
    return res.status(400).json({ error: 'Відсутні необхідні поля' });
  }

  try {
    const rentalRef = db.collection('rentals').doc();
    await rentalRef.set({
      userId,
      equipmentId,
      startDate,
      endDate,
      quantity,
      price,
      createdAt: new Date().toISOString()
    });

    res.status(200).json({ message: 'Оренду збережено', id: rentalRef.id });
  } catch (err) {
    console.error('Помилка збереження оренди:', err);
    res.status(500).json({ error: 'Не вдалося зберегти оренду' });
  }
});

app.delete('/api/rentals/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('rentals').doc(id).delete();
    res.status(200).json({ message: 'Оренду скасовано' });
  } catch (err) {
    console.error('Помилка видалення оренди:', err);
    res.status(500).json({ error: 'Не вдалося скасувати оренду' });
  }
});

// Додатковий маршрут для оновлення кількості товару (приклад)
app.put('/api/equipment/:id', async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;
  try {
    const equipmentRef = db.collection('equipment').doc(id);
    await equipmentRef.update({ stock });
    res.status(200).json({ message: 'Кількість оновлено' });
  } catch (err) {
    console.error('Помилка оновлення кількості:', err);
    res.status(500).json({ error: 'Не вдалося оновити кількість' });
  }
});

app.get('/api/equipment', async (req, res) => {
  try {
    const snapshot = await db.collection('equipment').get();
    const equipment = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(equipment);
  } catch (err) {
    console.error('Помилка отримання обладнання:', err);
    res.status(500).json({ error: 'Не вдалося отримати обладнання' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});