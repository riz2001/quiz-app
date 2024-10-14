import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CSubmissiondetails = () => {
  const { week } = useParams(); // Get the week number from the URL
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        console.log(`Fetching submissions for week: ${week}`);
        const response = await axios.get(`http://localhost:5050/api/compilerSubmissions/week/${week}`);
        console.log("Fetched Submissions:", response.data); // Debug to check response
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
    return <div className="no-submissions">No submissions available for this week.</div>;
  }

  console.log('Rendering Submissions:', submissions); // Check if submissions are properly set

  return (
    <div style={styles.submissionsContainer}>
      <h2 style={styles.title}>Submissions for Week {week}</h2>
      <table style={styles.submissionsTable}>
        <thead>
          <tr>
            <th style={styles.th}>User</th>
            <th style={styles.th}>Admission No</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Score</th>
            <th style={styles.th}>Submission Time</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission._id} style={styles.tr}>
              <td style={styles.td}>{submission.name || 'Unknown User'}</td>
              <td style={styles.td}>{submission.admissionno || 'N/A'}</td>
              <td style={styles.td}>{submission.email || 'N/A'}</td>
              <td style={styles.td}>{`${submission.passedCount} / ${submission.totalTestCases}`}</td>
              <td style={styles.td}>{new Date(submission.submissionTime).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styles directly in the component for single-file use
const styles = {
  submissionsContainer: {
    maxWidth: '90%',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    color: '#4CAF50',
    marginBottom: '20px',
  },
  noSubmissions: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#FF5722',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: '1.2rem',
    margin: '20px 0',
  },
  submissionsTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#4CAF50',
    color: 'white',
    textTransform: 'uppercase',
  },
  td: {
    padding: '12px',
    textAlign: 'left',
    fontSize: '1rem',
    color: '#333',
  },
  tr: {
    backgroundColor: 'white',
    borderBottom: '1px solid #ddd',
    transition: 'background-color 0.2s ease',
  },
  trEven: {
    backgroundColor: '#f2f2f2',
  },
  trHover: {
    ':hover': {
      backgroundColor: '#e9f7e9',
    },
  },
};

export default CSubmissiondetails;
