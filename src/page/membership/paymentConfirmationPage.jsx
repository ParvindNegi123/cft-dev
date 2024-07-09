import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { BASE_URL } from "../../config";
import generateTimeSeries from "../../helper/common";
import moment from "moment";

const PaymentConfirmationPage = () => {
    const [paymentDetail, setPaymentDetail] = useState();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

    const getPaymentDetail = (paymentIntent) => {
        axios({
            url: `${BASE_URL}/auth/create-subscription`,
            method: "post",
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            data: { paymentIntent: paymentIntent, email: localStorage.getItem('email') },
        }).then((data) => {
            setPaymentDetail(data?.data);
        });
    };

    useEffect(() => {
        getPaymentDetail();
    }, []);

    return (
        <div className="px-20 pt-10 min-h-screen">
            <div className="flex justify-center mb-8">
                <div>
                    <div className="text-gray-500 text-2xl font-medium text-center mb-4">
                        <svg viewBox="0 0 24 24" class="text-blue-600 w-10 h-10 mx-auto mb-2">
                            <path fill="currentColor"
                                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
                            </path>
                        </svg>
                        $ 10 PAYMENT DONE !
                    </div>
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
                            <a target="_blank" href={`${paymentDetail?.receiptUrl}`} class="flex justify-center mx-2 w-52 bg-theme-blue-secondary hover:bg-indigo-500 text-white py-2" rel="noreferrer">
                                View Invoice
                            </a>
                        </div>
                        <div class="flex justify-center">
                            <a target="_blank" href={`${'paymentDetail?.invoiceDownloadUrl'}`} class="flex justify-center mx-2 w-52 bg-theme-blue-secondary hover:bg-indigo-500 text-white py-2" rel="noreferrer">
                                Download Invoice
                            </a>
                        </div>
                    </div>
                    <div className="text-gray-400 text-2xl font-medium text-center py-4">You have booked {paymentDetail?.sessionType} training session. Please select your slot below</div>
                </div>
            </div>
        </div >
    );
}

export default PaymentConfirmationPage;