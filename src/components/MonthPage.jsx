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
  statusButton: {
    padding: '8px 12px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
    marginRight: '10px',
  },
  notAttendedButton: {
    padding: '8px 12px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
    marginRight: '10px',
  },
};

const MonthPage = () => {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    const fetchMonths = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/months');
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
      console.log(response.data); // Log the response to see the fetched time slots
      setTimeSlots(response.data); // Assuming status is included in the response
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  const updateStatus = (userId, slotId, status) => {
    // Update the status locally in timeSlots
    setTimeSlots((prevSlots) =>
      prevSlots.map((slot) =>
        slot._id === slotId ? { ...slot, status } : slot
      )
    );

    // Make the API call to update the status in the database
    axios.post('http://localhost:5050/api/updatestatus', { userId, slotId, status })
      .then((response) => {
        alert(response.data.message);
      })
      .catch((error) => {
        console.error(`Error updating status to ${status}:`, error);
        alert(error.response?.data?.message || `Error updating status to ${status}`);
      });
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
                
                {/* Displaying the current status */}
                <div>
                  <strong>Status:</strong> 
                  {slot.status === 'attended' ? 'Attended' 
                   : slot.status === 'not attended' ? 'Not Attended' 
                   : 'Pending'}
                </div>

                <button
                  style={styles.statusButton}
                  onClick={() => updateStatus(slot.userId, slot._id, 'attended')}
                  disabled={slot.status === 'attended'}
                >
                  Mark as Attended
                </button>

                <button
                  style={styles.notAttendedButton}
                  onClick={() => updateStatus(slot.userId, slot._id, 'not attended')}
                  disabled={slot.status === 'not attended'}
                >
                  Mark as Not Attended
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
