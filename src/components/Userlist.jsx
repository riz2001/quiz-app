import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
  tr: {
    transition: 'background-color 0.3s ease',
  },
  trHover: {
    backgroundColor: '#f9f9f9',
  },
  noUsers: {
    textAlign: 'center',
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
  const [selectedUser, setSelectedUser] = useState(null); // For managing selected user to add slot
  const [slotData, setSlotData] = useState({ timeSlot: '', date: '' }); // For the form

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
    setSelectedUser(user); // Set the selected user to open the form
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

    if (!slotData.timeSlot || !slotData.date) {
      alert('Please fill in both time slot and date');
      return;
    }

    try {
      await axios.post('http://localhost:5050/api/addtimeslot', {
        userId: selectedUser._id,
        timeSlot: slotData.timeSlot,
        date: slotData.date,
      });

      alert('Time slot added successfully!');
      setSelectedUser(null); // Close the form after submission
      setSlotData({ timeSlot: '', date: '' }); // Reset form data
    } catch (error) {
      console.error('Error adding time slot:', error);
      alert('Error adding time slot');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
              <th style={styles.th}>Add Time Slot</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} style={styles.tr}>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.admissionno}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>
                  <button
                    style={styles.button}
                    onClick={() => handleAddSlot(user)}
                  >
                    Add Time Slot
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={styles.noUsers}>No registered users found.</p>
      )}

      {/* Show the form only when a user is selected */}
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
