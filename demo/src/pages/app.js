import React from "react"
import { Router } from "@reach/router"
import DoorLockBLE from "../components/access"
const App = () => {
  return (
      <Router basepath="/app">
        <DoorLockBLE path="/access/:door_access"/>
      </Router>
  )
}
export default App