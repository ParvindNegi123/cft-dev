import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { BASE_URL } from "../../config";
import axios from 'axios';

const ResetPassword = () => {
    const [userForm, setUserForm] = useState({
        password: "",
        confirmPassword: ""
    });
    const [name, setName] = useState('');
    const [loading, setLoading] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('Password should not be empty');
    const [confirmPasswordError, setConfirmPasswordError] = useState('Confirm password should not be empty');
    const [formTouched, setFormTouched] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    const passwordChangeSubmit = (event) => {
        setError("");
        setLoading(true);
        axios({
            url: `${BASE_URL}/auth/reset/password`, //your url
            method: 'POST',
            data: {
                token: params?.token,
                password: userForm?.password
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

    const verifyToken = (event) => {
        setError("");
        setLoading(true);
        axios({
            url: `${BASE_URL}/auth/verify/password/token/${params?.token}`, //your url
            method: 'get',
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

    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setUserForm({ ...userForm, password: value });

        if (!passwordRegex.test(value)) {
            setPasswordError('Password must contain at least one digit, one lowercase letter, one uppercase letter, and be at least 8 characters long.');
        } else {
            setPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (event) => {
        const value = event.target.value;
        setUserForm({ ...userForm, confirmPassword: value });
        if (userForm?.password !== value) {
            setConfirmPasswordError('Confirm password must match password');
        } else {
            setConfirmPasswordError('');
        }
    };

    useEffect(() => {
        let isLogin = localStorage.getItem('auth-token');
        if (isLogin && location.pathname === '/') {
            navigate('/dashboard');
        }
    }, [location]);

    return (
        <>
            <div className="bg-theme-blue h-screen">
                <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ height: '550px' }}>
                    {success ? (
                        <div className="">
                            <div className="md:w-[100%] bg-theme-blue-secondary p-10 pb-20">
                                <div className="flex justify-center text-green-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-10 h-10">
                                        <path stroke-linecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                    </svg>
                                </div>
                                <div className="text-gray-300">
                                    <div className="text-md m-10">
                                        Your has been reset successfully.
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <button onClick={() => navigate('/')} type="button" className="group relative flex w-40 justify-center rounded-md border border-transparent bg-[#4285F4] py-2 px-4 text-sm font-medium text-white hover:bg-[#4285F4] focus:outline-none">
                                        Continue
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full max-w-md my-8">
                            <div className="flex justify-center">
                                <img style={{ height: "160px" }} src={require('../../assets/logo-lg.png')} />
                            </div>
                            <p className="text-center mb-10 font-bold text-gray-400 truncate dark:text-white">
                                RESET PASSWORD
                            </p>
                            <form style={{ zIndex: '80000' }} className="">
                                <div className="my-2">
                                    <label htmlFor="password" className="sr-only">Password</label>
                                    <input
                                        value={userForm?.password}
                                        onChange={(e) => handlePasswordChange(e)}
                                        id="password"
                                        type="password"
                                        required
                                        className="bg-theme-blue autofill:bg-slate-800 relative block w-full appearance-none border border-[#2d3d5c] px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Confirm Password"
                                    />
                                    {formTouched && <span className="text-red-500">{passwordError}</span>}
                                </div>
                                <div className="my-2">
                                    <label htmlFor="password" className="sr-only">Confirm Password</label>
                                    <input
                                        value={userForm?.confirmPassword}
                                        onChange={(e) => handleConfirmPasswordChange(e)}
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="bg-theme-blue autofill:bg-slate-800 relative block w-full appearance-none border border-[#2d3d5c] px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Confirm Password"
                                    />
                                    {formTouched && <span className="text-red-500">{confirmPasswordError}</span>}
                                </div>
                            </form>
                            <div className="flex justify-center mt-8">
                                <button onClick={() => passwordChangeSubmit()} type="button" className="group relative flex w-40 justify-center rounded-md border border-transparent bg-[#4285F4] py-2 px-4 text-sm font-medium text-white hover:bg-[#4285F4] focus:outline-none">
                                    {loading ? (<div className="lds-facebook"><div></div><div></div><div></div><div></div><div></div></div>) : "Reset Password"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
export default ResetPassword;