import { React, useState, useEffect } from "react"
import Logo from "../../assets/images/cftLogo.svg"
import loginImg from "../../assets/images/loginImg.png"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { BASE_URL } from "../../config"
import axios from "axios";
const Forgot = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState('');
  const [loading, setLoading] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const handleLoginSubmit = (event) => {
    setError("");
    setLoading(true);
    axios({
      url: `${BASE_URL}/auth/reset/password/link`, //your url
      method: 'POST',
      data: {
        "email": email
      }
    }).then((res) => {
      setSuccess(true);
      setLoading(false);
      setName(res?.data?.data?.name);
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

  useEffect(() => {
    let isLogin = localStorage.getItem('auth-token');
    if (isLogin && location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [location]);
  return (
    <>
      <div className="sign-in-default">
        <div className="bg-icons" />
        <div className="container">
          <div className="logo">
            <img src={Logo} alt="logo" />
          </div>
          <div className="form-box-outer">
        {success?(
          <div className="mail-sent-popup">
          <div className="mail-sent-inner">
              <div className="success-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-10 h-10">
                      <path stroke-linecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
              </div>
              <div className="content-box">
                  <p>Hello {name}, </p>
                  <p>Your have recieved reset password link on your email.</p>
                  <p>Please check your email.</p>
              </div>
              <div className="submit-box">
                <button type="button" className="" onClick={()=>{navigate("/")}}>
                    Continue
                </button>
              </div>
          </div>
        </div>
      ):(  <div className="form-box">
              <h1>Forgot Password</h1>
              <form>
                <div className="input-box">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email address"
                  />
                  <span className="error">{error}</span>
                </div>
                <div className="submit-box">
                  <button onClick={() => handleLoginSubmit()} type="button" className="group relative flex w-40 justify-center rounded-md border border-transparent bg-[#4285F4] py-2 px-4 text-sm font-medium text-white hover:bg-[#4285F4] focus:outline-none">
                    {loading ? (<div className="lds-facebook"><div></div><div></div><div></div><div></div><div></div></div>) : "Send Reset Link"}
                  </button>
                </div>
                <div className="bottom-text text-center">
                  Back to <Link to="/">Login</Link>
                </div>
                <div className="bottom-text text-center">
                  Don’t have an accounts? <Link to="/sign-up">Signup here !</Link>
                </div>
              </form>
            </div>)}  
        
            <div className="img-right">
              <img src={loginImg} alt="Image" />
            </div>
          </div>
        </div>
      </div>
    </>)
}
export default Forgot;