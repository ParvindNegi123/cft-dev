import { React, useEffect, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import "./SignIn.css"
import { BASE_URL } from "../../config"
import axios from "axios"
import Logo from "../../assets/images/cftLogo.svg"
import googleIcon from "../../assets/images/googleIcon.svg"
import fbIcon from "../../assets/images/fbIcon.svg"
import loginImg from "../../assets/images/loginImg.png"

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resStatus,setResStatus]=useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSubmit = (event) => {
    setEmail("");
    setLoading(true);
    axios({
      url: `${BASE_URL}/auth/signin`,
      method: "POST",
      data: { email, password },
    }).then((res) => { 
      setLoading(false);
  setResStatus(res?.status);    
      let data = res?.data?.data;
      localStorage.setItem('walkthough', JSON.stringify({ walkThroughPending: data?.walkThroughPending, walkThroughSteps: data?.walkThroughSteps }));
      localStorage.setItem('auth-token', data?.accessToken);
      localStorage.setItem('company', data?.company ? JSON.stringify(data?.company) : "");
      localStorage.setItem('user', JSON.stringify({ price: data?.price, userCount: data.userCount, userRange: data?.userRange, expectedCftUser: data?.expectedCftUser }));
      localStorage.setItem('roles', data?.roles);
      localStorage.setItem('user-name', (data?.firstName || data?.companyName) + ' ' + (data?.lastName || ''));
      localStorage.setItem('email', data?.email);
      localStorage.setItem('subscribedStatus', data?.subscribedStatus || false);
      localStorage.setItem('planType', data?.planType || '');
      localStorage.setItem('coupon', data?.coupon || '');
      localStorage.setItem('status', data?.status || '');
      setTimeout(() => {
        if (data?.walkThroughPending && data?.walkThroughSteps === '0') {
          if (data?.roles === 'user' && data?.company?.email) {
            navigate('/device');
          } else {
            navigate('/membership')
          }
        } else if (data?.walkThroughPending && data?.walkThroughSteps === '1') {
          navigate('/device');
        } else {
          navigate('/dashboard');
        }
      }, 200);
    }).catch((err) => {
      if (err?.response?.data?.message); {
        setError(err?.response?.data?.message);
        setResStatus(err?.response?.status)
        setTimeout(() => { setError("") }, 3000);
      } setLoading(false);
    })
  };
  useEffect(() => {
    let isLogin = localStorage.getItem('auth-token');
    if (!isLogin && !(location.pathname === '/' || location.pathname === '/sign-up')) {
      navigate('/');
    } else if (isLogin && location.pathname === "/") {
      navigate('/dashboard');
    }
  }, [location]);
  return (
    <>
      <div className="sign-in-page sign-in-default">
        <div className="bg-icons" />
        <div className="container">
          <div className="logo">
            <img src={Logo} alt="logo" />
          </div>
          <div className="form-box-outer">
            <div className="form-box">
              <h1>Log In</h1>
              <div className="input-box">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                />
                {resStatus===404&&( <span className="error">{error}</span>)}
               
              </div>
              <div className="input-box">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  type={!showPassword?'password':"text"}
                  autoComplete="current-password"
                  required
                  placeholder="Password"
                />
                <span className="input-icon" onClick={()=>{setShowPassword(!showPassword)}} >
                  {!showPassword?<EyeIcon class="h-6 w-6 text-gray-500" />: <EyeSlashIcon class="h-6 w-6 text-gray-500" />}
                </span>
                {resStatus===401&&( <span className="error">{error}</span>)}
              </div>
              <div className="link-box">
                <Link to="/forgot/password">Forgot Passowrd ?</Link>
              </div>
              <div className="submit-box">
                <button onClick={() => handleLoginSubmit()} type="button" className="group relative flex w-40 justify-center rounded-md border border-transparent bg-[#4285F4] py-2 px-4 text-sm font-medium text-white hover:bg-[#4285F4] focus:outline-none">
                  {loading ? (<div className="lds-facebook"><div></div><div></div><div></div><div></div><div></div></div>) : "Login"}
                </button>
              </div>
              <div className="continue-line">or continue with</div>
              <div className="social-media">
                <Link to="">
                  <img src={fbIcon} alt="Icon" />
                </Link>
                <Link to="/">
                  <img src={googleIcon} alt="Icon" />
                </Link>
              </div>
              <div className="bottom-text text-center">
                Don’t have an accounts? <Link to="/sign-up">Signup here !</Link>
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
export default SignIn;