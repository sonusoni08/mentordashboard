import React from 'react'
import './NavBar.css'
import { Link } from "react-router-dom";

function NavBar(props) {
  return (
    <div>
      <nav className="nav">
        <Link className = "nav-mentor logo">Mentor{props.id}</Link>
        <Link to = "/" className = "nav-mentor logo">Signout</Link>
      </nav>
    </div>
  )
}

export default NavBar