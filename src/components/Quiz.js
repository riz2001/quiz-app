import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Quiz = () => {
  const { week } = useParams(); // Get the week number from the URL
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch questions for the specific week
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5050/api/questions/${week}`);
        setQuestions(response.data);
        setAnswers(new Array(response.data.length).fill('')); // Initialize answers array
        setLoading(false);
      } catch (error) {
        setError('Error fetching questions');
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [week]);

  // Fetch user submissions
  useEffect(() => {
    const fetchUserSubmissions = async () => {
      const token = sessionStorage.getItem('token');
    
      try {
        const response = await axios.get(`http://localhost:5050/api/submissions`, {
          headers: { token }
        });
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching submissions', error);
      }
    };

    fetchUserSubmissions();
  }, []);

  // Handle answer changes
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // Handle quiz submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userAnswers = questions.map((question, index) => ({
      questionId: question._id,
      answer: answers[index]
    }));
  
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post('http://localhost:5050/api/submit-quiz', {
        week,
        answers: userAnswers
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      setScore(response.data.score);
      setResults(response.data.results);
      setSubmitted(true); // Set submitted state to true after successful submission
  
      // Format results for alert
      const resultsSummary = response.data.results.map(result => {
        const question = questions.find(q => q._id === result.questionId);
        return `
          Question: ${question ? question.question : 'Unknown'}
          Your Answer: ${result.userAnswer || 'No answer selected'}
          Correct Answer: ${result.correctAnswer}
          Status: ${result.isCorrect ? '✔️ Correct' : '❌ Incorrect'}
        `;
      }).join('\n\n');
  
      // Display results in an alert box
      window.alert(`Quiz submitted successfully\n\n${resultsSummary}`);
  
    } catch (error) {
      console.error('Error submitting quiz:', error.response?.data?.message || error.message);
      setError('Error submitting quiz');
      window.alert(`There was an error submitting the quiz: ${error.response?.data?.message || 'Please try again.'}`);
    }
  };
  

  if (loading) {
    return <div className="loading">Loading questions...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="quiz-container">
      <style>
        {`
          .quiz-container {
            width: 80%;
            max-width: 800px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          .quiz-title {
            text-align: center;
            margin-bottom: 20px;
            font-size: 24px;
            color: #333;
          }
          .quiz-form {
            margin-top: 20px;
          }
          .question-block {
            margin-bottom: 20px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
          }
          .question-text {
            font-size: 18px;
            color: #555;
          }
          .options-container {
            margin-top: 10px;
          }
          .option-label {
            display: block;
            margin-bottom: 8px;
            font-size: 16px;
          }
          .option-input {
            margin-right: 8px;
          }
          .submit-button {
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
            display: block;
            width: 100%;
          }
          .submit-button:hover {
            background-color: #0056b3;
          }
          .loading, .error {
            text-align: center;
            font-size: 18px;
            color: #ff0000;
          }
          .results-container {
            margin-top: 20px;
          }
          .results-title {
            font-size: 20px;
            font-weight: bold;
            color: #333;
          }
          .results-list {
            list-style-type: none;
            padding: 0;
          }
          .result-item {
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
          }
          .result-item.correct {
            background-color: #d4edda;
            color: #155724;
          }
          .result-item.incorrect {
            background-color: #f8d7da;
            color: #721c24;
          }
          .result-question, .result-answer, .result-correct, .result-status {
            margin-bottom: 8px;
          }
        `}
      </style>

      <h2 className="quiz-title">Quiz for Week {week}</h2>
      {questions.length > 0 ? (
        <form onSubmit={handleSubmit} className="quiz-form">
          {questions.map((question, index) => (
            <div key={index} className="question-block">
              <h3 className="question-text">{question.question}</h3>
              <div className="options-container">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="option-label">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      required
                      className="option-input"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button type="submit" className="submit-button">Submit Quiz</button>
        </form>
      ) : (
        <p className="no-questions">No questions found for this week.</p>
      )}

      {/* Display results after quiz submission */}
      {submitted && score !== null && (
        <div className="results-container">
          <h3 className="results-title">Your Score: {score}</h3>
          <ul className="results-list">
            {results.map((result, index) => (
              <li key={index} className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="result-question">
                  {questions.find(q => q._id === result.questionId)?.question}
                </div>
                <div className="result-answer">
                  <strong>Your Answer:</strong> {result.userAnswer || 'No answer selected'}
                </div>
                <div className="result-correct">
                  <strong>Correct Answer:</strong> {result.correctAnswer}
                </div>
                <div className="result-status">
                  {result.isCorrect ? '✔️ Correct' : '❌ Incorrect'}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Quiz;
