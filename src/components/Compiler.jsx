import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Compiler() {
    const { week } = useParams(); // Get week from the URL
    const [questions, setQuestions] = useState([]);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('python');
    const [output, setOutput] = useState('');
    const [input, setInput] = useState('');
    const [expectedOutput, setExpectedOutput] = useState('');
    const [testResult, setTestResult] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [passedCount, setPassedCount] = useState(0);

    // Fetch questions for the selected week
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get(`http://localhost:5050/api/cquestions/week/${week}`);
                setQuestions(res.data);
            } catch (err) {
                console.error('Error fetching questions for the week', err);
            }
        };

        if (week) fetchQuestions();
    }, [week]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5050/api/compiler/run', {
                code,
                language,
                input,
                expectedOutput,
            });

            setOutput(res.data.output);
        } catch (error) {
            console.error('Error running the code:', error);
            setOutput('Error running the code.');
        }
    };

    const handleQuestionSelect = (question) => {
        setSelectedQuestion(question);
        setInput('');
        setExpectedOutput('');
        setTestResult([]);
        setPassedCount(0);
    };

    const runWithTestCase = async (testCase) => {
        setInput(testCase.input);
        setExpectedOutput(testCase.expectedOutput);

        try {
            const res = await axios.post('http://localhost:5050/api/compiler/run', {
                code,
                language,
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
            });

            const actualOutput = res.data.output;
            const passed = actualOutput.trim() === testCase.expectedOutput.trim();

            setOutput(actualOutput);
            setTestResult([{
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput: actualOutput,
                passed: passed
            }]);
        } catch (error) {
            console.error('Error running the code with test case:', error);
            setOutput('Error running the code with test case.');
            setTestResult([]);
        }
    };

    const runAllTestCases = async () => {
        if (!selectedQuestion || !selectedQuestion.testCases) return;

        const results = [];
        let passCount = 0;

        for (const testCase of selectedQuestion.testCases) {
            try {
                const res = await axios.post('http://localhost:5050/api/compiler/run', {
                    code,
                    language,
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                });

                const actualOutput = res.data.output;
                const passed = actualOutput.trim() === testCase.expectedOutput.trim();

                results.push({
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: actualOutput,
                    passed: passed,
                });

                if (passed) passCount++;
            } catch (error) {
                console.error('Error running the code with test case:', error);
                results.push({
                    input: testCase.input,
                    expectedOutput: testCase.expectedOutput,
                    actualOutput: 'Error running the code.',
                    passed: false,
                });
            }
        }

        setTestResult(results);
        setPassedCount(passCount);
    };

    const handleFinalSubmission = async () => {
        if (!selectedQuestion || !testResult.length) {
            alert('No test results found. Please run the test cases first.');
            return;
        }
    
        const userId = sessionStorage.getItem('userId'); // Retrieve user ID from session storage
    
        const submissionData = {
            userId,
            week,
            questionId: selectedQuestion._id,
            passedCount,
            totalTestCases: selectedQuestion.testCases.length,
            testResults: testResult,
        };
    
        try {
            const res = await axios.post('http://localhost:5050/api/compilerSubmissions', submissionData, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            });
            console.log('Submission Response:', res.data);
            alert('Submission recorded successfully!'); 
            // Optionally, clear the code and results after a successful submission
            // resetForm();
        } catch (error) {
            console.error('Error submitting the solution:', error);
            // Check if the error response indicates a duplicate submission
            if (error.response && error.response.status === 400 && error.response.data.error) {
                alert(error.response.data.error); // Show the error message from the backend
            } else {
                alert('Error recording submission. Please try again later.');
            }
        }
    };
    
    return (
        <div style={styles.app}>
            <h1 style={styles.title}>Online Compiler</h1>

            {questions.length > 0 && (
                <div style={styles.questionsList}>
                    <h2>Questions for Week {week}</h2>
                    <ul style={styles.questionList}>
                        {questions.map((question) => (
                            <li key={question._id} onClick={() => handleQuestionSelect(question)} style={styles.questionItem}>
                                <strong>{question.title}</strong>
                                <p>{question.description}</p>
                                <p style={styles.formatText}><strong>Input Format:</strong> {question.inputFormat}</p>
                                <p style={styles.formatText}><strong>Output Format:</strong> {question.outputFormat}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputContainer}>
                    <label style={styles.label}>Language:</label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={styles.select}
                    >
                        <option value="python">Python</option>
                        <option value="c">C</option>
                        <option value="java">Java</option>
                    </select>
                </div>

                <div style={styles.inputContainer}>
                    <label style={styles.label}>Code:</label>
                    <textarea
                        style={styles.codeEditor}
                        rows="10"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </div>

                <div style={styles.inputContainer}>
                    <label style={styles.label}>Input:</label>
                    <textarea
                        style={styles.codeEditor}
                        rows="3"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>

                <button type="submit" style={styles.runButton}>
                    Run Code
                </button>
            </form>

            <div style={styles.results}>
                <h3>Output:</h3>
                <pre>{output}</pre>
                <h3>Test Result:</h3>
                {Array.isArray(testResult) && testResult.map((result, index) => (
                    <div key={index} style={result.passed ? styles.testPassed : styles.testFailed}>
                        <p>
                            <strong>Input:</strong> {result.input}<br />
                            <strong>Expected Output:</strong> {result.expectedOutput}<br />
                            <strong>Actual Output:</strong> {result.actualOutput}<br />
                            <strong>Test Case {result.passed ? 'Passed' : 'Failed'}</strong>
                        </p>
                    </div>
                ))}

                <h3>{`Passed ${passedCount} out of ${testResult.length} test cases`}</h3>
            </div>

            {selectedQuestion && (
                <button onClick={runAllTestCases} style={styles.loadButton}>
                    Run All Test Cases
                </button>
            )}

            {selectedQuestion && (
                <button onClick={handleFinalSubmission} style={styles.loadButton}>
                    Submit Solution
                </button>
            )}
        </div>
    );
}

export default Compiler;

// Styles remain unchanged
const styles = {
    app: {
        width: '80%',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '2.5em',
        textAlign: 'center',
        marginBottom: '20px',
        color: '#343a40',
    },
    inputContainer: {
        marginBottom: '20px',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    select: {
        padding: '10px',
        fontSize: '1em',
        width: '100%',
        border: '1px solid #ced4da',
        borderRadius: '5px',
    },
    codeEditor: {
        width: '100%',
        padding: '10px',
        fontSize: '1em',
        border: '1px solid #ced4da',
        borderRadius: '5px',
    },
    runButton: {
        backgroundColor: '#28a745',
        color: 'white',
        padding: '10px 20px',
        fontSize: '1.2em',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    questionsList: {
        marginBottom: '20px',
    },
    questionList: {
        listStyle: 'none',
        padding: 0,
    },
    questionItem: {
        backgroundColor: '#e9ecef',
        marginBottom: '10px',
        padding: '15px',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    results: {
        marginTop: '20px',
    },
    testPassed: {
        backgroundColor: '#d4edda',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '10px',
    },
    testFailed: {
        backgroundColor: '#f8d7da',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '10px',
    },
    formatText: {
        color: '#6c757d',
    },
    loadButton: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 20px',
        fontSize: '1.2em',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
    },
};
