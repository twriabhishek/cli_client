import React from "react";
import { FiUserPlus } from "react-icons/fi";
import { RxUpdate } from "react-icons/rx";
import { AiFillDelete } from "react-icons/ai";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

const UserModule = (e) => {
  return (
    <>
      <div
        id="recording"
        className="pt-2 text-center"
        style={{ minHeight: "100vh" }}
       >
        <div className="container pt-5">
          <div className="row d-flex justify-content-between">
            <div
              id="mycolumn"
              className="col-md-3 mb-3 col-sm-12 col-lg-3 mycolumn"
             >
              <Link to="adduserform" className="mycolumn">
                <div
                  className="recordingBox"
                  style={{ backgroundColor: "rgb(145, 42, 42)" }}
                >
                  <span className="mx-2 text-center text-warning fs-4">
                    <FiUserPlus />
                  </span>
                  Add User
                </div>
              </Link>
            </div>

            <div className="col-md-3 mb-3 col-sm-12 col-lg-3">
              <Link to="addrole" className="mycolumn">
                <div
                  className="recordingBox"
                  style={{ backgroundColor: "rgb(145, 42, 42)" }}
                >
                  <span className="mx-2 text-center text-warning fs-4">
                    <RxUpdate />                    
                  </span>
                  Add Role
                </div>
              </Link>
            </div>

            <div className="col-md-3 mb-3 col-sm-12 col-lg-3">
              <Link to="deleteuserform" className="mycolumn">
                <div
                  className="recordingBox"
                  style={{ backgroundColor: "rgb(145, 42, 42)" }}
                >
                  <span className="mx-2 text-center text-warning fs-4">
                    <AiFillDelete />
                  </span>
                  Delete User
                </div>
              </Link>
            </div>
          </div>
          <hr />
          <div className="col">
            <Outlet />
            </div>
          </div>
        </div>
    </>
  );
};

export default UserModule;
