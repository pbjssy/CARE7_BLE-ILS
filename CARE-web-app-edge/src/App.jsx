import React from "react"
import { BrowserRouter, Routes, Route  } from "react-router-dom"
import Home from "./pages/Home"
import Contributors from "./pages/Contributors"
import ContactUs from "./pages/ContactUs"
import Team1B from "./pages/Team1B"
import Team1F from "./pages/Team1F"
import Team1H from "./pages/Team1H"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Home />}/>
          <Route path = "/home" element = {<Home />}/>
          <Route path = "/contributors" element = {<Contributors />}/>
          <Route path = "/contact-us" element = {<ContactUs />}/>
          <Route path = "/nec-project" element = {<Team1B />}/>
          <Route path = "/ble-project" element = {<Team1F />}/>
          <Route path = "/pub-project" element = {<Team1H />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
