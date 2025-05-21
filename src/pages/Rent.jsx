import { useEffect, useState } from 'react';
import EquipmentCard from '../components/EquipmentCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Rent = () => {
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [equipmentList, setEquipmentList] = useState([]);
  const [stock, setStock] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
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
  }, [checkedAuth]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const savedStock = JSON.parse(localStorage.getItem('equipmentStock') || '{}');
        const querySnapshot = await getDocs(collection(db, 'equipment'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          stock: savedStock[doc.id] ?? doc.data().stock
        }));
        setEquipmentList(data);
      } catch (err) {
        console.error('Помилка завантаження обладнання:', err);
      }
    };

    if (checkedAuth) {
      fetchEquipment();
    }
  }, [checkedAuth]);

  const saveStock = (newStock) => {
    localStorage.setItem('equipmentStock', JSON.stringify(newStock));
    setStock(newStock);
  };

const handleRent = async (id, startDate, endDate, quantity) => {
  const item = equipmentList.find(eq => eq.id === id);
  if (!item || item.stock < quantity) return;

  const updatedList = equipmentList.map(eq =>
    eq.id === id ? { ...eq, stock: eq.stock - quantity } : eq
  );
  const updatedStock = { ...stock, [id]: (stock[id] ?? item.stock) - quantity };

  setEquipmentList(updatedList);
  saveStock(updatedStock);

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.push({ ...item, startDate, endDate, quantity });
  localStorage.setItem('cart', JSON.stringify(cart));

  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("Користувач не автентифікований");
      return;
    }

    const rental = {
      userId: user.uid,
      name: item.name,
      price: item.price,
      startDate,
      endDate,
      quantity,
    };

    await addDoc(collection(db, 'rentals'), rental);
    console.log("Оренду збережено в Firestore");
  } catch (error) {
    console.error("Помилка при збереженні оренди:", error);
  }
};


  const filteredList = equipmentList.filter(item => {
    const matchCategory = selectedCategory === '' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <>
      <Header />
      <main className="my-rent">
        <section className="filters" style={{ padding: '1rem' }}>
          <input
            type="text"
            className="search-input"
            placeholder="Пошук за назвою"
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            className="category-select"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="">Усі категорії</option>
            <option value="bike">Велосипеди</option>
            <option value="skate">Ролики</option>
            <option value="other">Інше</option>
          </select>
        </section>

        <section className="equipment">
          <h1>Доступне обладнання</h1>
          <div className="equipment-grid">
            {filteredList.length === 0 ? (
              <p>Немає обладнання за вибраними параметрами.</p>
            ) : (
              filteredList.map(item => (
                <EquipmentCard key={item.id} item={item} onRent={handleRent} />
              ))
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Rent;