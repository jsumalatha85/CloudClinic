import React from "react";
import { NavLink } from "react-router-dom";

function Footer(props) {
  return (
    <div className="footer">
      {/* <section> */}
      <footer
        className="text-center text-white"
        style={{ backgroundColor: "#0a4275" }}
      >
        <div
          className="text-center p-3"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        >
          Copyright © 2022 &nbsp;
          <NavLink className="text-light text-decoration-none" to="/">
            SMV HealthCare Private Limited
          </NavLink>
        </div>
      </footer>
      {/* </section> */}
    </div>
  );
}

export default Footer;
