import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, PaymentElement } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import axios from "axios";
import { BASE_URL, STRIPE_PUBLISHABLE_KEY } from "../../config";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const StripePayment = ({ setPaymentPage, setPaymentPageLoaded, paymentType }) => {
    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#26455A',
            colorBackground: '#1b425c',
            colorText: '#F2F2F2',
            colorDanger: '#df1b41',
            fontFamily: 'Ideal Sans, system-ui, sans-serif',
            spacingUnit: '3.5px',
            borderRadius: '0px',
            border: '1px solid #ffffff38'
        }
    };

    const [clientSecret, setClientSecret] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [options, setOptions] = useState({});

    useEffect(() => {
        if (!paymentType) {
            return;
        }
        // Create PaymentIntent as soon as the page loads
        axios({
            url: `${BASE_URL}/auth/create-payment-intent`,
            method: "POST",
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            data: { paymentType },
        }).then((data) => {
            //           setClientSecret(data?.data?.clientSecret);
            window.location.href = data?.data?.url;
        });
    }, [paymentType]);

    useEffect(() => {
        if (clientSecret) {
            setOptions({
                appearance,
                clientSecret,
                paymentMethodCreation: 'manual',
                automaticPaymentMethods: {
                    enabled: true,
                },
            });
        }
    }, [clientSecret]);

    return (
        <div className="m-14">
            Processing Payment
        </div>
    );
}

export default StripePayment;