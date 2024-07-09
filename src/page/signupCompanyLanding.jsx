import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from "../config";
import axios from 'axios';

const CompanySignUpLanding = () => {
    const [customerForm, setCustomerForm] = useState({
        companyName: "",
        personInCharge: "",
        email: "",
        typeOfCompany: "",
    });
    const [showInvalidLink, setShowInvalidLink] = useState(false);
    const [loading, setLoading] = useState('');
    const [submitLoading, setSubmitLoading] = useState('');
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState('Password should not be empty');
    const [confirmPasswordError, setConfirmPasswordError] = useState('Confirm password should not be empty');
    const [formTouched, setFormTouched] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setCustomerForm({ ...customerForm, password: value });

        if (!passwordRegex.test(value)) {
            setPasswordError('Password must contain at least one digit, one lowercase letter, one uppercase letter, and be at least 8 characters long.');
        } else {
            setPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (event) => {
        const value = event.target.value;
        setCustomerForm({ ...customerForm, confirmPassword: value });
        console.log(customerForm?.password, '--------', value);
        if (customerForm?.password !== value) {
            setConfirmPasswordError('Confirm password must match password');
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleLoginSubmit = (event) => {
        setFormTouched(true);
        if (passwordError || confirmPasswordError || !customerForm?.companyName || !customerForm?.personInCharge || !customerForm?.typeOfCompany) {
            return;
        };
        setError("");
        setSubmitLoading(true);
        axios({
            url: `${BASE_URL}/auth/add/company`, //your url
            method: 'POST',
            data: customerForm
        }).then((res) => {
            setSubmitLoading(false);
            setTimeout(() => {
                navigate('/');
            }, 200);
        }).catch((err) => {
            if (err?.response?.data?.message) {
                setError(err?.response?.data?.message);
                setTimeout(() => {
                    setError("");
                }, 3000);
            }
            setSubmitLoading(false);
        });
    };

    useEffect(() => {

    }, []);

    return (
        <>
            <div className="bg-theme-blue h-screen">
                <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-40" style={{ height: '550px' }}>
                    {loading && (
                        <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                            <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    )}
                    {!loading && <> {showInvalidLink ? (
                        <p className="text-red-500">Invalid Link</p>
                    ) : (
                        <div className="w-full max-w-md my-8">
                            <div className="flex justify-center">
                                <img style={{ height: "160px" }} src={require('../assets/logo-lg.png')} alt="logo" />
                            </div>
                            <div className="text-center text-lg font-semibold text-gray-400">Company Sign Up</div>
                            <div className="flex items-center justify-center py-8">
                                <form style={{ zIndex: '80000' }} className="md:w-[40vw] w-[80vw]" action="#" method="POST">
                                    <input type="hidden" name="remember" value="true" />
                                    <div className="rounded-md">
                                        <div className="my-2">
                                            <label htmlFor="companyName" className="sr-only">Company Name</label>
                                            <input
                                                value={customerForm?.companyName}
                                                onChange={(e) => setCustomerForm({ ...customerForm, companyName: e.target.value })}
                                                id="companyName"
                                                name="companyName"
                                                type="text"
                                                className="bg-theme-blue autofill:bg-slate-800 relative block w-full appearance-none border border-[#2d3d5c] px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                placeholder="Company Name"
                                            />
                                        </div>
                                        <div className="my-2">
                                            <label htmlFor="personInCharge" className="sr-only">Name of the person in charge</label>
                                            <input
                                                value={customerForm?.personInCharge}
                                                onChange={(e) => setCustomerForm({ ...customerForm, personInCharge: e.target.value })}
                                                id="personInCharge"
                                                name="personInCharge"
                                                type="text"
                                                className="bg-theme-blue autofill:bg-slate-800 relative block w-full appearance-none border border-[#2d3d5c] px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                placeholder="Name of the person in charge"
                                            />
                                        </div>
                                        <div className="my-2">
                                            <label htmlFor="email-address" className="sr-only">Email</label>
                                            <input
                                                value={customerForm?.email}
                                                onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                                                id="email-address"
                                                name="email"
                                                type="email"
                                                required
                                                className="bg-theme-blue autofill:bg-slate-800 relative block w-full appearance-none border border-[#2d3d5c] px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                placeholder="Email"
                                            />
                                        </div>
                                        <div className="my-2">
                                            <label htmlFor="typeOfCompany" className="sr-only">Type of company</label>
                                            <input
                                                value={customerForm?.typeOfCompany}
                                                onChange={(e) => setCustomerForm({ ...customerForm, typeOfCompany: e.target.value })}
                                                id="typeOfCompany"
                                                type="text"
                                                required
                                                className="bg-theme-blue autofill:bg-slate-800 relative block w-full appearance-none border border-[#2d3d5c] px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                placeholder="Type of company"
                                            />
                                        </div>
                                        <ul class="text-sm font-medium text-center text-gray-500 border border-gray-600 divide-x divide-gray-500 shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
                                            <span class="w-full">
                                                <span
                                                    onClick={() => setCustomerForm({
                                                        ...customerForm,
                                                        gender: 'male',
                                                    })}
                                                    className={`cursor-pointer ${(customerForm?.gender === 'male') && 'bg-theme-blue text-gray-300'} inline-block w-full p-4 dark:bg-gray-700 dark:text-white`}
                                                >
                                                    Male
                                                </span>
                                            </span>
                                            <span class="w-full">
                                                <span
                                                    onClick={() => setCustomerForm({
                                                        ...customerForm,
                                                        gender: 'female',
                                                    })}
                                                    className={`cursor-pointer ${(customerForm?.gender === 'female') && 'bg-theme-blue text-gray-300'} inline-block w-full p-4 rounded-r-lg hover:text-gray-700 hover:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700`}
                                                >
                                                    Female
                                                </span>
                                            </span>
                                        </ul>
                                        <div className="my-2">
                                            <label htmlFor="password" className="sr-only">Password</label>
                                            <input
                                                value={customerForm?.password}
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
                                                value={customerForm?.confirmPassword}
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
                                    </div>
                                </form>
                            </div>
                            <div className="mx-4 text-gray-400">
                                By signing up you declare you have read and agreed with our
                                <a href="https://beta.contingentfitness.com/terms-and-conditions/" className="font-medium text-blue-600 dark:text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer"> Terms and Conditions</a> and
                                <a href="https://beta.contingentfitness.com/privacy-policy/" className="font-medium text-blue-600 dark:text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer"> Privacy Policy</a>.
                            </div>
                            <div className="text-red-500 pt-2 text-center h-8">{error}</div>
                            <div className="flex justify-center">
                                <button onClick={() => handleLoginSubmit()} type="button" className="group relative flex w-40 justify-center rounded-md border border-transparent bg-[#4285F4] py-2 px-4 text-sm font-medium text-white hover:bg-[#4285F4] focus:outline-none">
                                    {loading ? (<div className="lds-facebook"><div></div><div></div><div></div><div></div><div></div></div>) : "Register"}
                                </button>
                            </div>
                        </div>
                    )}
                    </>
                    }
                </div >
            </div >
        </>
    )
}
export default CompanySignUpLanding;