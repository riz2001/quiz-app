import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CSubmissiondetails = () => {
  const { week } = useParams(); // Get the week number from the URL
  const [submissions, setSubmissions] = useState([]);
  const [nonSubmittedUsers, setNonSubmittedUsers] = useState([]);
  const [courseYear, setCourseYear] = useState(''); // State to hold selected course year
  const [searchTerm, setSearchTerm] = useState(''); // State to hold search input
  const [error, setError] = useState(null);
  const [showLateSubmissions, setShowLateSubmissions] = useState(false); // State for late submissions filter

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/api/compilerSubmissions/week/${week}`, {
          params: { courseYear, searchTerm }, // Pass course year and search term as query params
        });
        const { submissions, nonSubmittedUsers } = response.data;
        setSubmissions(submissions);
        setNonSubmittedUsers(nonSubmittedUsers);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setError('Error fetching submissions');
      }
    };

    fetchSubmissions();
  }, [week, courseYear, searchTerm]);

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  // Filter submissions based on late submission status
  const filteredSubmissions = submissions.filter((submission) => {
    const submissionTime = new Date(submission.submissionTime);
    const dueDate = new Date(submission.dueDate);
    const isLate = submissionTime > dueDate; // Check if submitted after due date
    return !showLateSubmissions || isLate; // Include submission if not filtering or if it's late
  });

  // Filter non-submitted users if course year or search term is applied
  const filteredNonSubmittedUsers = nonSubmittedUsers.filter(user => {
    return (
      (courseYear ? user.courseYear === courseYear : true) &&
      (searchTerm ? 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.admissionno.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) 
        : true)
    );
  });

  return (
    <div style={styles.submissionsContainer}>
      <h2 style={styles.title}>Submissions for Week {week}</h2>

      {/* Course Year Filter and Search Input */}
      <div style={styles.filterContainer}>
        <label htmlFor="courseYear">Filter by Course Year: </label>
        <select
          id="courseYear"
          value={courseYear}
          onChange={(e) => setCourseYear(e.target.value)}
          style={styles.select}
        >
          <option value="">All Course Years</option>
          <option value="First Year A Batch">First Year A Batch</option>
          <option value="First Year B Batch">First Year B Batch</option>
          <option value="Second Year A Batch">Second Year A Batch</option>
          <option value="Second Year B Batch">Second Year B Batch</option>
        </select>

        <label htmlFor="searchTerm" style={styles.searchLabel}>Search: </label>
        <input
          id="searchTerm"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter name, admission no, or email"
          style={styles.searchInput}
        />

        {/* Late Submission Filter */}
        <label style={styles.filterLabel}>
          <input
            type="checkbox"
            checked={showLateSubmissions}
            onChange={(e) => setShowLateSubmissions(e.target.checked)}
            style={styles.checkbox}
          />
          Show Only Late Submissions
        </label>
      </div>

      <h3>Users Who Submitted</h3>
      {filteredSubmissions.length ? (
        <table style={styles.submissionsTable}>
          <thead>
            <tr>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Admission No</th>
              <th style={styles.th}>Roll No</th>
              <th style={styles.th}>Course Year</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Score</th>
              <th style={styles.th}>Submission Time</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((submission) => {
              const submissionTime = new Date(submission.submissionTime);
              const dueDate = new Date(submission.dueDate);
              const isLate = submissionTime > dueDate; // Check if submitted after due date

              return (
                <tr key={submission._id} style={styles.tr}>
                  <td style={styles.td}>{submission.name || 'Unknown User'}</td>
                  <td style={styles.td}>{submission.admissionno || 'N/A'}</td>
                  <td style={styles.td}>{submission.rollno || 'N/A'}</td>
                  <td style={styles.td}>{submission.courseYear || 'N/A'}</td>
                  <td style={styles.td}>{submission.email || 'N/A'}</td>
                  <td style={styles.td}>{`${submission.passedCount} / ${submission.totalTestCases}`}</td>
                  <td style={styles.td}>{submissionTime.toLocaleString()}</td>
                  <td style={isLate ? styles.lateTd : styles.onTimeTd}>
                    {isLate ? 'Submitted Late' : 'On Time'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No submissions available for this week.</p>
      )}

      {/* Non-Submitted Users */}
      {!showLateSubmissions && ( // Only show if late submissions are not being filtered
        <>
          <h3>Users Who Did Not Submit</h3>
          {filteredNonSubmittedUsers.length ? (
            <table style={styles.submissionsTable}>
              <thead>
                <tr>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Admission No</th>
                  <th style={styles.th}>Roll No</th>
                  <th style={styles.th}>Course Year</th>
                  <th style={styles.th}>Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredNonSubmittedUsers.map((user) => (
                  <tr key={user._id} style={styles.tr}>
                    <td style={styles.td}>{user.name}</td>
                    <td style={styles.td}>{user.admissionno}</td>
                    <td style={styles.td}>{user.rollno}</td>
                    <td style={styles.td}>{user.courseYear}</td>
                    <td style={styles.td}>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>All users have submitted the quiz.</p>
          )}
        </>
      )}
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
  filterContainer: {
    marginBottom: '20px',
  },
  select: {
    marginLeft: '10px',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  searchLabel: {
    marginLeft: '10px',
  },
  searchInput: {
    padding: '8px',
    marginLeft: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  filterLabel: {
    marginLeft: '20px',
  },
  checkbox: {
    marginLeft: '5px',
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
  },
  td: {
    padding: '12px',
    border: '1px solid #ddd',
  },
  lateTd: {
    padding: '12px',
    border: '1px solid #ddd',
    color: 'red',
  },
  onTimeTd: {
    padding: '12px',
    border: '1px solid #ddd',
    color: 'green',
  },
  tr: {
    backgroundColor: '#f9f9f9',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
};

export default CSubmissiondetails;
