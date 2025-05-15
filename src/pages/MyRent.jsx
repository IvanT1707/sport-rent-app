import { useEffect, useState } from 'react';
import RentalCard from '../components/RentalCard';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MyRent = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
  }, []);

  const cancelRental = (index) => {
  const item = cart[index];
  const updatedCart = [...cart];
  updatedCart.splice(index, 1);
  setCart(updatedCart);
  localStorage.setItem('cart', JSON.stringify(updatedCart));

  const savedStock = JSON.parse(localStorage.getItem('equipmentStock') || '{}');
  savedStock[item.id] = (savedStock[item.id] || 0) + (item.quantity || 1);
  localStorage.setItem('equipmentStock', JSON.stringify(savedStock));
};


  return (
<>
  <Header />
    <main className='my-rent'>
      <section style={{ textAlign: 'center' }}>
        <h1 className="hero">Мої оренди</h1>
        <p>Перегляньте список активних та минулих оренд</p>
      </section>
      <div className="rent-list">
        {cart.map((rental, index) => (
          <RentalCard
            key={index}
            rental={rental}
            onCancel={() => cancelRental(index)}
          />
        ))}
      </div>
    </main>
    <Footer />
</>
  );
};

export default MyRent;
