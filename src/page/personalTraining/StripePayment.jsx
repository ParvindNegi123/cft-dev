import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, PaymentElement } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import axios from "axios";
import { BASE_URL } from "../../config";

const stripePromise = loadStripe("pk_test_1AZtjtpnxCLoSvGb1DP48yP2");

const StripePaymentTraining = ({ setPaymentPage, setPaymentPageLoaded, paymentType }) => {
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
    const [paymentIntent, setPaymentIntent] = useState('');
    const [options, setOptions] = useState({});

    useEffect(() => {
        if (!paymentType) {
            return;
        }
        // Create PaymentIntent as soon as the page loads
        axios({
            url: `${BASE_URL}/auth/create/onetime/payment-intent`,
            method: "POST",
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            data: { paymentType },
        }).then((data) => {
            setClientSecret(data?.data?.clientSecret);
        });
    }, [paymentType]);

    return (
        <div className="pt-6 px-14 ">
            {clientSecret && (
                <Elements
                    stripe={stripePromise}
                    options={{
                        appearance,
                        clientSecret,
                    }}
                >
                    <CheckoutForm
                        setName={setName}
                        name={name}
                        setEmail={setEmail}
                        email={email}
                        paymentType={paymentType}
                        setPaymentPage={setPaymentPage}
                        clientSecret={clientSecret}
                        paymentIntent={paymentIntent}
                    />
                </Elements>
            )}
        </div>
    );
}

export default StripePaymentTraining;