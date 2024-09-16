import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Admin from './components/Admin';
import Quiz from './components/Quiz';
import MainPage from './components/MainPage';

import Login from './components/Login';
import Reg from './components/Reg';
import Weekslist from './components/Weeklist';
import WeekSubmissions from './components/WeekSubmissions';


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


          <Route path="/weeklist" element={<Weekslist />} />
          <Route path="/submissions/:week" element={<WeekSubmissions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
