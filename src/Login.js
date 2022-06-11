import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "./context/AuthProvider";

import axios from './api/axios';
import './Login.css';
import { Link } from 'react-router-dom';
const LOGIN_URL = '/auth';

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ user, pwd, roles, accessToken });
            setUser('');
            setPwd('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>You are logged in!</h1>
                    <br />
                    <p>
                        <a href="#">Go to Home</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

                    <div class="forms">
                        <div class="form login">
                            <span class="title">Login</span>

                            <form onSubmit={handleSubmit}>
                                <div class="input-field">
                                    <input
                                        type="text"
                                        placeholder="Enter your email"
                                        ref={userRef}
                                        autoComplete="off"
                                        onChange={(e) => setUser(e.target.value)}
                                        value={user}
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
                                        onChange={(e) => setUser(e.target.value)}
                                        value={user}
                                        required
                                    />
                                    <i class="uil uil-lock icon"></i>
                                    <i class="uil uil-eye-slash showHidePw"></i>
                                </div>

                                <div class="checkbox-text">
                                    <div class="checkbox-content">
                                        <input type="checkbox" id="logCheck" />
                                        <label for="logCheck" class="text">Remember me</label>
                                    </div>
                                    
                                    <a href="recover.html" class="text">Forgot password?</a>
                                </div>

                                <div class="input-field button">
                                    <input type="button" value="Login Now" />
                                </div>
                            </form>

                            <div class="login-signup">
                                <span class="text">Not a member?
                                    <Link to="/register">Create Account</Link>
                                </span>
                            </div>
                        </div>
                    
                    </div>
                </section>
            )}
        </>
    )
}

export default Login
