import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { BASE_URL } from "../../config";
import DateSlotPicker from "../../components/dateSlotPicker";

const AddUnavailableSlots = () => {
    const navigate = useNavigate();
    const [bookedSlots, setBookedSlots] = useState([]);
    const [unavailableSlots, setUnavailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isAdmin = ['admin'].includes(localStorage.getItem('roles'));
            
        // If roles is not admin, redirect to dashboard page
        if (!isAdmin) {
            window.location = window.location.origin + '/membership';
            return false;
        }
    });

    const addUnavailableSlots = () => {
        let bookedSlotsData = bookedSlots.map((data) => ({
            date: data?.date,
            startTime: data?.time?.startTime,
            endTime: data?.time?.endTime,
        }));

        axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: `${BASE_URL}/admin/slots/unavailable`, //your url
            method: 'post',
            data: bookedSlotsData
        }).then((res) => {
            navigate('/training-slots');
            setLoading(false);
        });
    };

    return (
        <div className="min-h-screen">
            <div className="text-gray-400 text-center text-2xl font-semibold pt-12">Add Available Slots</div>
            <DateSlotPicker bookedSlots={bookedSlots} setBookedSlots={setBookedSlots} slotSelectionLabel="Please select available slots" selectedSlotLabel="Available Slots" buttonLabel="Add Time" />
            
            {/*
            <div className="flex justify-center">
                <button onClick={() => addUnavailableSlots()} id="submit" type="submit" className={`mx-2 my-8 inline-flex w-[200px] items-center justify-center rounded bg-theme-blue-secondary py-2 px-4 text-gray-400 hover:text-opacity-100`}>
                    Add Slots
                </button>

                <button onClick={() => navigate('/training-slots')} type="button" className={`mx-2 my-8 inline-flex w-[200px] items-center justify-center rounded bg-theme-blue-secondary py-2 px-4 text-gray-400 hover:text-opacity-100`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="#A8AAAD" d="M10 17l-5-5 5-5v10z"/>
                        <path fill="none" d="M0 0h24v24H0z"/>
                    </svg>
                    Back
                </button>
            </div>
            */}

        </div>
    );
}

export default AddUnavailableSlots;