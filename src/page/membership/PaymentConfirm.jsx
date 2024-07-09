import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BASE_URL } from "../../config";
import { useNavigate } from 'react-router-dom';

const PaymentConfirm = (props) => {
    const [paymentDetail, setPaymentDetail] = useState('');
    const [deviceStatus, setDeviceStatus] = useState(false);

    const navigate = useNavigate();
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);

    const [email, setEmail] = useState(localStorage.getItem('email'));
    const [loading, setLoading] = useState(false);

    const getDeviceStatus = () => {
        axios({
            headers: {
                "x-access-token": localStorage.getItem("auth-token"),
            },
            url: `${BASE_URL}/user/device/status`, //your url
            method: "GET",
        }).then((res) => {
            setDeviceStatus(res.data.isFitbitConnected || res?.data?.isGarminConnected);
        });
    };

    const checkUserSubscription = () => {
        setLoading(true);
        axios({
            url: `${BASE_URL}/auth/check-subscription`,
            method: "get",
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            }
        }).then((data) => {
            setPaymentDetail(data?.data);
            setLoading(false);
        });
    };

    useEffect(() => {
        getDeviceStatus();
        checkUserSubscription();
    }, []);

    const updateWalkthrough = (e) => {
        axios({
            headers: {
                "x-access-token": localStorage.getItem("auth-token"),
            },
            url: `${BASE_URL}/user/update/walkthrough`, //your url
            method: 'PUT',
            data: { walkThroughPending: true, walkThroughSteps: 1 }
        }).then((res) => {
            localStorage.setItem('walkthrough', JSON.stringify({ walkThroughPending: true, walkThroughSteps: 1 }))
        }).catch((err) => {
        });
    };

    const walkThroughPending = JSON.parse(localStorage.getItem('walkthrough'))?.walkThroughPending;

    return (
        <div className="flex justify-center bg-theme-blue dark:bg-slate-900 text-gray-200 h-[90vh]" >
            <div className="flex justify-center mb-8">
                {loading ? (
                    <div className="p-40">Processing...</div>
                ) : (
                    <div>
                        <div className="text-gray-500 text-2xl font-medium text-center mb-4 mt-10">
                            {paymentDetail?.status ? "Payment Successfull" : "Payment Not Successfull"}
                        </div>
                        {paymentDetail?.status && (
                            <div>
                                <div class="p-6 md:mx-auto">
                                    <svg viewBox="0 0 24 24" class="text-blue-600 w-16 h-16 mx-auto my-6">
                                        <path fill="currentColor"
                                            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
                                        </path>
                                    </svg>
                                    <div class="text-center">
                                        <h3 class="md:text-2xl text-base text-gray-200 font-semibold text-center">Subscription Completed!</h3>
                                        <p class="text-gray-400 my-2">Thank you for completing your secure online payment.</p>
                                        <p> Have a great day!  </p>
                                    </div>
                                </div>
                                <div class="flex justify-center">
                                    <div class="flex justify-center">
                                        <a target="_blank" href={`${paymentDetail?.invoiceLink}`} class="px-4 ml-2 button-theme hover:bg-indigo-500 text-white font-semibold py-3 cursor-pointer z-10" rel="noreferrer">
                                            View Invoice
                                        </a>
                                    </div>
                                    <div class="flex justify-center">
                                        <a target="_blank" href={`${paymentDetail?.invoiceDownloadUrl}`} class="px-4 ml-2 button-theme hover:bg-indigo-500 text-white font-semibold py-3 cursor-pointer z-10" rel="noreferrer">
                                            Download Invoice
                                        </a>
                                    </div>
                                    <span class="relative flex justify-center">
                                        {walkThroughPending && (<span class="animate-ping absolute inline-flex h-full w-[68%] bg-sky-200 opacity-40 z-0"></span>)}
                                        <button onClick={() => { navigate('/device'); updateWalkthrough(); }} class={`${!deviceStatus && 'ring-2 ring-slate-400'} px-4 ml-2 button-theme hover:bg-indigo-500 text-white font-semibold py-3 cursor-pointer z-10`} rel="noreferrer">
                                            Connect Device
                                        </button>
                                    </span>
                                </div>
                                <div class="flex justify-center mt-10">
                                    <a onClick={() => navigate('/membership')} href='' class="flex justify-center mx-2 w-20 text-white py-2" rel="noreferrer">
                                        Go Back
                                    </a>
                                </div>
                            </div>
                        )}
                        {!paymentDetail?.status && (
                            <div>
                                <div class="p-6 md:mx-auto">
                                    <svg viewBox="0 0 24 24" class="text-red-600 w-16 h-16 mx-auto my-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </svg>
                                    <div class="text-center">
                                        <h3 class="md:text-2xl text-base text-gray-200 font-semibold text-center">Subscription Not Completed!</h3>
                                        <p class="text-gray-400 my-2">Please contact CFT Admin for more detail.</p>
                                    </div>
                                </div>
                                <div class="flex justify-center mt-10">
                                    <a onClick={() => navigate('/membership')} href='' class="flex justify-center mx-2 w-20 text-white py-2" rel="noreferrer">
                                        Go Back
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
export default PaymentConfirm;