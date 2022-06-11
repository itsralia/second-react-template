import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import "./Register.css";

import axios from "./api/axios";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/register";

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // TODO: remove console.logs before deployment
      console.log(JSON.stringify(response?.data));
      //console.log(JSON.stringify(response))
      setSuccess(true);
      //clear state and controlled inputs
      setUser("");
      setPwd("");
      setMatchPwd("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="#">Sign In</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <div class="forms">
            <div class="form signup">
              <span class="title">Create An Account</span>
              <p>Fill in all necessary details to proceed</p>

              <form onSubmit={handleSubmit}>
                <div class="input-field">
                  <input
                    type="text"
                    placeholder="Enter your Name"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                    name="firstName"
                    required
                  />
                  <i class="uil uil-user"></i>
                </div>

                <div class="input-field">
                  <input
                    type="text"
                    placeholder="Enter your email"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    name="email"
                    required
                  />
                  <i class="uil uil-envelope icon"></i>
                </div>
                <div class="input-field">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    class="password"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                  />
                  <i class="uil uil-lock icon"></i>
                </div>
                <div class="input-field">
                  <input
                    type="password"
                    placeholder="Confirm password"
                    class="password"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    required
                  />
                  <i class="uil uil-lock icon"></i>
                  <i class="uil uil-eye-slash showHidePw"></i>
                </div>

                <div class="checkbox-text">
                  <div class="checkbox-content">
                    <input type="checkbox" id="sigCheck" />
                    <label for="sigCheck" class="text">
                      Remember me
                    </label>
                  </div>

                  <a href="recover.html" class="text">
                    Forgot password?
                  </a>
                </div>

                <div class="input-field button">
                  <a href="">
                    <input class="but" type="button" value="Create Account" />
                  </a>
                </div>
              </form>
              <div class="checkbox-content">
                <input type="checkbox" id="sigCheck" />
                <label for="sigCheck" class="text">
                  I have read and agreed to Growthsquare's{" "}
                  <a href="#">Privacy Policy</a> &{" "}
                  <a href="#">Terms and conditions</a>
                </label>
              </div>

              <div class="login-signup">
                <span class="text">
                  Already have an account?
                  <Link to="/login" class="text login-link">
                    Log in
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Register;
