import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Qusers = () => {
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState(null);
  const userId = sessionStorage.getItem("userId"); // Retrieve userId from sessionStorage

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`http://localhost:5050/api/submissionsss`, {
        headers: {
          'User-ID': userId, // Add userId to headers
        }
      });

      if (response.data.status === "success") {
        setSubmissions(response.data.submissions);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setError("An error occurred while fetching submissions.");
    }
  };

  useEffect(() => {
    fetchSubmissions(); // Call the fetch function when the component mounts
  }, []);

  return (
    <div>
      <h1>User Submissions</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {submissions.map((submission) => (
          <li key={submission._id}>
            Week: {submission.week}, Score: {submission.score}, Submission Time: {new Date(submission.submissionTime).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Qusers;
