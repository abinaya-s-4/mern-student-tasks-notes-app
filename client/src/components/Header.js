import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Header({ onLogout }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <header className="main-header">
      <nav>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/add" className="nav-link">Add Note</Link>
        <button className="nav-btn" onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
}

export default Header;
