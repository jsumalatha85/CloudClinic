import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../auth/context";
import logo from "../../assests/logo.png";

export default function Navbar() {
  const { doctorID } = useContext(AuthContext);
  // console.log(doctorID);
  return (
    <nav className="navigation">
      <div className="brand-name">
        <Link to={doctorID ? "/doctorhomepage" : ""}>
          <img src={logo} className="main_logo" />
        </Link>
      </div>
      <button
        type="button"
        class="navbar-toggler"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
    </nav>
  );
}
