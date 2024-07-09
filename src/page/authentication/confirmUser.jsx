import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../config";

const ConfirmUser = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(true);
    const [name, setName] = useState('');

    const authenticateUser = () => {
        axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: `${BASE_URL}/auth/verify/signup/user`, //your url
            method: 'POST',
            data: { email: params?.email, token: params?.token }
        }).then((res) => {
            setName(res?.data?.data?.name);
            setLoading(false);
            setAuthenticated(true);
        }).catch((err) => {
            setLoading(false);
            setError('Verification Failed Please Try Again')
        });
    };

    useEffect(() => {
        authenticateUser();
    }, []);

    return (
        <div className="bg-theme-blue dark:bg-slate-900" style={{ height: '100vh' }}>
            <div className="flex items-center justify-center dark:border-gray-700 text-gray-200 h-[80vh]">
                <div>
                    {loading ? (
                        <div>
                            <div className="lds-facebook ml-[10px]">
                                <div></div><div></div><div></div><div></div><div></div>
                            </div>
                            <br />
                        </div>
                    ) : (
                        authenticated && (
                            <div className="">
                                <div className="md:w-[100%] bg-theme-blue-secondary p-10 pb-20">
                                    <div className="flex justify-center text-green-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-10 h-10">
                                            <path stroke-linecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                        </svg>
                                    </div>
                                    <div className="">
                                        <div className="text-md m-10">
                                            <div>Hello {name}, </div>
                                            Congratulations ! Your email has been verified successfully.
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <button onClick={() => navigate('/')} type="button" className="group relative flex w-40 justify-center rounded-md border border-transparent bg-[#4285F4] py-2 px-4 text-sm font-medium text-white hover:bg-[#4285F4] focus:outline-none">
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                    {error && <div className="text-red-500 text-lg">{error}</div>}
                </div>
            </div>
        </div>
    )
}
export default ConfirmUser;