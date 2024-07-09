import { React, useEffect, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import Logo from "../../assets/images/cftLogo.svg"
import loginImg from "../../assets/images/loginImg.png"
import axios from "axios";
import { BASE_URL } from "../../config";
import moment from "moment";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
const SignUp = () => {
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dob: "",
    coupon: "",
    roles: "user"
  });
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const handleLoginSubmit = (event) => {
    if (!userForm?.firstName || !userForm?.lastName || !userForm?.email || !userForm?.password || !userForm?.confirmPassword || !userForm?.dob) {
      setShowError(true);
      setTimeout(function () {
        setErrorMessage('');
        setShowError(false);
      }, 4000);
      return;
    }

    if (userForm.password !== userForm.confirmPassword) {
      setPasswordMatch(false);
      return;
    } else {
      setPasswordMatch(true);
    }

    setError("");
    setLoading(true);
    axios({
      url: `${BASE_URL}/auth/signup`, //your url
      method: 'POST',
      data: userForm
    }).then((res) => {
      setLoading(false);
      setTimeout(() => {
        navigate(`/sign-up/success/${userForm?.firstName}`);
      }, 200);
    }).catch((err) => {
      if (err?.response?.data?.message) {
        setError(err?.response?.data?.message);
        setTimeout(() => {
          setError("");
        }, 3000);
      }
      setLoading(false);
    });
  };

  const handleConfirmPasswordChange = (e) => {
    setUserForm({ ...userForm, confirmPassword: e.target.value });
    if (e.target.value !== userForm.password) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  };

  const validateEmails = (e) => {
    setUserForm({ ...userForm, email: e.target.value });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(e.target.value.trim())) {
      setErrorMessage('Invalid email address.');
      setTimeout(function () {
        setErrorMessage('');
        setShowError(false);
      }, 4000);
      return false;
    }
    return true;
  };

  useEffect(() => {
    let isLogin = localStorage.getItem('auth-token');
    if (!isLogin && !(location.pathname === '/' || location.pathname === '/sign-up')) {
      navigate('/');
    } else if (isLogin && location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [location]);
  return (
    <>
      <div className="sign-up-page sign-in-default">
        <div className="bg-icons" />
        <div className="container">
          <div className="logo">
            <img src={Logo} alt="logo" />
          </div>
          <div className="form-box-outer">
            <div class="form-box">
              <h1>Sign Up</h1>
              <div class="input-box">
                <input
                  value={userForm?.firstName}
                  onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                />
              </div>
              <div class="input-box">
                <input
                  value={userForm?.lastName}
                  onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                />

              </div>
              <div class="input-box">
                <input
                  value={userForm?.email}
                  onChange={validateEmails}
                  id="email-address"
                  type="email"
                  required
                  placeholder="Email address"
                />

              </div>
              <div class="input-box">   <input
                value={userForm?.dob}
                onChange={(e) => setUserForm({ ...userForm, dob: e.target.value })}
                id="password"
                name="password"
                type="date"
                autoComplete="current-password"
                max={moment().subtract(10, 'years').format('YYYY') + '-12-31'}
                min={moment().subtract(100, 'years').format('YYYY') + '-12-31'}
                required
                placeholder="DOB"
              />
              </div>
              <div class="input-box">
                <input
                  value={userForm?.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  id="password"
                  type={!showPass?'password':'text'}
                  required
                  placeholder="Password"
                />
                   <span className="input-icon" onClick={()=>{setShowPass(!showPass)}} >
                  {!showPass?<EyeIcon class="h-6 w-6 text-gray-500" />: <EyeSlashIcon class="h-6 w-6 text-gray-500" />}
                </span>
              </div>
              <div class="input-box">
                <input
                  value={userForm?.confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  id="confirmPassword"
                  type={!showConfPass?'password':'text'}
                  required
                  placeholder="Confirm Password"
                />
                 <span className="input-icon" onClick={()=>{setShowConfPass(!showConfPass)}} >
                  {!showConfPass?<EyeIcon class="h-6 w-6 text-gray-500" />: <EyeSlashIcon class="h-6 w-6 text-gray-500" />}
                </span>
              </div>
              <div class="input-box">
                <input
                  value={userForm?.coupon}
                  onChange={(e) => setUserForm({ ...userForm, coupon: e.target.value })}
                  id="coupon"
                  name="coupon"
                  type="text"
                  placeholder="Coupon Code"
                />
              </div>

              <div class="bottom-text">
              {showError && <p className="text-red-500 my-2">Fields with star (*) are required.</p>}
                <span className="error">{errorMessage}</span>
                {!passwordMatch && <p className="text-red-500 my-2">Passwords do not match</p>}
                <div class="green-clr">Apply Coupon code if you have any.</div>
                By signing up you declare you have read and agreed with our <Link to="/">Terms and Conditions</Link> and <Link to="/">Privacy Policy</Link>


              </div>

              <div class="submit-box">
              <button onClick={() => handleLoginSubmit()} type="button" className="group relative flex w-40 justify-center rounded-md border border-transparent bg-[#4285F4] py-2 px-4 text-sm font-medium text-white hover:bg-[#4285F4] focus:outline-none">
                                    {loading ? (<div className="lds-facebook"><div></div><div></div><div></div><div></div><div></div></div>) : "Sign Up"}
                                </button>
              </div>

              <div class="bottom-text text-center black-clr">
                If you already have an account  <br />
                You can <Link to="/">Login here !</Link>
              </div>
            </div>
            <div className="img-right">
              <img src={loginImg} alt="Image" />
            </div>
          </div>
        </div>
      </div>
    </>)
}
export default SignUp;