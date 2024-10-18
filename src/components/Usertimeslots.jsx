import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Usertimeslots = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTimeSlots = async () => {
      const userId = sessionStorage.getItem('userId'); // Get the user ID from session storage

      try {
        const response = await axios.get(`http://localhost:5050/api/users/${userId}/timeslots`);
        setTimeSlots(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching time slots.');
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Your Time Slots</h2>
      {timeSlots.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Time Slot</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Meeting Link</th>
              <th style={styles.th}>Status</th> {/* Column for Status */}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot, index) => (
              <tr key={index}>
                <td style={styles.td}>{slot.timeSlot}</td>
                <td style={styles.td}>{new Date(slot.date).toLocaleDateString()}</td>
                <td style={styles.td}>
                  {slot.meetingLink ? (
                    <a href={slot.meetingLink} target="_blank" rel="noopener noreferrer">
                      {slot.meetingLink}
                    </a>
                  ) : (
                    'No meeting link provided'
                  )}
                </td>
                <td style={styles.td}>{slot.status.charAt(0).toUpperCase() + slot.status.slice(1).replace(/_/g, ' ')}</td> {/* Show Status */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No time slots found.</p>
      )}
    </div>
  );
};

// CSS Styles
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  th: {
    backgroundColor: '#f4f4f4',
    color: '#333',
    padding: '12px 15px',
    border: '1px solid #ddd',
    textAlign: 'left',
  },
  td: {
    padding: '12px 15px',
    border: '1px solid #ddd',
  },
};

export default Usertimeslots;
