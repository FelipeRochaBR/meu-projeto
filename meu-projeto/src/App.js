import React, { useState, useEffect } from 'react';
import './App.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import logoipsum from './Figma/logoipsum.png';
import redessociais from './Figma/redessociais.png';
import reta from './Figma/reta.png';
import logoipsum2 from './Figma/logoipsum2.png';
import axios from 'axios';

function Navbar() {
  return (
    <div className="navbar">
      <div>
        <img src={logoipsum} className="ipsum1" alt="Logo" />
      </div>
      <div className="navbar-links">
        <a href="#home">Lista de Favoritos</a>
        <a href="#contact">Contato</a>
      </div>
    </div>
  );
}

const Carousel = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('https://movies.slideworks.cc/movies')
      .then((response) => {
        if (response?.data?.data) {
          setMovies(response.data.data);
        } else {
          setError('Erro ao carregar filmes.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar o carrossel:', err);
        setError('Erro ao carregar filmes.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Carregando carrossel...</div>;
  if (error) return <div>{error}</div>;

  const settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
  };
  
  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {movies.map((movie, index) => (
          <div key={index} className="carousel-item">
            <img
              src={movie.image_url || 'https://via.placeholder.com/1440x577'}
            />
            <div className="carousel-caption">
              <p><strong>Destaque do mês</strong></p>
              <h1><strong>{movie.title}</strong></h1>
              <h3 className="info">
                <span className="rating-box">{movie.rating}/10</span> {movie.crew}
              </h3>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );  
};

const Frame = () => {
  const [movies, setMovies] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(12);

  useEffect(() => {
    axios.get('https://movies.slideworks.cc/movies')
      .then(response => {
        console.log('Resposta da API:', response); 
        if (response && response.data && response.data.data) {
          setMovies(response.data.data);
          setPagination(response.data.pagination);
        } else {
          console.error('Formato inesperado da resposta', response);
          setError('Erro ao carregar filmes.');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao carregar os filmes', error);
        setError('Erro ao carregar filmes.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (movies.length === 0) {
    return <div>Nenhum filme encontrado.</div>;
  }

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="frame">
      <div className="cards-container">
        {currentMovies.map((movie, index) => (
          <div key={index} className="card">
            <img src={movie.image_url || 'https://via.placeholder.com/150'} alt={movie.title} />
            <h3><strong>{movie.title}</strong></h3>
            <p>Ano de lançamento:{movie.year}</p>
            <p>{movie.crew}</p>
            <p>{movie.rating}/10</p>
          </div>
        ))}
      </div>

      <div className="pagination">
  <button 
    onClick={() => paginate(currentPage - 1)} 
    disabled={currentPage === 1}
    className="pagination-arrow.prev"
  >
    &lt;
  </button>
  {[...Array(Math.ceil(movies.length / moviesPerPage))].map((_, index) => (
    <button 
      key={index + 1} 
      onClick={() => paginate(index + 1)} 
      className={currentPage === index + 1 ? 'active' : ''}
    >
      {index + 1}
    </button>
  ))}
  <button 
    onClick={() => paginate(currentPage + 1)} 
    disabled={currentPage === Math.ceil(movies.length / moviesPerPage)}
    className="pagination-arrow.next"
  >
    &gt;
  </button>
</div>
    </div>
  );
};

const Pagination = () => {
  return null;
};

const Footer = () => {
  return (
    <footer className="footer">
      <img src={logoipsum2} className="ipsum2" alt="Ipsum2" />
      <img src={reta} className="reta" alt="Reta" />
      <div className="teste">
        <div className="terms-container">
          <p><a href="/terms">Terms & Conditions</a></p>
          <p><a href="/privacy-policy">Privacy Policy</a></p>
        </div>
        <img src={redessociais} className="social" alt="Redes sociais" />
      </div>
    </footer>
  );
};

function App() {
  return (
    <div className="App">
      <Navbar />  
      <Carousel />  
      <Frame />   
      <Footer /> 
    </div>
  );
}

export default App;
