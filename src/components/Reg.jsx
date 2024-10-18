import axios from 'axios';
import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

const Select = styled.select`
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

const SecondarButton = styled(Button)`
  background-color: #28a745;

  &:hover {
    background-color: #218838;
  }
`;

// Reg Component
const Reg = () => {
  const navigate = useNavigate(); 
  const [input, setInput] = useState({
    name: "",
    admissionno: "",
    phoneno: "",
    rollno: "",
    courseYear: "", // Changed from semester to courseYear
    email: "",
    password: "",
    cnfpass: ""
  });

  const inputHandler = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value });
  };

  const readvalue = () => {
    if (input.password === input.cnfpass) {
      let newinput = {
        name: input.name,
        admissionno: input.admissionno,
        phoneno: input.phoneno,
        rollno: input.rollno,
        courseYear: input.courseYear, // Include courseYear in the submission
        email: input.email,
        password: input.password
      };
      
      axios.post("http://localhost:5050/signup", newinput).then(
        (response) => {
          console.log(response.data);
          if (response.data.status === "success") {
            alert("Registered successfully");
            // Reset input fields
            setInput({
              name: "",
              admissionno: "",
              phoneno: "",
              rollno: "",
              courseYear: "", // Reset courseYear
              email: "",
              password: "",
              cnfpass: ""
            });
          } else if (response.data.status === "email id already exists") {
            alert("Email ID already exists.");
          }
        }
      ).catch((error) => {
        console.log(error);
        alert("An error occurred during registration. Please try again.");
      });
    } else {
      alert("Password and confirm password do not match");
    }
  };

  return (
    <div>
      <GlobalStyle />
      <FormContainer>
        <FormWrapper>
          <Title>Sign Up</Title>
          <form>
            <Input
              type="text"
              name="name"
              placeholder="Name"
              value={input.name}
              onChange={inputHandler}
              required
            />
            <Input
              type="text"
              name="admissionno"
              placeholder="Admission Number"
              value={input.admissionno}
              onChange={inputHandler}
              required
            />
            <Select
              name="courseYear"
              value={input.courseYear}
              onChange={inputHandler}
              required
            >
              <option value="">Select Year/Batch</option>
              <option value="First Year A Batch">First Year A Batch</option>
              <option value="First Year B Batch">First Year B Batch</option>
              <option value="Second Year A Batch">Second Year A Batch</option>
              <option value="Second Year B Batch">Second Year B Batch</option>
            </Select>
            <Input
              type="text"
              name="rollno"
              placeholder="Roll Number"
              value={input.rollno}
              onChange={inputHandler}
              required
            />
            <Input
              type="tel"
              name="phoneno"
              placeholder="Phone Number"
              value={input.phoneno}
              onChange={inputHandler}
              required
            />
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
              autoComplete="new-password"
            />
            <Input
              type="password"
              name="cnfpass"
              placeholder="Confirm Password"
              value={input.cnfpass}
              onChange={inputHandler}
              required
              autoComplete="new-password"
            />
            <Button onClick={readvalue}>Sign Up</Button>
            <SecondarButton onClick={() => navigate('/')}>BACK TO SIGNIN</SecondarButton>
          </form>
        </FormWrapper>
      </FormContainer>
    </div>
  );
};

export default Reg;
