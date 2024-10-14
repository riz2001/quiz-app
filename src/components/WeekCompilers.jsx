import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function WeekCompilers() {
    const [weeks, setWeeks] = useState([]);

    useEffect(() => {
        const fetchWeeks = async () => {
            try {
                const res = await axios.get('http://localhost:5050/api/compilerSubmissionss');
                const weeksArray = Object.keys(res.data).map(week => ({
                    week: parseInt(week),
                    submissions: res.data[week],
                }));
                setWeeks(weeksArray);
            } catch (err) {
                console.error('Error fetching submissions:', err);
            }
        };

        fetchWeeks();
    }, []);

    return (
        <div style={styles.app}>
            <h1 style={styles.title}>All Weeks Compiler Submissions</h1>
            {weeks.length === 0 ? (
                <p>No submissions found.</p>
            ) : (
                weeks.map(({ week, submissions }) => (
                    <div key={week} style={styles.weekContainer}>
                        <h2 style={styles.weekTitle}>
                            <Link to={`/submissions/week/${week}`} style={styles.link}>
                                Week {week}
                            </Link>
                        </h2>
                        <p style={styles.submissionCount}>
                            Total Submissions: {submissions.length}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
}

export default WeekCompilers;

// Styles
const styles = {
    app: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '2em',
        marginBottom: '20px',
    },
    weekContainer: {
        marginBottom: '20px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    weekTitle: {
        fontSize: '1.5em',
        marginBottom: '10px',
    },
    submissionCount: {
        marginBottom: '10px',
    },
    link: {
        textDecoration: 'none',
        color: '#007bff',
    },
};
