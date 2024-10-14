import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Cweeks = () => {
    const [weeks, setWeeks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeeks = async () => {
            try {
                const res = await axios.get('http://localhost:5050/api/cquestions/weeks');
                setWeeks(res.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching weeks');
                setLoading(false);
            }
        };

        fetchWeeks();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="week-review">
            <h1 className="title">Registered Weeks</h1>
            <div className="card-container">
                {weeks.map((week, index) => (
                    <div key={index} className="card">
                        <Link to={`/compiler/${week}`} className="card-link">
                            <h3 className="card-title">Week {week}</h3>
                        </Link>
                    </div>
                ))}
            </div>
            <style jsx>{`
                /* Apply background color to the entire page */
                body {
                    background-color: #f0f2f5; /* Light gray background for the whole page */
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                }

                .week-review {
                    width: 90%; /* Slightly wider for better responsiveness */
                    max-width: 1000px;
                    margin: 20px auto; /* Add some space around the container */
                    padding: 20px;
                    text-align: center;
                    background-color: #ffffff; /* White background for the content area */
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }

                .title {
                    font-size: 24px;
                    color: #333;
                    margin-bottom: 20px;
                }

                .card-container {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 20px;
                }

                .card {
                    position: relative; /* Position relative for pseudo-elements */
                    background-color: #007bff; /* Custom blue background for the cards */
                    border: 1px solid #0056b3; /* Darker blue border for contrast */
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    width: 200px;
                    text-align: center;
                    padding: 15px;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    color: #fff; /* White text for better readability */
                    cursor: pointer; /* Change cursor to pointer for better UX */
                }

                .card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                    background-color: #0056b3; /* Darker blue on hover */
                }

                .card::after {
                    content: '';
                    position: absolute;
                    left: 10%;
                    right: 10%;
                    bottom: -5px; /* Position it just below the card */
                    height: 2px; /* Thickness of the line */
                    background-color: white; /* Color of the line */
                    opacity: 0; /* Start as invisible */
                    transition: opacity 0.3s ease; /* Transition effect */
                }

                .card:hover::after {
                    opacity: 1; /* Make it visible on hover */
                }

                .card-link {
                    text-decoration: none;
                    color: #ffffff;
                }

                .card-title {
                    font-size: 18px;
                    color: #fff; /* White text for better readability */
                }
            `}</style>
        </div>
    );
};

export default Cweeks;
