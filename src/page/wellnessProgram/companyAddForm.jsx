import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../config";
import axios from 'axios';

const CustomerAddForm = () => {

    useEffect(() => {
        let isAdmin = ['admin'].includes(localStorage.getItem('roles'));
            
        // If roles is not admin, redirect to dashboard page
        if (!isAdmin) {
            window.location = window.location.origin + '/membership';
            return false;
        }
    });

    const [customerForm, setCustomerForm] = useState({
        companyName: "",
        personInCharge: "",
        email: "",
        typeOfCompany: "",
        invitedBy: localStorage.getItem('user-name'),
        inviterEmail: localStorage.getItem('email')
    });
    const [loading, setLoading] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const addNewCompany = () => {
        axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: `${BASE_URL}/user/invite/company`, //your url
            method: 'post',
            data: customerForm
        }).then((res, err) => {
            navigate('/wellnessprogram');
            setLoading(false);
        }).catch(err => {
            if (err?.response?.data?.message) {
                setError(err?.response?.data?.message);
                setTimeout(() => {
                    setError('');
                }, 3000);
            }
        });
    };

    return (
        <>
            <div className="bg-theme-blue h-screen">
                <div className="text-gray-400 text-center text-2xl font-semibold pt-12">Company Invite</div>
                <div className="flex items-center justify-center pt-8">
                    <form style={{ zIndex: '80000' }} className="w-[40vw]" action="#" method="POST">
                        <input type="hidden" name="remember" value="true" />
                        <div className="rounded-md shadow-sm">
                            <div className="my-2">
                                <label htmlFor="companyName" className="sr-only">Company Name</label>
                                <input
                                    value={customerForm?.companyName}
                                    onChange={(e) => setCustomerForm({ ...customerForm, companyName: e.target.value })}
                                    id="companyName"
                                    name="companyName"
                                    type="text"
                                    className="bg-theme-blue autofill:bg-slate-800 relative block w-full appearance-none border border-gray-500 px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                                    className="bg-theme-blue autofill:bg-slate-800 relative block w-full appearance-none border border-gray-500 px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                                    className="bg-theme-blue autofill:bg-slate-800 relative block w-full appearance-none border border-gray-500 px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                                    className="bg-theme-blue autofill:bg-slate-800 relative block w-full appearance-none border border-gray-500 px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Type of company"
                                />
                            </div>
                        </div>
                    </form>
                </div>
                <div className="flex justify-center text-red-500">{error}</div>
                <div className="my-6 flex justify-center">
                    <button onClick={() => addNewCompany()} type="button" className="button-theme font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                        {loading && (
                            <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-gray-200 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                            </svg>
                        )}
                        INVITE
                    </button>
                    <button onClick={() => navigate('/wellnessprogram')} type="button" className="button-theme font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                        CANCEL
                    </button>
                </div>
            </div>
        </>
    )
}
export default CustomerAddForm;