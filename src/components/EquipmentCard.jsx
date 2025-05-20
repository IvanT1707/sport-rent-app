import { useState } from 'react';

const EquipmentCard = ({ item, onRent }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isRented, setIsRented] = useState(false);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleRent = () => {
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

    setError('');
    onRent(item.id, startDate, endDate, quantity);
    setIsRented(true);
    setStartDate('');
    setEndDate('');
    setQuantity(1);

    setTimeout(() => setIsRented(false), 1000);
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
