import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from "../config";
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';

import userImg from "../assets/user.jpg";

const Profile = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState('');
    const [profileLoading, setProfileLoading] = useState('');
    const [error, setError] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [user, setUser] = useState({
        gender: "NA",
        age: "",
        weight: "",
        height: ""
    });
    const [userForm, setUserForm] = useState({
        gender: "NA",
        age: "",
        weight: "",
        height: ""
    });
    const navigate = useNavigate();
    const location = useLocation();

    const updateProfile = (e) => {
        setError("");
        setLoading(true);
        axios({
            headers: {
                "x-access-token": localStorage.getItem("auth-token"),
            },
            url: `${BASE_URL}/user/profile`, //your url
            method: 'POST',
            data: {
                ...userForm
            }
        }).then((res) => {
            setLoading(false);
            setIsEdit(false);
            getProfile();
        }).catch((err) => {
            if (err?.response?.data?.message) {
                setError(err?.response?.data?.message);
                setTimeout(() => {
                    setError("");
                }, 3000);
            }
            setLoading(false);
        });
    };

    const getProfile = (event) => {
        setError("");
        setProfileLoading(true);
        axios({
            headers: {
                "x-access-token": localStorage.getItem("auth-token"),
            },
            url: `${BASE_URL}/user/profile`, //your url
            method: 'GET'
        }).then((res) => {
            setUser(res?.data?.data);
            setUserForm(res?.data?.data);
            setProfileLoading(false);
        }).catch((err) => {
            if (err?.response?.data?.message) {
                setError(err?.response?.data?.message);
                setTimeout(() => {
                    setError("");
                }, 3000);
            }
            setProfileLoading(false);
        });
    };

    useEffect(() => {
        getProfile();
    }, []);

    let companyDetails = localStorage.getItem('company');
    if (companyDetails) {
        companyDetails = JSON.parse(companyDetails);
    }

    return (
        <>
            <div className="dark:bg-slate-900 pt-10" style={{ height: "100vh" }}>
                <div className="flex justify-between items-center border-b border-blue-200 border-opacity-20 h-14 mb-8 md:ml-28 md:mr-20">
                    <div className="text-2xl tracking-tight font-medium text-gray-300 dark:text-white">
                        Profile
                    </div>
                </div>
                <div class="flex flex-col pt-10 items-center min-h-screen">
                    {profileLoading ? (
                        <div class="w-full sm:w-2/3 lg:w-1/2">
                            <Skeleton baseColor="#202c40" highlightColor="#263348" height={500} />
                        </div>
                    ) : (
                        <div class="bg-theme-blue-secondary shadow-lg rounded-lg p-8 w-full sm:w-2/3 lg:w-1/2">
                            <div class="flex justify-center">
                                <img src={userImg} alt="Profile Picture" class="rounded-full w-24 h-24 mx-auto mb-4" />
                            </div>
                            <div class="text-center">
                                <h2 class="text-3xl font-bold text-gray-100">{user?.name}</h2>
                                {/* <p class="text-gray-400">Web Developer</p> */}
                            </div>
                            <div className="flex justify-center text-gray-400 text-2xl">
                                {companyDetails?.companyName}
                            </div>
                            <div class="flex flex-col justify-center items-center mt-8">
                                {!isEdit ? (<div class="">
                                    <div className="flex justify-left items-center my-2 text-3xl">
                                        <p class="text-gray-400 mx-2 w-28 flex justify-start">Age:</p>
                                        <p class="text-gray-100 w-18 font-medium">{user?.age || 0}</p>
                                    </div>
                                    <div className="flex justify-left items-center my-2 text-3xl">
                                        <p class="text-gray-400 mx-2 w-28 flex justify-start">Gender:</p>
                                        <p class="text-gray-100 w-18 font-medium">{user?.gender || 'NA'}</p>
                                    </div>
                                    <div className="flex justify-left items-center my-2 text-3xl">
                                        <p class="text-gray-400 mx-2 w-28 flex justify-start">Height:</p>
                                        <p class="text-gray-100 w-18 font-medium">{user?.height || 0} cm</p>
                                    </div>
                                    <div className="flex justify-left items-center my-2 text-3xl">
                                        <p class="text-gray-400 mx-2 w-28 flex justify-start">Weight:</p>
                                        <p class="text-gray-100 w-18 font-medium">{user?.weight || 0} kg</p>
                                    </div>
                                </div>
                                ) : (
                                    <form
                                        style={{ zIndex: "80000" }}
                                        className="w-[80%] md:w-[20vw]"
                                        id="user-profile"
                                    >
                                        <div className="my-2">
                                            <label htmlFor="age" className="sr-only">
                                                Age
                                            </label>
                                            <input
                                                value={userForm?.age}
                                                onChange={(e) => {
                                                    setUserForm({ ...userForm, age: e.target.value })
                                                }}
                                                id="age"
                                                name="age"
                                                type="number"
                                                min="1"
                                                max="120"
                                                className="bg-theme-blue autofill:bg-slate-800 relative block w-full appearance-none border border-gray-500 px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                placeholder="Age"
                                            />
                                        </div>
                                        <ul class="text-sm font-medium text-center text-gray-500 border border-gray-600 divide-x divide-gray-500 shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
                                            <span class="w-full">
                                                <span
                                                    onClick={() => setUserForm({
                                                        ...userForm,
                                                        gender: 'male',
                                                    })}
                                                    className={`cursor-pointer ${(userForm?.gender === 'male') && 'bg-theme-blue text-gray-300'} inline-block w-full p-4 dark:bg-gray-700 dark:text-white`}
                                                >
                                                    Male
                                                </span>
                                            </span>
                                            <span class="w-full">
                                                <span
                                                    onClick={() => setUserForm({
                                                        ...userForm,
                                                        gender: 'female',
                                                    })}
                                                    className={`cursor-pointer ${(userForm?.gender === 'female') && 'bg-theme-blue text-gray-300'} inline-block w-full p-4 rounded-r-lg hover:text-gray-700 hover:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700`}
                                                >
                                                    Female
                                                </span>
                                            </span>
                                        </ul>
                                        <div className="my-2">
                                            <label htmlFor="height" className="sr-only">
                                                Height
                                            </label>
                                            <div class="flex">
                                                <input
                                                    value={userForm?.height}
                                                    onChange={(e) => {
                                                        setUserForm({ ...userForm, height: e.target.value })
                                                    }}
                                                    id="height"
                                                    name="height"
                                                    type="number"
                                                    min="1"
                                                    max="200"
                                                    maxlength="3"
                                                    className="bg-theme-blue autofill:bg-slate-800 relative block w-full appearance-none border border-gray-500 px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                    placeholder="Height"
                                                />
                                                <span class="inline-flex items-center px-3 text-sm text-gray-300 bg-gray-800 border border-l-0 border-gray-500 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                                    CM
                                                </span>
                                            </div>
                                        </div>
                                        <div className="my-2">
                                            <label htmlFor="weight" className="sr-only">
                                                Weight
                                            </label>
                                            <div class="flex">
                                                <input
                                                    value={userForm?.weight}
                                                    onChange={(e) => {
                                                        setUserForm({ ...userForm, weight: e.target.value })
                                                    }}
                                                    id="weight"
                                                    name="weight"
                                                    type="number"
                                                    min="1"
                                                    max="200"
                                                    maxlength="3"
                                                    className="bg-theme-blue autofill:bg-slate-800 relative block w-full appearance-none border border-gray-500 px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                    placeholder="Weight"
                                                />
                                                <span class="inline-flex items-center px-3 text-sm text-gray-300 bg-gray-800 border border-l-0 border-gray-500 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                                    KG
                                                </span>
                                            </div>
                                        </div>
                                    </form>
                                )}
                                {isEdit ? (
                                    <div className="mt-6 flex justify-center">
                                        <button onClick={() => updateProfile()} type="button" className="button-theme-secondary font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                                            SAVE
                                            {loading && (
                                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 ml-3 text-gray-200 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                                </svg>
                                            )}
                                        </button>
                                        <button onClick={() => setIsEdit(false)} type="button" className="button-theme-secondary font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                                            CANCEL
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-center mt-6">
                                        <button
                                            className="button-theme-secondary font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                                            onClick={() => setIsEdit(true)}
                                        >
                                            EDIT
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div >
        </>
    )
}
export default Profile;