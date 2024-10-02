import React, { useEffect, useState } from 'react';
import axios from 'axios';

// CSS Styles
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  monthButton: {
    padding: '10px',
    margin: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  slot: {
    margin: '10px 0',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  attendedButton: {
    padding: '8px 12px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
  },
};

const MonthPage = () => {
  const [months, setMonths] = useState([]); // To store unique months
  const [selectedMonth, setSelectedMonth] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    // Fetch unique months (you can customize this to suit your logic)
    const fetchMonths = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/months'); // Endpoint to get unique months
        setMonths(response.data);
      } catch (error) {
        console.error('Error fetching months:', error);
      }
    };

    fetchMonths();
  }, []);

  const fetchTimeSlots = async (month) => {
    setSelectedMonth(month);
    try {
      const response = await axios.get(`http://localhost:5050/api/timeslots/${month}`);
      setTimeSlots(response.data); // Set the timeSlots state with the response data
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  const markAsAttended = async (userId, slotId) => {
    try {
      const response = await axios.post(`http://localhost:5050/api/markattended`, { userId, slotId });
      alert(response.data.message);
      fetchTimeSlots(selectedMonth); // Refresh the time slots after marking
    } catch (error) {
      console.error('Error marking as attended:', error);
      alert(error.response.data.message || 'Error marking as attended');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Select a Month</h2>
      <div>
        {months.map((month) => (
          <button key={month} style={styles.monthButton} onClick={() => fetchTimeSlots(month)}>
            {month}
          </button>
        ))}
      </div>

      {selectedMonth && (
        <div>
          <h3>Time Slots for {selectedMonth}</h3>
          {timeSlots.length > 0 ? (
            timeSlots.map((slot) => (
              <div key={slot._id} style={styles.slot}>
                <div><strong>Name:</strong> {slot.name}</div>
                <div><strong>Email:</strong> {slot.email}</div>
                <div><strong>Admission No:</strong> {slot.admissionno}</div>
                <div><strong>Time Slot:</strong> {slot.timeSlot}</div>
                <div><strong>Date:</strong> {new Date(slot.date).toLocaleDateString()}</div>
                <button
                  style={styles.attendedButton}
                  onClick={() => markAsAttended(slot.userId, slot._id)}
                  disabled={slot.attended} // Disable if already attended
                >
                  {slot.attended ? 'Attended' : 'Mark as Attended'}
                </button>
              </div>
            ))
          ) : (
            <p>No time slots available for this month.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MonthPage;
