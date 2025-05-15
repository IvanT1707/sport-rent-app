// src/components/RentalCard.jsx
const RentalCard = ({ rental, onCancel }) => {
  const endDate = new Date(rental.endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isActive = endDate >= today;

  return (
    <div className="rental">
      <h3>{rental.name}</h3>
      <p>Ціна: {rental.price} грн/день</p>
      <p>Початок: {rental.startDate}</p>
      <p>Закінчення: {rental.endDate}</p>
      <p className={`status ${isActive ? 'active-status' : 'past-status'}`}>
        {isActive ? 'Активна' : 'Завершена'}
      </p>
      <button className="cancel-button" onClick={onCancel}>Скасувати</button>
    </div>
  );
};

export default RentalCard;
