import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Approve = () => {
    const [unapprovedUsers, setUnapprovedUsers] = useState([]);
    const [message, setMessage] = useState('');

    // Fetch unapproved users from the backend
    useEffect(() => {
        const fetchUnapprovedUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5050/unapproved-users');
                setUnapprovedUsers(response.data.users);
            } catch (error) {
                setMessage('Error fetching unapproved users');
            }
        };

        fetchUnapprovedUsers();
    }, []);

    // Function to approve a user
    const approveUser = async (userId) => {
        try {
            const response = await axios.put(`http://localhost:5050/approve/${userId}`);
            setMessage(response.data.message);

            // Update the status of the user in the state
            setUnapprovedUsers(
                unapprovedUsers.map((user) => 
                    user._id === userId ? { ...user, approved: true } : user
                )
            );
        } catch (error) {
            setMessage('Error approving user');
        }
    };

    return (
        <div>
            <h2>Admin Approval Page</h2>
            {message && <p>{message}</p>}

            {unapprovedUsers.length === 0 ? (
                <p>No unapproved users.</p>
            ) : (
                <table border="1" cellPadding="10" cellSpacing="0">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Admission No</th>
                            <th>Phone No</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unapprovedUsers.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.admissionno}</td>
                                <td>{user.phoneno}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.approved ? (
                                        <span>Approved</span>
                                    ) : (
                                        <button onClick={() => approveUser(user._id)}>Approve</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Approve;
