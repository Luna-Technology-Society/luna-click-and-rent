import React, { useState } from "react";
import axios from 'axios';
import "../styles/index.css"
import RingLoader from "react-spinners/RingLoader";

// markup
const IndexPage = () => {
  const [inputVal, setInputVal] = useState("");
  const [resultVal, setResultVal] = useState("");
  const [isLoaded, setIsLoaded] = useState(true);

  const handleChange = (e) => {
    setInputVal(e.target.value);
  }

  const handleClick = () => {
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
          setResultVal("Error has occured!\n" + response.data.error.message ? response.data.error.message : "");
          console.log(response.data.error)
        } else {
          setResultVal("Successfully sent!");
          setInputVal("");
        }
        setIsLoaded(true);
      }).catch(err => {
        setResultVal("Error has occured!\n" + err.message ? err.message : "");
        console.log(err);
        setIsLoaded(true);
      })
    } else {
      setResultVal("Invalid email address.");
    }

  }

  const handleKeyDown = (e) => {
    if (e.keyCode == 13) {
      handleClick();
    }
  }

  return (
    <main style={mainContainer}>
      <div style={pageStyles}>
        {isLoaded ? (
          <>
            <title>Click and rent</title>
            <h1 style={headingStyles}>
              Please enter your email to receive the code.
            </h1>
            <label style={emailLabel} name="email">Your email</label>
            <br />
            <input style={emailInput} value={inputVal} onChange={handleChange} name="email" placeholder="johndoe@gmail.com" type="email" onKeyDown={handleKeyDown} />
            <br />
            <button type="submit" style={emailButton} onClick={handleClick}>
              Generate
            </button>
            <div style={resultVal === "Successfully sent!" ? { ...resultOut, color: "#1daf0f" } : resultOut}>{resultVal}</div>
          </>
        ) : (
          <>
            <RingLoader color={'black'} loading={!isLoaded} size={100} css={spinnerStyle} />
            <h2 style={{ marginTop: 30, textAlign: "center" }}>Loading...</h2>
          </>
        )}

      </div>
    </main>
  )
}

const spinnerStyle = `
display: block;
margin: 0 auto;
border-color: red;
position: absolute;
top: 50%;
left: 50%;
`;

const mainContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100vw"
}

const pageStyles = {
  color: "#232129",
  padding: "5%",
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
  maxWidth: 380,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  postiion: 'relative'
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
  textAlign: "center",
  color: "#d8080c"
}

export default IndexPage
