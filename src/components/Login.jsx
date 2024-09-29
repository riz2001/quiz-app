import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';


// Global Styles
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Arial', sans-serif;
    background-color: #f0f2f5;
    color: #333;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }
`;

// Styled Components
const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const FormWrapper = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  margin: 1rem 0;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #28a745;

  &:hover {
    background-color: #218838;
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({ email: '', password: '' });

  const inputHandler = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    axios.post("http://localhost:5050/signin", input)
      .then(response => {
        if (response.data.status === "incorrect password") {
          alert("Incorrect password");
        } else if (response.data.status === "invalid email id") {
          alert("Invalid email ID");
        } else if (response.data.status === "success") {
          // Extract the token and user details from the response
          const { token, user } = response.data;
  
          // Store token and user details in sessionStorage
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("userId", user._id);
          sessionStorage.setItem("userName", user.name);
          sessionStorage.setItem("admissionNo", user.admissionno);
          sessionStorage.setItem("email", user.email);
          sessionStorage.setItem("timeSlot", user.timeSlot || "");  // If no timeSlot, store an empty string
          sessionStorage.setItem("date", user.date || "");          // If no date, store an empty string
  
          // Log the values to ensure they are stored correctly
          console.log("Stored UserId:", user._id);
          console.log("Stored Token:", token);
          console.log("Stored UserName:", user.name);
          console.log("Stored TimeSlot:", user.timeSlot);
          console.log("Stored Date:", user.date);
  
          // Navigate to the main page
          navigate("/user/timeslots");
        }
      })
      .catch(error => {
        console.error("Error during sign-in:", error);
      });
  };
  

  return (
    <div>
       
      <GlobalStyle />
      <FormContainer>
        <FormWrapper>
          <Title>Sign In</Title>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="email"
              placeholder="Email"
              value={input.email}
              onChange={inputHandler}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={input.password}
              onChange={inputHandler}
              required
            />
            <Button type="submit">Sign In</Button>
            <SecondaryButton onClick={() => navigate('/reg')}>Sign Up</SecondaryButton>
          </form>
        </FormWrapper>
      </FormContainer>
    </div>
  );
};

export default Login;