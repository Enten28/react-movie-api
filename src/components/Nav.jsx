import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from "../assets/fes-logo.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const Nav = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Search submitted:', searchTerm); 
    
    if (searchTerm.trim()) {
      const encodedSearch = encodeURIComponent(searchTerm);
      console.log('Navigating to:', `/?search=${encodedSearch}`);
      navigate(`/?search=${encodedSearch}`);
      setSearchTerm('');
    }
  };

  return (
    <nav className="nav">
      <div className="logo">
        <img className="logo__img" src={logo} alt="" />
        <h1>
          <a href="/" style={{ color: 'white', textDecoration: 'none' }}>
            Simplified <span>Flix</span>
          </a>
        </h1>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-form__group">
          <input 
            className="search-form__input"
            type="text"
            placeholder="Search movies..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-form__button" type="submit">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-form__icon" />
          </button>
        </div>
      </form>
    </nav>
  )
}

export default Nav;