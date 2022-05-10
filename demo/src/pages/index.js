import React, { useState } from "react";
import axios from 'axios';
import "../styles/index.css"

// markup
const IndexPage = () => {
  const [inputVal, setInputVal] = useState("");

  const handleChange = (e) => {
    setInputVal(e.target.value);
  }

  const handleClick = (e) => {
    axios({
      method: "POST",
      url: "https://crapi.oskarmroz.com/",
      data: {
        email: inputVal
      }
    }).then((response) => {
      if (response.data.msg === 'success') {
        console.log("Email sent, awesome!");
        setInputVal("");
      } else if (response.data.msg === 'fail') {
        console.log("Oops, something went wrong. Try again")
      }
    })
    // axios.post('https://142.132.237.218:3000/', {
    //   email: inputVal
    // })
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  }

  return (
    <main style={pageStyles}>
      <title>Click and rent</title>
      <h1 style={headingStyles}>
        Please enter your email to receive the code.
      </h1>
      <label style={emailLabel} name="email">Your email</label>
      <br />
      <input style={emailInput} value={inputVal} onChange={handleChange} name="email" placeholder="johndoe@gmail.com" type="email" />
      <br />
      <button type="submit" style={emailButton} onClick={handleClick}>
        Generate
      </button>
    </main>
  )
}

// styles
const pageStyles = {
  color: "#232129",
  padding: "5%",
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
  maxWidth: 380
}
const headingStyles = {
  marginTop: 0,
  marginBottom: 24,
  maxWidth: "100%",
}

const emailLabel = {
  fontWeight: "bold",
  fontSize: 16,
  verticalAlign: "5%",
  width: "100%",
}

const emailInput = {
  height: 30,
  fontSize: 20,
  marginTop: 5,
  width: "96%",
  paddingLeft: 10,
}

const emailButton = {
  height: 36,
  width: "100%",
  fontSize: 17,
  marginTop: 15,
  border: "none",
  backgroundColor: "#0d96a8",
  cursor: "pointer",
  color: "white"
}

export default IndexPage
