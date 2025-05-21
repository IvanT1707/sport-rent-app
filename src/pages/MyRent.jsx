import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RentalCard from '../components/RentalCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
 import { doc, deleteDoc } from 'firebase/firestore'; 

const MyRent = () => {
  const [cart, setCart] = useState([]);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        if (!checkedAuth) {
          alert('Будь ласка, увійдіть у систему');
          navigate('/login');
        }
      } else {
        setCheckedAuth(true);
      }
    });

    return () => unsubscribe();
  }, [checkedAuth, navigate]);

  useEffect(() => {
  const fetchRentals = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'rentals'), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);

    const rentals = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setCart(rentals);
  } catch (err) {
    console.error('Помилка завантаження оренд з Firestore:', err);
  }
};


  if (checkedAuth) {
    fetchRentals();
  }
}, [checkedAuth]);


const cancelRental = async (index) => {
  const rentalToDelete = cart[index];

  const confirmDelete = window.confirm('Ви впевнені, що хочете скасувати оренду?');
  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, 'rentals', rentalToDelete.id));

    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);

    alert('Оренду скасовано');
  } catch (error) {
    console.error('Помилка при скасуванні оренди:', error);
    alert('Не вдалося скасувати оренду');
  }
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
          {cart.length === 0 ? (
            <p style={{ textAlign: 'center' }}>Наразі немає активних оренд.</p>
          ) : (
            cart.map((rental, index) => (
              <RentalCard
                key={index}
                rental={rental}
                onCancel={() => cancelRental(index)}
              />
            ))
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MyRent;