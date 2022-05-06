import * as React from "react"

// styles
const pageStyles = {
  color: "#232129",
  padding: 96,
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
  backgroundColor: "orange"
}

// markup
const IndexPage = () => {
  return (
    <form style={pageStyles} method="POST">
      
      <title>Click and rent</title>
      <h1 style={headingStyles}>
        Please enter your email to receive the code.
      </h1>
      <label style={emailLabel} name="email">Your email</label>
      <br />
      <input style={emailInput} name="email" placeholder="johndoe@gmail.com" type="email" />
      <br />
      <button type="submit" style={emailButton}>
        Generate
      </button>
    </form>
  )
}

export default IndexPage
