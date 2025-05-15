import Header from '../components/Header';
import Footer from '../components/Footer';

function Home() {
  return (
    <>
      <Header />
      <main role="main">
        <section className="hero-section" aria-labelledby="hero-title">
          <h1 id="hero-title" className="hero">Оренда спортивного обладнання легко та швидко!</h1>
          <h2 className="desc">Обирайте найкраще спорядження для будь-яких втіх</h2>
          <a href="./rent">
            <button className="hero-button" aria-label="Переглянути доступне спортивне обладнання">
              Орендуй зараз!
            </button>
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Home;