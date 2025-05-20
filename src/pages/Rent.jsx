import { useEffect, useState } from 'react';
import EquipmentCard from '../components/EquipmentCard';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Rent = () => {
  const initialEquipmentList = [
    {
      id: 1,
      name: "Гірський велосипед",
      price: 200,
      detail: "Крутий велосипед, проїздив на ньому більше 100 км без проблем",
      image: "./images/bike.png",
      stock: 5,
      category: "bike",
    },
    {
      id: 2,
      name: "Тенісний набір",
      price: 100,
      detail: "Крута ракетка, вигравав з нею в любому турнірі",
      image: "./images/tennis.png",
      stock: 3,
      category: "other",
    },
    {
      id: 3,
      name: "Каяк",
      price: 300,
      detail: "Крутий кайак, проплив на ньому по амазонці без проблем",
      image: "./images/kayak.png",
      stock: 2,
      category: "other",
    },
    {
      id: 4,
      name: "Ролики",
      price: 150,
      detail: "Круті ролики, проїздив на них більше 100 км без проблем",
      image: "./images/skates.png",
      stock: 4,
      category: "skate",
    }
  ];

  const [equipmentList, setEquipmentList] = useState([]);
  const [stock, setStock] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedStock = JSON.parse(localStorage.getItem('equipmentStock') || '{}');
    const updatedList = initialEquipmentList.map(item => ({
      ...item,
      stock: savedStock[item.id] ?? item.stock
    }));
    setEquipmentList(updatedList);
  }, []);

  const saveStock = (newStock) => {
    localStorage.setItem('equipmentStock', JSON.stringify(newStock));
    setStock(newStock);
  };

  const handleRent = (id, startDate, endDate, quantity) => {
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
        < input type="text" 
          class="search-input" 
          placeholder="Пошук за назвою"
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select className="category-select"
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
