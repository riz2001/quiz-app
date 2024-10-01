import React, { useEffect, useState } from 'react';
import axios from 'axios';

// CSS Styles
const styles = {
  container: {
    maxWidth: '100%',  // Make container full width
    margin: '0',  // Remove any margin
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'left', // Ensures all contents are aligned to the left
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
    textAlign: 'left', // Title aligned to the left
  },
  table: {
    width: '100%', // Full width for the table
    borderCollapse: 'collapse',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  th: {
    backgroundColor: '#f4f4f4',
    color: '#333',
    padding: '12px 15px',
    border: '1px solid #ddd',
    textAlign: 'left', // Align header text to the left
  },
  td: {
    padding: '12px 15px',
    border: '1px solid #ddd',
    textAlign: 'left', // Align cell text to the left
  },
  tr: {
    transition: 'background-color 0.3s ease',
  },
  noUsers: {
    fontSize: '18px',
    color: '#999',
    marginTop: '20px',
  },
  button: {
    padding: '8px 12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  formContainer: {
    marginTop: '20px',
  },
  formInput: {
    padding: '10px',
    margin: '10px 0',
    width: '100%',
    boxSizing: 'border-box',
  },
  formButton: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
  },
};

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [slotData, setSlotData] = useState({ timeSlot: '', date: '', meetingLink: '' }); // Added meetingLink field

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/users');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching users.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddSlot = (user) => {
    setSelectedUser(user);
  };

  const handleSlotChange = (e) => {
    const { name, value } = e.target;
    setSlotData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitSlot = async (e) => {
    e.preventDefault();

    if (!slotData.timeSlot || !slotData.date || !slotData.meetingLink) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5050/api/addtimeslot', {
        userId: selectedUser._id,
        timeSlot: slotData.timeSlot,
        date: slotData.date,
        meetingLink: slotData.meetingLink, // Include meeting link in the request
      });

      alert(response.data.message);
      setSelectedUser(null);
      setSlotData({ timeSlot: '', date: '', meetingLink: '' });
    } catch (error) {
      console.error('Error adding time slot:', error);
      alert(error.response.data.message || 'Error adding time slot');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const getMonthYearString = (date) => {
    const month = date.getMonth(); 
    const year = date.getFullYear();
    return `${year}-${month < 9 ? '0' + (month + 1) : month + 1}`; 
  };

  const groupSlotsByMonth = (timeSlots) => {
    const slotsByMonth = {};
    timeSlots.forEach(slot => {
      const date = new Date(slot.date);
      const monthYear = getMonthYearString(date);
      if (!slotsByMonth[monthYear]) {
        slotsByMonth[monthYear] = [];
      }
      slotsByMonth[monthYear].push(slot);
    });
    return slotsByMonth;
  };

  const allMonths = Array.from(new Set(users.flatMap(user => 
    Object.keys(groupSlotsByMonth(user.timeSlots))
  )));

  const getMonthName = (monthKey) => {
    const monthIndex = parseInt(monthKey.split('-')[1], 10) - 1; 
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[monthIndex];
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Registered Users</h2>
      {users.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Admission No</th>
              <th style={styles.th}>Email</th>
              {allMonths.map((month, idx) => (
                <th key={idx} style={styles.th}>{`${getMonthName(month)} ${month.split('-')[0]}`}</th>
              ))}
              <th style={styles.th}>Add Time Slot</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              const slotsByMonth = groupSlotsByMonth(user.timeSlots);
              return (
                <tr key={index} style={styles.tr}>
                  <td style={styles.td}>{user.name}</td>
                  <td style={styles.td}>{user.admissionno}</td>
                  <td style={styles.td}>{user.email}</td>
                  {allMonths.map((month) => (
                    <td key={month} style={styles.td}>
                      {slotsByMonth[month] ? (
                        <ul>
                          {slotsByMonth[month].map((slot, idx) => (
                            <li key={idx} style={{ marginBottom: '10px', padding: '5px', border: '1px solid #ddd', borderRadius: '5px' }}>
                              <div style={{ fontWeight: 'bold' }}>{slot.timeSlot}</div>
                              <div style={{ color: '#777' }}>
                                {new Date(slot.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </div>
                              <div style={{ color: '#007bff' }}>
                                <a href={slot.meetingLink} target="_blank" rel="noopener noreferrer">Join Meeting</a>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No time slots booked.</p>
                      )}
                    </td>
                  ))}
                  <td style={styles.td}>
                    <button
                      style={styles.button}
                      onClick={() => handleAddSlot(user)}
                    >
                      Add Time Slot
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p style={styles.noUsers}>No registered users found.</p>
      )}

      {selectedUser && (
        <div style={styles.formContainer}>
          <h3>
            Add Time Slot for {selectedUser.name} (Admission No: {selectedUser.admissionno})
          </h3>
          <form onSubmit={handleSubmitSlot}>
            <input
              type="text"
              name="timeSlot"
              placeholder="Enter time slot"
              value={slotData.timeSlot}
              onChange={handleSlotChange}
              style={styles.formInput}
              required
            />
            <input
              type="date"
              name="date"
              value={slotData.date}
              onChange={handleSlotChange}
              style={styles.formInput}
              required
            />
            <input
              type="text"
              name="meetingLink"
              placeholder="Enter meeting link"
              value={slotData.meetingLink}
              onChange={handleSlotChange}
              style={styles.formInput}
              required
            />
            <button type="submit" style={styles.formButton}>
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UsersList;
