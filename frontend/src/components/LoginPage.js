import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [enteredValues, setEnteredValues] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const [isPasswordValid, setIsPasswordValid] = useState(true);

  function handleSubmit(event) {
    event.preventDefault();
    console.log("HIsss")
    // axios.get("http://localhost:3000/users/2", {
    //   withCredentials: true,  //  Ensure this matches backend CORS settings
    //   headers: {},  //  Empty headers to test if backend blocks defaults
    // })
    //   .then(response => console.log(response.data))
    //   .catch(error => console.error("Error fetching user:", error));
    

    // Send the username and password to the server
    axios
      .post(
        "http://localhost:3000/login",
        {
          username: enteredValues.username,
          password: enteredValues.password,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data); // Log the response from the server
    
        if (response.status === 200) {
          console.log("Log in successfully");
          navigate("..");
        } else {
          console.error("Unexpected response:", response);
        }
      })
      .catch((error) => {
        //  Check if the response exists before accessing it
        if (error.response) {
          if (error.response.status === 404) {
            console.log("Log in failed"); //  This will now show in the console
          } else {
            console.error("Unexpected error:", error.response.status, error.response.data);
          }
        } else {
          console.error("Error submitting login:", error.message);
        }
    });
  
  }

  function handleInputChange(identifier, event) {
    setEnteredValues((preValues) => ({
      ...preValues,
      [identifier]: event.target.value,
    }));
  }

  function navigateSignup() {
    navigate("../signup"); // since we at something like http://localhost:5173/services/uservault and we need to go to http://localhost:5173/services/signup
  }

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/getCSRFToken", { withCredentials: true })
  //     .then((response) => {
  //       console.log("CSRF " + response);
  //     });
  // });
  return (
    <Wrapper>
      {" "}
      <form onSubmit={handleSubmit} className="general">
        <h2 className="form-title">Login to Database</h2>
        <div className="form-group">
          <div>
            <input
              type=""
              id="username"
              name="username"
              placeholder="Username"
              onChange={(event) => handleInputChange("username", event)}
              value={enteredValues.username}
            />
          </div>
          <div>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              onChange={(event) => handleInputChange("password", event)}
              value={enteredValues.password}
            />
            <h1>
              {!isPasswordValid && (
                <p className="error-message">password is not correct</p>
              )}
            </h1>
          </div>
        </div>

        <p className="btn-group">
          <button
            type="button" // Set the type to "button" to stop this button active onSubmit for the form
            onClick={() => {
              navigateSignup();
            }}
            className="btn"
          >
            Sign up
          </button>
          <button className="btn">Login </button>
        </p>
      </form>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  .form-title {
    font-size: 2rem;
  }

  .form-group {
    margin-bottom: 20px;

    input {
      padding: 8px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
      width: 300px;
      margin: 4px;
    }
  }
  .btn-group {
    display: grid;
    grid-auto-flow: column;
    gap: 2rem;
  }
  .btn {
    // this is global btn. we just add some extra value
    width: 7.5rem;
  }
  .error-message {
    margin-top: 0.5rem;
    color: red;
    font-size: 0.875rem; /* 14px in rem based on a 16px root font size */
  }

  @media (min-width: 776px) {
    flex-direction: column;
  }
`;

export default Login;