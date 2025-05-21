import { useEffect, useState } from "react";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import RentalCard from "./RentalCard";

const RentalList = ({ currentUser }) => {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    const fetchRentals = async () => {
      if (!currentUser) return;
      const rentalsRef = query(
        collection(db, "rentals"),
        where("userId", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(rentalsRef);
      const fetchedRentals = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRentals(fetchedRentals);
    };

    fetchRentals();
  }, [currentUser]);

  const handleCancel = async (id) => {
    await deleteDoc(doc(db, "rentals", id));
    setRentals((prev) => prev.filter((rental) => rental.id !== id));
  };

  return (
    <div className="rental-list">
      {rentals.map((rental) => (
        <RentalCard
          key={rental.id}
          rental={rental}
          onCancel={() => handleCancel(rental.id)}
        />
      ))}
    </div>
  );
};

export default RentalList;