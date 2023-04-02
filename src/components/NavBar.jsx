import React from 'react'
import './NavBar.css'
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <div>
      <nav className="nav">
        <Link to = "/mentor1" className = "nav-mentor logo">Mentor1</Link>
        <Link to = "/mentor2" className = "nav-mentor logo">Mentor2</Link>
      </nav>
    </div>
  )
}

export default NavBar