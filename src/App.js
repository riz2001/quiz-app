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
import Compiler from './components/Compiler';
import Cweeks from './components/Cweeks';
import Codingq from './components/Codingq';
import AllWeeksCompilerSubmission from './components/WeekCompilers';
import WeeksCompilers from './components/WeekCompilers';

import WeekCompilers from './components/WeekCompilers';
import CsubmissionDetails from './components/Csubmissiondetails';
import Approve from './components/Approve';
import Qusers from './components/Qusers';
import Ucompilers from './components/Ucompilers';






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
          <Route path="/approve" element={<Approve/>} />


          <Route path="/weeklist" element={<Weekslist />} />
          <Route path="/submissions/:week" element={<WeekSubmissions />} />


          
          <Route path="/formpage" element={<FormPage />} />
          <Route path="/submissionpage" element={<SubmissionPage/>} />
          <Route path="/Qusers" element={<Qusers/>} />

          <Route path="/userlist" element={<UsersList />} />
          <Route path="/user/timeslots" element={<Usertimeslots />} />

          <Route path="/monthpage" element={<MonthPage />} />

        


      
          <Route path="/Cweeks" element={<Cweeks />} />
          <Route path="/Codingq" element={<Codingq />} />
          <Route path="/compiler/:week" element={<Compiler />} />


          <Route path="/submissionweeks" element={<WeekCompilers/>} />
          <Route path="/submissions/week/:week" element={<CsubmissionDetails/>} />
          <Route path="/Ucompilers" element={<Ucompilers/>} />






       



        </Routes>
      </div>
    </Router>
  );
}

export default App;
