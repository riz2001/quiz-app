import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Admin from './components/Admin';
import Quiz from './components/Quiz';
import MainPage from './components/MainPage';

import Login from './components/Login';
import Reg from './components/Reg';
import Weekslist from './components/Weeklist';
import WeekSubmissions from './components/WeekSubmissions';
import FormPage from './components/Formpage';
import SubmissionPage from './components/Submissionpage';
import UsersList from './components/Userlist';
import Usertimeslots from './components/Usertimeslots';
import MonthPage from './components/MonthPage';






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


          
          <Route path="/formpage" element={<FormPage />} />
          <Route path="/submissionpage" element={<SubmissionPage/>} />

          <Route path="/userlist" element={<UsersList />} />
          <Route path="/user/timeslots" element={<Usertimeslots />} />

          <Route path="/monthpage" element={<MonthPage />} />


       



        </Routes>
      </div>
    </Router>
  );
}

export default App;
