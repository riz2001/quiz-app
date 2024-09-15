import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Admin from './components/Admin';
import Quiz from './components/Quiz';
import MainPage from './components/MainPage';

import Login from './components/Login';
import Reg from './components/Reg';


function App() {
  return (
    <Router>
      <div>
        <nav>
       
        </nav>

        <Routes>
        <Route path="Mainpage" element={<MainPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/week/:week" element={<Quiz/>} />


          <Route path="reg" element={<Reg/>} />
          <Route path="/" element={<Login/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
