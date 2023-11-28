import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./component.css";
import { TbReportSearch } from "react-icons/tb";
import { RxDashboard } from "react-icons/rx";
import { IoIosCreate } from "react-icons/io";
function Tab_navbar() {
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-auto min-vh-100 tab-bg">
            <ul className="list-unstyled" id="iconsbar">
              <li className="text-center">
                <NavLink to="home" className="fs-2">
                  <div>
                    <IoIosCreate />
                    <p style={{ fontSize: "10px" }}>Create</p>
                  </div>
                </NavLink>
              </li>
              <li className="text-center">
                <NavLink to="showdetails" className="fs-2">
                  <div>
                    <RxDashboard />
                    <p style={{ fontSize: "10px" }}>Dashboard</p>
                  </div>
                </NavLink>
              </li>
              <li className="text-center">
                <NavLink to="modules" className="fs-2">
                  <div>
                    <TbReportSearch />
                    <p style={{ fontSize: "10px" }}>Report</p>
                  </div>
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="col p-0 m-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tab_navbar;
