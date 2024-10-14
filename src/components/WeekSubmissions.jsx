import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const WeekSubmissions = () => {
  const { week } = useParams(); // Get the week number from the URL
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/api/submissions/${week}`);
        setSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setError('Error fetching submissions');
      }
    };

    fetchSubmissions();
  }, [week]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!submissions.length) {
    return <div>No submissions available for this week.</div>;
  }

  return (
    <div className="submissions-container">
      <h2 className="title">Submissions for Week {week}</h2>
      <table className="submissions-table">
        <thead>
          <tr>
            <th>USER</th>
            <th>ADMISSION NO</th>
            <th>EMAIL</th>
            <th>SCORE</th>
            <th>Submission Time</th>
            <th>Answers</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission._id}>
              <td>{submission.userId ? submission.userId.name : 'Unknown User'}</td> {/* Check for null */}
              <td>{submission.userId ? submission.userId.admissionno : 'N/A'}</td> {/* Check for null */}
              <td>{submission.userId ? submission.userId.email : 'N/A'}</td> {/* Check for null */}
              <td>{submission.score}</td>
              <td>{new Date(submission.submissionTime).toLocaleString()}</td>
              <td>
                {submission.answers.map((answer, index) => (
                  <div key={index}>
                    Q{index + 1}: {answer.answer}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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