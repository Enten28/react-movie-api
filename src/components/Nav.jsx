import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/fes-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const Nav = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const query = searchTerm.trim();

    if (!query) return;

    navigate(`/?search=${encodeURIComponent(query)}`);
    setSearchTerm('');
  };

  return (
    <nav className="nav">
      <div className="logo">
        <img className="logo__img" src={logo} alt="" />

        <h1 className="logo__title">
          <Link to="/" style={{ color: 'white' }}>
            Simplified <span>Flix</span>
          </Link>
        </h1>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-form__group">
          <input
            className="search-form__input"
            type="text"
            placeholder="Search movies..."
            aria-label="Search movies"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            className="search-form__button"
            type="submit"
            aria-label="Search"
          >
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="search-form__icon"
            />
          </button>
        </div>
      </form>
    </nav>
  );
};

export default Nav;