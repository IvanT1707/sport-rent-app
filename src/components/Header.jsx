import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <div className="logo">
        <img src="/images/SPORT.png" alt="Логотип сервісу оренди спорядження" className="logo-img" />
      </div>
      <nav>
        <ul>
          <li><Link to="/">Головна</Link></li>
          <li><Link to="/rent">Обладнання</Link></li>
          <li><Link to="/myrent">Мої оренди</Link></li>
          <li><Link to="/payment">Оплата</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;