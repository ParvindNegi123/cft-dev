import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    PaymentElement,
    Elements,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import Skeleton from 'react-loading-skeleton';
import StripePayment from './StripePayment';
import Papa from 'papaparse';
import axios from 'axios';
import { BASE_URL } from "../../config";

const Membership = () => {
    const [paymentPage, setPaymentPage] = useState('');
    const [paymentPageLoaded, setPaymentPageLoaded] = useState(true);
    const [planDetail, setPlanDetail] = useState({});
    const [csvData, setCsvData] = useState('');
    const [loading, setLoading] = useState(true);

    const getDeviceStatus = () => {
        setLoading(true);
        axios({
            headers: {
                "x-access-token": localStorage.getItem("auth-token"),
            },
            url: `${BASE_URL}/user/subscription/status`, //your url
            method: "GET",
        }).then((res) => {
            setLoading(false);
            setPlanDetail(res.data);
        });
    };

    useEffect(() => {
        if (paymentPage) {
            return;
        }
        getDeviceStatus();
    }, [paymentPage]);

    const handleCsvDownload = (jsonData) => {
        const csv = Papa.unparse(jsonData);
        setCsvData(csv);

        // Optional: Save CSV data to a file
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'data.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const downloadBillingReport = () => {
        handleCsvDownload([{
            "User Range": userDetails?.userRange,
            "Price Per User": userDetails?.price,
            "Active CFT User": userDetails?.userCount,
            "Expected CFT User": userDetails?.expectedCftUser,
            "Total Cost": userDetails?.price * ((parseInt(userDetails?.expectedCftUser) > parseInt(userDetails?.userCount)) ? parseInt(userDetails?.expectedCftUser) : parseInt(userDetails?.userCount))
        }]);
    };

    const isCompanyAdmin = ['company'].includes(localStorage.getItem('roles'));
    let userDetails = localStorage.getItem('user');
    if (userDetails) {
        userDetails = JSON.parse(userDetails);
    }

    return (
        <div className="min-h-screen md:mx-20 pt-10">
            <div className="flex justify-between items-center border-b border-blue-200 border-opacity-20 h-14 mb-8 mx-8">
                <div className="text-2xl tracking-tight font-medium text-gray-300 dark:text-white">
                    Membership
                </div>
            </div>
            {loading && (
                <section class={`dark:bg-gray-900`}>
                    <div className="py-8 px-4 mx-auto max-w-screen-xl h-screen lg:py-16 lg:px-6">
                        <div className="flex flex-wrap justify-center">
                            <Skeleton baseColor="#202c40" highlightColor="#263348" width={400} height={300} />
                        </div>
                    </div>
                </section>
            )}
            {!loading && (planDetail?.subscribedStatus ? (
                <section class={`dark:bg-gray-900`}>
                    <div className="py-8 px-4 mx-auto max-w-screen-xl h-screen lg:py-16 lg:px-6">
                        <div className="flex flex-wrap justify-center">
                            <div className="bg-theme-blue flex flex-col border border-gray-400 p-6 mx-10 my-2 w-80 text-center text-gray-300 rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                                <h2 className="mb-4 text-5xl capitalize tracking-tight font-bold text-gray-300 dark:text-white">{planDetail?.planType}</h2>
                                <div className="flex justify-center items-baseline my-8">
                                    <span className="mr-2 text-4xl font-bold">${(planDetail?.planType === 'basic') ? 5 : 10}</span>
                                    <span className="text-4xl text-gray-400 dark:text-gray-400">/month</span>
                                </div>
                                <span className="cursor-pointer text-4xl text-green-400 bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900">
                                    ACTIVE
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <div className={`${isCompanyAdmin ? 'bg-transparent' : 'bg-transparent'} dark:bg-slate-900`} >
                    <section class={`dark:bg-gray-900 ${(paymentPage && paymentPageLoaded) ? '' : 'hidden'}`} >
                        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-10 lg:px-6">
                            <div className="flex flex-col p-0 mx-auto max-w-lg text-center text-gray-300 bg-theme-blue  shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                                <StripePayment paymentType={paymentPage} setPaymentPage={setPaymentPage} setPaymentPageLoaded={setPaymentPageLoaded} />
                            </div>
                        </div>
                    </section>
                    <section class={`bg-transparent dark:bg-gray-900 ${(!paymentPage && paymentPageLoaded) ? '' : 'hidden'}`}>
                        <div className="py-8 px-4 mx-auto max-w-screen-xl h-screen lg:py-16 lg:px-6">
                            <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                                <h2 className="mb-4 text-4xl tracking-tight font-bold text-gray-300 dark:text-white">Track Your Health With Us</h2>
                                <p className="mb-5 font-light text-gray-400 sm:text-xl dark:text-gray-400">Here at CONTIGENT FITNESS we focus on on your health with technology and innovation.</p>
                            </div>
                            {isCompanyAdmin ? (
                                <div className="flex flex-wrap justify-center">
                                    {/* <div className="flex flex-col p-6 mx-10 my-2 w-80 text-center text-gray-300 bg-theme-blue rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                                        <h2 className="text-4xl tracking-tight font-bold text-gray-300 dark:text-white py-2">{userDetails?.userRange}</h2>
                                        <div className="mx-10 text-left text-xl font-bold mb-2 mt-6">Price Per User : {userDetails?.price}</div>
                                        <div className="mx-10 text-left text-xl font-bold mb-2 mb-6">Total User : {userDetails?.userCount}</div>
                                        <div className="px-10 text-left text-xl font-bold mb-2 mb-6 bg-theme-blue-secondary py-4">Total Cost : $ {userDetails?.price * userDetails?.userCount}</div>
                                    </div> */}
                                    <div className="flex flex-col w-[500px] h-[360px] p-6 mr-10 my-2 text-center text-gray-300 bg-theme-blue rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                                        <div className="flex justify-between border-b border-blue-200 border-opacity-20 h-10 mb-7">
                                            <div className="mb-4 text-xl tracking-tight font-medium text-gray-300 dark:text-white">
                                                Billing
                                            </div>
                                        </div>
                                        <div className="border-b border-blue-200 border-opacity-20 pb-4">
                                            <div className="mb-8">
                                                <div class="flex justify-between mb-1">
                                                    <span class="text-md md:text-md text-[#818cf8] dark:text-white">User Range</span>
                                                    <div>
                                                        <span class="text-md md:text-md text-gray-100 dark:text-white">{userDetails?.userRange}</span>
                                                    </div>
                                                </div>
                                                <div class="w-full bg-[#818cf8] rounded-full h-2 dark:bg-gray-700">
                                                </div>
                                            </div>
                                            <div className="mb-8">
                                                <div class="flex justify-between mb-1 text-yellow-400">
                                                    <span class="text-md md:text-md">Price Per User</span>
                                                    <div>
                                                        <span class="text-md md:text-md text-gray-100">$ {userDetails?.price}</span>
                                                    </div>
                                                </div>
                                                <div class="w-full bg-yellow-400 rounded-full h-2 dark:bg-gray-700">
                                                </div>
                                            </div>
                                            <div className="">
                                                <div class="flex justify-between mb-1">
                                                    <div>
                                                        <span class="text-md text-green-400 md:text-md dark:text-white mr-2">Active CFT User</span>/
                                                        <span class="text-md text-white-200 md:text-md dark:text-white ml-2">Expected CFT User</span>
                                                    </div>
                                                    <div>
                                                        <span class="text-md md:text-md text-green-400 dark:text-white">{userDetails?.userCount}/</span>
                                                        <span className="text-md md:text-md text-gray-100">{userDetails?.expectedCftUser}</span>
                                                    </div>
                                                </div>
                                                <div class="w-full bg-gray-100 rounded-full h-2 dark:bg-gray-700">
                                                    <div class="bg-green-400 h-2 rounded-full" style={{ width: `${((userDetails?.userCount / userDetails?.expectedCftUser) * 100)}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between pt-4">
                                            <div className="text-lg font-medium text-gray-300 dark:text-white">
                                                Total Cost : $ {userDetails?.price * ((parseInt(userDetails?.expectedCftUser) > parseInt(userDetails?.userCount)) ? parseInt(userDetails?.expectedCftUser) : parseInt(userDetails?.userCount))}
                                            </div>
                                            <div onClick={() => downloadBillingReport()} className="flex text-blue-400 font-medium cursor-pointer">
                                                Download Report
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 ml-2">
                                                    <path fill-rule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-wrap justify-center">
                                    <div className="flex flex-col p-6 mx-10 my-2 w-80 text-center text-gray-300 bg-theme-blue rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                                        <h2 className="text-4xl tracking-tight font-bold text-gray-300 dark:text-white">Advance</h2>
                                        <div className="flex justify-center items-baseline my-8">
                                            <span className="mr-2 text-5xl font-bold">$10</span>
                                            <span className="text-2xl text-gray-400 dark:text-gray-400">/month</span>
                                        </div>
                                        <span onClick={() => setPaymentPage('advance')} className="bg-theme-blue-secondary cursor-pointer text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-primary-900">
                                            Subscribe
                                            {(paymentPage && !paymentPageLoaded) && (
                                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 ml-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                                </svg>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            )
                            }
                        </div >
                    </section >
                </div >
            ))}
        </div >
    )
}
export default Membership;