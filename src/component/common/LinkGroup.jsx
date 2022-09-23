import React from "react";
import { Link, useLocation } from "react-router-dom";

function LinkGroup({ to, className, title, onClick }) {
  const location = useLocation();
  // console.log(location.pathname, "useLocation");
  return (
    <ul className="list-group">
      <Link
        to={to}
        className={
          location.pathname === to
            ? "list-group-item list-group-item-action active"
            : "list-group-item list-group-item-action "
        }
        aria-current="true"
        onClick={onClick}
      >
        {title}
      </Link>
    </ul>
  );
}

export default LinkGroup;
