import { useState } from 'react';
import { auth } from '../firebase';

const EquipmentCard = ({ item, onRent }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isRented, setIsRented] = useState(false);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleRent = async () => {
    if (!startDate || !endDate) {
      setError('Будь ласка, виберіть дату початку та завершення оренди');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Дата початку не може бути пізніше за дату завершення');
      return;
    }

    if (quantity > item.stock) {
      setError('Вибрана кількість перевищує наявність');
      return;
    }

    const totalDays =
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
    const totalPrice = item.price * totalDays * quantity;

    try {
      await fetch('/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: auth.currentUser.uid,
          equipmentId: item.id,
          startDate,
          endDate,
          quantity,
          price: totalPrice
        })
      });

      setIsRented(true);
      setStartDate('');
      setEndDate('');
      setQuantity(1);
      setError('');
      setTimeout(() => setIsRented(false), 1000);

      if (onRent) {
        onRent(item.id, startDate, endDate, quantity); // опціонально
      }
    } catch (err) {
      setError('Помилка під час збереження оренди');
    }
  };

  return (
    <div className="item">
      <img src={item.image} alt={item.name} />
      <h3>{item.name}</h3>
      <p>Ціна: {item.price} грн/день</p>
      <p>В наявності: {item.stock === 0 ? '0 (немає в наявності)' : item.stock}</p>

      <div className="date-inputs">
        <input
          type="date"
          className="start-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          className="end-date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>

      <div className="quantity-select">
        <label>Кількість:</label>
        {item.stock === 0 ? (
          <span>0</span>
        ) : (
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          >
            {Array.from({ length: item.stock }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="detail">
        Деталі
        <span className="detail-text"> {item.detail}</span>
      </div>

      <button
        className={`rent-button ${isRented ? 'rented' : ''}`}
        onClick={handleRent}
        disabled={item.stock === 0}
      >
        {item.stock === 0
          ? 'Немає в наявності'
          : isRented
          ? 'Орендовано'
          : 'Орендувати'}
      </button>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default EquipmentCard;