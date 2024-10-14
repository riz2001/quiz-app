// src/CodingQuestions.jsx
import React, { useState } from 'react';
import axios from 'axios';
// You can use the same CSS as before

const Codingq = () => {
    // Question submission form state
    const [question, setQuestion] = useState({
        title: '',
        description: '',
        inputFormat: '',
        outputFormat: '',
        testCases: [{ input: '', expectedOutput: '' }],
        difficulty: '',
        week: ''
    });

    const [questionSubmitStatus, setQuestionSubmitStatus] = useState(null);

    // Handle question form changes
    const handleQuestionChange = (e) => {
        setQuestion({ ...question, [e.target.name]: e.target.value });
    };

    // Handle test case changes
    const handleTestCaseChange = (index, e) => {
        const newTestCases = [...question.testCases];
        newTestCases[index][e.target.name] = e.target.value;
        setQuestion({ ...question, testCases: newTestCases });
    };

    // Add a new test case
    const addTestCase = () => {
        setQuestion({ ...question, testCases: [...question.testCases, { input: '', expectedOutput: '' }] });
    };

    // Submit question
    const submitQuestion = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5050/api/cquestions', question)
            .then(response => setQuestionSubmitStatus(response.data.message))
            .catch(err => setQuestionSubmitStatus(err.response.data.error));
    };

    return (
        <div className="App">
            <h1>Submit a Coding Question</h1>
            <form onSubmit={submitQuestion}>
                <input 
                    type="text" 
                    name="title" 
                    placeholder="Title" 
                    value={question.title} 
                    onChange={handleQuestionChange} 
                    required 
                />
                <textarea 
                    name="description" 
                    placeholder="Description" 
                    value={question.description} 
                    onChange={handleQuestionChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="inputFormat" 
                    placeholder="Input Format" 
                    value={question.inputFormat} 
                    onChange={handleQuestionChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="outputFormat" 
                    placeholder="Output Format" 
                    value={question.outputFormat} 
                    onChange={handleQuestionChange} 
                    required 
                />

                {/* Test Cases */}
                <h3>Test Cases</h3>
                {question.testCases.map((testCase, index) => (
                    <div key={index}>
                        <input 
                            type="text" 
                            name="input" 
                            placeholder="Input" 
                            value={testCase.input} 
                            onChange={(e) => handleTestCaseChange(index, e)} 
                        />
                        <input 
                            type="text" 
                            name="expectedOutput" 
                            placeholder="Expected Output" 
                            value={testCase.expectedOutput} 
                            onChange={(e) => handleTestCaseChange(index, e)} 
                        />
                    </div>
                ))}
                <button type="button" onClick={addTestCase}>Add Test Case</button>

                <input 
                    type="text" 
                    name="difficulty" 
                    placeholder="Difficulty (easy, medium, hard)" 
                    value={question.difficulty} 
                    onChange={handleQuestionChange} 
                    required 
                />
                <input 
                    type="number" 
                    name="week" 
                    placeholder="Week Number" 
                    value={question.week} 
                    onChange={handleQuestionChange} 
                    required 
                />

                <button type="submit">Submit Question</button>
            </form>

            {questionSubmitStatus && <p>{questionSubmitStatus}</p>}
        </div>
    );
};

export default Codingq;
