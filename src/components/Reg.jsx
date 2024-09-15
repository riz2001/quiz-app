import axios from 'axios';
import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import { Navigate, useNavigate } from 'react-router-dom';

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

const SecondarButton = styled(Button)`
  background-color: #28a745;

  &:hover {
    background-color: #218838;
  }
`;

// Ureg Component
const Reg = () => {
  const navigate = useNavigate(); 
  const navigate1 = useNavigate(); 
  const [input, setInput] = new useState({
    "name": "",
    "admissionno": "",
    "phoneno": "",
    "email": "",
    "password": "",
    "cnfpass": ""
  })

  const inputHandler = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value })
  }

  const readvalue = () => {
    if (input.password == input.cnfpass) {

      let newinput = {
        "name": input.name,
        "admissionno": input.admissionno,
        "phoneno": input.phoneno,
        "email": input.email,
        "password": input.password
      }
      axios.post("http://localhost:5050/signup", newinput).then(
        (response) => {
          console.log(response.data)
          if (response.data.status == "success") {
            alert("registered successfully")
            setInput({
              "name": input.name,
              "admissionno": input.admissionno,
              "phoneno": input.phoneno,
              "email": input.email,
              "password": input.password
            })


          } else {
            alert("email id alread exist")
            setInput({
              "name": input.name,
              "admissionno": input.admissionno,
              "phoneno": input.phoneno,
              "email": input.email,
              "password": input.password
            })

          }

        }
      ).catch(
        (error) => {
          console.log(error)
        }
      )
    } else {
      alert("password and confirm no match")
    }
  }







  return (
    <div>

      <GlobalStyle />
      <FormContainer>
        <FormWrapper>
          <Title>Sign Up</Title>
          <form >
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
              autoComplete="new-password" // Added autoComplete attribute
            />
            <Input
              type="password"
              name="cnfpass"
              placeholder="Confirm Password"
              value={input.cnfpass}
              onChange={inputHandler}
              required
              autoComplete="new-password" />
            <Button onClick={readvalue} >Sign Up</Button>
            <SecondarButton onClick={() => navigate1('/')}>BACK TO SIGNIN</SecondarButton>
          </form>
        </FormWrapper>
      </FormContainer>
    </div>
  );
};

export default Reg;
