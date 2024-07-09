import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL, CLIENT_BASE_URL } from "../../config";
import {
    PaymentElement,
    LinkAuthenticationElement,
    useStripe,
    useElements,
    CardElement
} from "@stripe/react-stripe-js";

const CheckoutForm = ({ paymentType, setPaymentPage, setName, name, setEmail, email }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [clientSecret, setClientSecret] = useState();
    const [paymentDone, setPaymentDone] = useState(false);
    const [paymentDetail, setPaymentDetail] = useState('');
    const [deviceStatus, setDeviceStatus] = useState(false);
    const [slots, setSlots] = useState();

    const handleError = (error) => {
        setIsLoading(false);
        setErrorMessage(error.message);
    }

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

    useEffect(() => {
        getDeviceStatus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe) {
            return;
        }

        setIsLoading(true);

        const { error: submitError } = await elements.submit();

        if (submitError) {
            handleError(submitError);
            return;
        }

        // Create the PaymentMethod using the details collected by the Payment Element
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            elements,
            params: {
                billing_details: {
                    name: name,
                    email: email
                }
            }
        });

        if (error) {
            handleError(error);
            return;
        }

        let status = false;

        await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${CLIENT_BASE_URL}/payment-confirm?name=${paymentMethod?.billing_details?.name}&payment-method-id=${paymentMethod?.id}`,
            }
        });

        // await axios({
        //     url: `${BASE_URL}/auth/create-subscription`,
        //     method: "post",
        //     headers: {
        //         "x-access-token": localStorage.getItem('auth-token')
        //     },
        //     data: { paymentMethod, paymentType, email: localStorage.getItem('email') },
        // }).then((data) => {
        //     status = data?.data?.status;
        //     setClientSecret(data?.data?.clientSecret);
        //     setPaymentDetail(data?.data);
        //     setPaymentDone(true);
        //     setIsLoading(false);
        // });

        // console.log(subscription);
        // var latest_invoice = subscription.LatestInvoice;
        // const payment_intent = latest_invoice.PaymentIntent;
        // console.log("payment_intent", payment_intent);
        // if (payment_intent) {
        //     /* Do NOT share or embed your client_secret anywhere */

        //     var client_secret = payment_intent.ClientSecret;
        //     var status = payment_intent.Status;
        //     console.log("--------", client_secret, "------------", status);
        //     if (status === "requires_action" || status === "requires_payment_method") {
        //         stripe.confirmCardPayment(client_secret)
        //             .then((result) => {

        //             });
        //     }

        if (!isLoading) {
            return;
        }

        if (status === 'paid' || status === 'active') {
            setPaymentDone(true);
        }

        if (!stripe || !elements) {
            setIsLoading(false);
            return;
        }

        if (error?.type === "card_error" || error?.type === "validation_error") {
            setMessage(error?.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: 'tabs'
    };


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
        <div className="flex justify-center">
            {paymentDone ? (
                <div class="">
                    <div class="p-6 md:mx-auto">
                        <svg viewBox="0 0 24 24" class="text-blue-600 w-16 h-16 mx-auto my-6">
                            <path fill="currentColor"
                                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
                            </path>
                        </svg>
                        <div class="text-center">
                            <h3 class="md:text-2xl text-base text-gray-200 font-semibold text-center">Payment Done!</h3>
                            <p class="text-gray-400 my-2">Thank you for completing your secure online payment.</p>
                            <p> Have a great day!  </p>
                        </div>
                    </div>
                    <div class="py-10 lg:w-[600px] flex justify-center">
                        <a target="_blank" href={`${paymentDetail?.invoiceLink}`} class="px-4 mr-2 bg-theme-blue-secondary hover:bg-indigo-500 text-white font-semibold py-3" rel="noreferrer">
                            View Invoice
                        </a>
                        <a target="_blank" href={`${paymentDetail?.invoiceDownloadUrl}`} class="px-4 mr-2 bg-theme-blue-secondary hover:bg-indigo-500 text-white font-semibold py-3" rel="noreferrer">
                            Download Invoice
                        </a>
                        {/* <span onClick={() => setPaymentPage('')} class="px-4 cursor-pointer bg-theme-blue-secondary hover:bg-indigo-500 text-white font-semibold py-3">
                            CLOSE
                        </span> */}
                        <span class="relative flex justify-center">
                            {walkThroughPending && (<span class="animate-ping absolute inline-flex h-full w-[68%] bg-sky-200 opacity-40 z-0"></span>)}
                            <button onClick={() => { navigate('/device'); updateWalkthrough(); }} href={`${paymentDetail?.invoiceDownloadUrl}`} class={`${!deviceStatus && 'ring-2 ring-slate-400'} px-4 ml-2 button-theme hover:bg-indigo-500 text-white font-semibold py-3 cursor-pointer z-10`} rel="noreferrer">
                                Connect Device
                            </button>
                        </span>
                    </div>
                </div>
            ) : (
                <form id="payment-form" onSubmit={handleSubmit}>
                    {(paymentType === 'basic') ? (
                        <div className="mb-8">
                            <h2 className="text-4xl tracking-tight font-bold text-gray-300 dark:text-white">Basic Plan</h2>
                            <span className="my-4 text-2xl font-bold">$5/month</span>
                        </div>
                    ) : (
                        <div className="mb-8">
                            <h2 className="text-4xl tracking-tight font-bold text-gray-300 dark:text-white">Advance Plan</h2>
                            <span className="my-4 text-2xl font-bold">$10/month</span>
                        </div>
                    )
                    }

                    <div className="my-3 text-left">
                        <label htmlFor="garminUserId" className="text-left">
                            Name On Card
                        </label>
                        <input
                            id="garminUserId"
                            name="garminUserId"
                            type="text"
                            className="bg-theme-blue autofill:bg-slate-800 relative block w-full appearance-none border border-[#2d3d5c] px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Name"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <LinkAuthenticationElement options={paymentElementOptions} />
                    {message && <div id="payment-message">{message}</div>}
                    <button id="submit" type="submit" className="mt-10 inline-flex w-full items-center justify-center rounded bg-teal-600 py-2.5 px-4 text-base font-semibold tracking-wide text-white hover:text-opacity-100 sm:text-lg">
                        {isLoading ? (
                            <svg aria-hidden="true" role="status" className="inline w-5 h-5 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                            </svg>
                        ) : "Pay now"}
                    </button>
                    <button onClick={() => setPaymentPage(false)} className="my-6 inline-flex w-40 items-center justify-center rounded text-sm tracking-wide text-white text-opacity-80 outline-none ring-offset-2 transition hover:text-opacity-100">Go Back</button>
                    {/* Show any error or success messages */}

                </form>
            )
            }
        </div >
    );
};

export default CheckoutForm;