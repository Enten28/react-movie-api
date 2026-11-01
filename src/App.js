import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import Nav from './components/Nav';
import Home from './pages/Home';
import MovieDetails from './ui/MovieDetails';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
