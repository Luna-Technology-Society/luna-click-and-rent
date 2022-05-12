import React, { useState } from "react";
import axios from 'axios';
import "../styles/index.css"
import Loader from "react-loader"

// markup
const IndexPage = () => {
  const [inputVal, setInputVal] = useState("");
  const [resultVal, setResultVal] = useState("");
  const [isLoaded, setIsLoaded] = useState(true);

  const handleChange = (e) => {
    setInputVal(e.target.value);
  }

  const handleClick = (e) => {
    if (inputVal && inputVal.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
      setIsLoaded(false);
      axios({
        method: "POST",
        url: "https://crapi.oskarmroz.com/",
        data: {
          email: inputVal
        }
      }).then((response) => {
        console.log(response.data.message);
        if (response.data.error) {
          setResultVal("Error has occured! Check console.");
          console.log(response.data.error)
        } else {
          setResultVal("Successfully sent!");
          setInputVal("");
        }
        setIsLoaded(true);
      }).catch(err => {
        setResultVal("Error has occured! Check console.");
        console.log(err);
        setIsLoaded(true);
      })
    } else {
      setResultVal("Invalid email address.");
    }

  }

  return (
    <main style={pageStyles}>
      <Loader loaded={isLoaded} lines={13} length={20} width={10} radius={30}
        corners={1} rotate={0} direction={1} color="#000" speed={1}
        trail={60} shadow={false} hwaccel={false} className="spinner"
        zIndex={2e9} top="50%" left="50%" scale={1.00}
        loadedClassName="loadedContent" />
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
      <div style={resultOut}>{resultVal}</div>
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

const resultOut = {
  fontSize: 20,
  marginTop: 15,
  textAlign: "center"
}

export default IndexPage
