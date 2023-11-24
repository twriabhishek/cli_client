import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMail } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { CiFacebook } from "react-icons/ci";
import { AiFillTwitterCircle } from "react-icons/ai";
import { AiFillGoogleCircle } from "react-icons/ai";

function Login() {
  let navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState();
  const [Login, setLogin] = useState({
    email: "",
    password: "",
  });

  const ChangeFields = (e) => {
    const value = e.target.value;
    setLogin({ ...Login, [e.target.name]: value });
  };

  //Login the button
  const handleLogin = async (e) => {
    e.preventDefault();
    navigate("/navbar/showDetails");
  };

  return (
    <>
      <div id="LoginBox">
        <div className="container-fluid">
          <div className="row">
            <div id="sendMailpage" className="pt-4 m-auto">
              <div className="container sendMail" id="sendMailBox">
                <form onSubmit={handleLogin}>
                  <h4 className="text-center mb-2 text-black" style={{paddingBottom: "5px"}}> Login </h4>
                  {/* Show the Error message */}
                  {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                      {errorMessage}
                    </div>
                  )}

                  <div className="row d-flex justify-content-center align-item-center">
                    <div className="col-md-10">
                      <label htmlFor="email" className="form-label text-black">
                        Enter Your Email
                      </label>
                      <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">
                          <AiOutlineMail />
                        </span>
                        <input
                          required
                          type="email"
                          name="email"
                          value={Login.email}
                          onChange={ChangeFields}
                          class="form-control"
                          id=""
                          aria-describedby="helpId"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row d-flex justify-content-center align-item-center">
                    <div className="col-md-10 mb-3">
                      <label htmlFor="" className="form-label text-black" >
                        Password
                      </label>
                      <div className="input-group ">
                        <span className="input-group-text" id="basic-addon1">
                          <FaUserCircle />
                        </span>
                        <input
                          required
                          type="password"
                          name="password"
                          value={Login.password}
                          onChange={ChangeFields}
                          class="form-control"
                          id=""
                          aria-describedby="helpId"
                          placeholder=""
                        />
                      </div>
                      <Link className="mb-3" style={{ color: "blue" }} to="">
                        Forget the password?
                      </Link>
                    </div>
                  </div>

                  <div className="mb-3 d-flex justify-content-center" style={{marginTop: "29px"}}>
                    <button className="btn btn-danger">Login Here</button>
                  </div>

                  <div className="SignUp d-flex justify-content-center">
                    <p className="text-black">
                      Not a member?{" "}
                      <Link to="" style={{ color: "blue" }}>
                        Sign Up{" "}
                      </Link>
                    </p>
                  </div>
                  <div style={{marginTop:"75px"}}>
                    <div className="txt1 text-center">
                      <span className="text-black">Or Sign Up Using</span>
                    </div>

                    <div className="d-flex justify-content-center">
                      <a href="#" className="login100-social-item bg1">
                        <CiFacebook />
                      </a>

                      <a href="#" className="login100-social-item bg2">
                        <AiFillTwitterCircle />
                      </a>

                      <a href="#" className="login100-social-item bg3">
                        <AiFillGoogleCircle />
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
