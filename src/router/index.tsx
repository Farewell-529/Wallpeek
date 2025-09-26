import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Detail from '../pages/[id]';
import Nav from '../components/Nav';
import Search from '../pages/Search';

const Router = () => {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:source/:id" element={<Detail />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;