import { HashRouter as Router, Routes, Route, } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import MovieDetails from './ui/MovieDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/movie/:id"
            element={<MovieDetails />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;