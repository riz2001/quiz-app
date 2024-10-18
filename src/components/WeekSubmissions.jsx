import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const WeekSubmissions = () => {
  const { week } = useParams(); // Get the week number from the URL
  const [submissions, setSubmissions] = useState([]);
  const [nonSubmittedUsers, setNonSubmittedUsers] = useState([]);
  const [error, setError] = useState(null);
  const [courseYear, setCourseYear] = useState(''); // Default to empty string (no filter)
  const [searchTerm, setSearchTerm] = useState(''); // State to hold search input
  const [availableCourseYears, setAvailableCourseYears] = useState([
    'First Year A Batch',
    'First Year B Batch',
    'Second Year A Batch',
    'Second Year B Batch',
  ]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        // Fetch submissions based on the selected course year (or all if no course year is selected)
        const response = await axios.get(
          `http://localhost:5050/api/submissions-and-non-submissions/${week}?courseYear=${courseYear}`
        );
        const { submissions, nonSubmittedUsers } = response.data;
        setSubmissions(submissions);
        setNonSubmittedUsers(nonSubmittedUsers);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setError('Error fetching submissions');
      }
    };

    // Fetch data (default is all course years if none selected)
    fetchSubmissions();
  }, [week, courseYear]); // Trigger fetching when the week or courseYear changes

  // Filter submissions based on search term
  const filteredSubmissions = submissions.filter(submission => {
    const user = submission.userId || {};
    return (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.admissionno?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Filter non-submitted users based on search term
  const filteredNonSubmittedUsers = nonSubmittedUsers.filter(user => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.admissionno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="submissions-container">
      <h2 className="title">Submissions for Week {week}</h2>

      {/* Dropdown for Course Year Selection */}
      <label htmlFor="courseYear">Select Course Year:</label>
      <select
        id="courseYear"
        value={courseYear}
        onChange={(e) => setCourseYear(e.target.value)}
      >
        <option value="">All Course Years</option> {/* Default to all */}
        {availableCourseYears.map((year, index) => (
          <option key={index} value={year}>
            {year}
          </option>
        ))}
      </select>

      {/* Search Input */}
      <label htmlFor="searchTerm">Search:</label>
      <input
        id="searchTerm"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter name, admission no, or email"
      />

      {/* Users Who Submitted */}
      <h3>Users Who Submitted</h3>
      {filteredSubmissions.length ? (
        <table className="submissions-table">
          <thead>
            <tr>
              <th>USER</th>
              <th>ADMISSION NO</th>
              <th>ROLL NO</th>
              <th>COURSE YEAR</th>
              <th>EMAIL</th>
              <th>SCORE</th>
              <th>SUBMISSION TIME</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((submission) => (
              <tr key={submission._id}>
                <td>{submission.userId ? submission.userId.name : 'Unknown User'}</td>
                <td>{submission.userId ? submission.userId.admissionno : 'N/A'}</td>
                <td>{submission.userId ? submission.userId.rollno : 'N/A'}</td>
                <td>{submission.userId ? submission.userId.courseYear : 'N/A'}</td>
                <td>{submission.userId ? submission.userId.email : 'N/A'}</td>
                <td>{submission.score}</td>
                <td>{new Date(submission.submissionTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No submissions available for this week.</p>
      )}

      {/* Users Who Did Not Submit */}
      <h3>Users Who Did Not Submit</h3>
      {filteredNonSubmittedUsers.length ? (
        <table className="submissions-table">
          <thead>
            <tr>
              <th>USER</th>
              <th>ADMISSION NO</th>
              <th>ROLL NO</th>
              <th>COURSE YEAR</th>
              <th>EMAIL</th>
            </tr>
          </thead>
          <tbody>
            {filteredNonSubmittedUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.admissionno}</td>
                <td>{user.rollno}</td>
                <td>{user.courseYear}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>All users have submitted the quiz.</p>
      )}

      {/* Inline CSS */}
      <style jsx>{`
        .submissions-container {
          width: 80%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff; /* White background for the content area */
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .title {
          font-size: 24px;
          color: #333;
          margin-bottom: 20px;
          text-align: center;
        }

        .submissions-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        .submissions-table th,
        .submissions-table td {
          padding: 12px;
          text-align: left;
          border: 1px solid #ddd;
        }

        .submissions-table th {
          background-color: #007bff;
          color: #ffffff;
          font-size: 18px;
        }

        .submissions-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        .submissions-table tr:hover {
          background-color: #f1f1f1;
        }

        .submissions-table td {
          font-size: 14px;
        }

        .error {
          text-align: center;
          font-size: 18px;
          color: #ff0000;
        }
      `}</style>
    </div>
  );
};

export default WeekSubmissions;
