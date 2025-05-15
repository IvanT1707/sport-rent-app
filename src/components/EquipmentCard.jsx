import { useState } from 'react';

const EquipmentCard = ({ item, onRent }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isRented, setIsRented] = useState(false);
  const [error, setError] = useState('');

  const handleRent = () => {
    if (!startDate || !endDate) {
      setError('Будь ласка, виберіть дату початку та завершення оренди');
      return;
    }

    setError('');
    onRent(item.id, startDate, endDate);
    setIsRented(true);
    setStartDate('');
    setEndDate('');

    setTimeout(() => setIsRented(false), 3000);
  };

  return (
    <div className="item">
      <img src={item.image} alt={item.name} />
      <h3>{item.name}</h3>
      <p>Ціна: {item.price} грн/день</p>
      <p>В наявності: {item.stock}</p>

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

      <div className="detail">
        Деталі
        <span className="detail-text"> {item.detail}</span>
      </div>

      {error && <p className="error-message">{error}</p>}

      <button
        className={`rent-button ${isRented ? 'rented' : ''}`}
        onClick={handleRent}
        disabled={item.stock === 0}
      >
        {isRented ? 'Орендовано!' : 'Орендувати'}
      </button>
    </div>
  );
};

export default EquipmentCard;
