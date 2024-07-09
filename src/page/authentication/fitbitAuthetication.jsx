import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../../config";

const FitbitAuthentication = () => {
    const params = useParams();
    const navigate = useNavigate();

    const authenticateFitbit = () => {
        axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: `${BASE_URL}/auth/updateFitBitToken`, //your url
            method: 'PUT',
            data: { fitBitUserID: params?.fitbit_user_id }
        }).then((res) => {
            axios({
                headers: {
                    "x-access-token": localStorage.getItem('auth-token')
                },
                url: `${BASE_URL}/auth/fitBitRefreshToken`, //your url
                method: 'GET'
            }).then((res) => {
                console.log(res, '+++++++++++++++++++++');
            });
            navigate('/device');
        });
    };

    useEffect(() => {
        authenticateFitbit();
    }, []);

    return (
        <div className="bg-theme-blue dark:bg-slate-900" style={{ height: '90vh' }}>
            <div className="flex items-center justify-center dark:border-gray-700 text-gray-200 h-[80vh]">
                <div>
                    <div className="lds-facebook ml-[10px]">
                        <div></div><div></div><div></div><div></div><div></div>
                    </div>
                    <div className="flex">authenticating</div>
                </div>
            </div>
        </div>
    )
}
export default FitbitAuthentication;