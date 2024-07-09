import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { BASE_URL } from "../config";
const UserEdit = ({ forumData, goBack, getUsersList }) => {

    useEffect(() => {
        let isAdmin = ['admin'].includes(localStorage.getItem('roles'));
            
        // If roles is not admin, redirect to dashboard page
        if (!isAdmin) {
            window.location = window.location.origin + '/membership';
            return false;
        }
    });

    const [formData, setFormData] = useState({
        id: forumData._id,
        firstName: forumData.firstName,
        lastName: forumData.lastName,
        age: forumData.age,
        gender: forumData.gender, 
        height: forumData.height, 
        weight: forumData.weight,
        status: forumData.status
    });
    const [showForumDetail, setShowForumDetail] = useState('');
    const [showError, setShowError] = useState(false);
    const [formClicked, setFormClicked] = useState(false);
    const [loading, setLoading] = useState(false);

    const editorRef = useRef(null);

    const [firstNameValue, setFirstNameValue] = useState(forumData.firstName);
    const [lastNameValue, setLastNameValue] = useState(forumData.lastName);
    const [ageValue, setAgeValue] = useState(forumData.age);
    const [genderValue, setGenderValue] = useState(forumData.gender);
    const [heightValue, setHeightValue] = useState(forumData.height);
    const [weightValue, setWeightValue] = useState(forumData.weight);
    const [statusValue, setStatusValue] = useState(forumData.status);

    const handleFirstNameChange = (e) => {
        setFirstNameValue(e.target.value); // Update the firstNameValue state with the new value
        setFormData({ ...formData, firstName: e.target.value })
    };
    const handleLastNameChange = (e) => {
        setLastNameValue(e.target.value); // Update the firstNameValue state with the new value
        setFormData({ ...formData, lastName: e.target.value })
    };
    const handleAgeChange = (e) => {
        setAgeValue(e.target.value); // Update the firstNameValue state with the new value
        setFormData({ ...formData, age: e.target.value })
    };
    const handleGenderChange = (e) => {
        setGenderValue(e.target.value); // Update the firstNameValue state with the new value
        setFormData({ ...formData, gender: e.target.value })
    };
    const handleHeightChange = (e) => {
        setHeightValue(e.target.value); // Update the firstNameValue state with the new value
        setFormData({ ...formData, height: e.target.value })
    };
    const handleWeightChange = (e) => {
        setWeightValue(e.target.value); // Update the firstNameValue state with the new value
        setFormData({ ...formData, weight: e.target.value })
    };
    const handleStatusChange = (e) => {
        setStatusValue(e.target.value); // Update the firstNameValue state with the new value
        setFormData({ ...formData, status: e.target.value })
    };
    


    const navigate = useNavigate();

    useEffect(() => {
        
    }, [formData]);

    const updateUser = () => {
        setLoading(true);
        setFormClicked(true);
        console.log(formData);
        if (!formData?.firstName || !formData?.lastName || !formData?.age || !formData?.gender || !formData?.height || !formData?.weight) {
            setShowError(true);
            setLoading(false);
            return;
        }
        axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: `${BASE_URL}/user/update`, //your url
            method: 'put',
            data: formData
        }).then((res) => {
            setLoading(false);
            goBack();
            getUsersList();
        });
    };

    return (
        <div className="dark:bg-slate-900 pt-10" style={{ height: "100vh" }} >
            <div className="pb-6 text-center text-gray-200">Edit User</div>
            
            <div class="flex flex-col pt-10 items-center min-h-screen">
                <div class="bg-theme-blue-secondary shadow-lg rounded-lg p-8 w-full sm:w-2/3 lg:w-1/2">
                    <div className="pb-6 text-center text-gray-200">
                        <button onClick={() => goBack()} type="button" className="flex items-center bg-theme-blue-secondary text-gray-200 p-2 rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fill-rule="evenodd" d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z" clip-rule="evenodd" />
                            </svg>
                            &nbsp;User List&nbsp;
                        </button>
                    </div>
                    <div className="mb-4">
                        <label className="font-normal mb-4 text-gray-300 dark:text-gray-400">First Name</label>
                        <input value={firstNameValue} onChange={handleFirstNameChange} type="text" className="bg-theme-blue mb-4 autofill:bg-slate-800 relative block w-full appearance-none border border-[#2d3d5c] px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="First Name" required />
                        
                        <label className="font-normal mb-4 text-gray-300 dark:text-gray-400">Last Name</label>
                        <input value={lastNameValue} onChange={handleLastNameChange} type="text" className="bg-theme-blue  mb-4 autofill:bg-slate-800 relative block w-full appearance-none border border-[#2d3d5c] px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="Last Name" required />
                    
                        <label className="font-normal mb-4 text-gray-300 dark:text-gray-400">Age</label>
                        <input 
                            value={ageValue} onChange={handleAgeChange}
                            id="age"
                            name="age"
                            type="number"
                            min="1"
                            max="120"
                            className="bg-theme-blue mb-4 autofill:bg-slate-800 relative block w-full appearance-none border border-gray-500 px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            placeholder="Age"
                            required 
                        />
                        
                        <label className="font-normal mb-4 text-gray-300 dark:text-gray-400">Gender</label>
                        <ul class="text-sm font-medium mb-4 text-center text-gray-500 border border-gray-600 divide-x divide-gray-500 shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
                            <span class="w-full">
                                <span
                                    onClick={() => setFormData({
                                        ...formData,
                                        gender: 'male',
                                    })}
                                    className={`cursor-pointer ${(formData?.gender === 'male') && 'bg-theme-blue text-gray-300'} inline-block w-full p-4 dark:bg-gray-700 dark:text-white`}
                                >
                                    Male
                                </span>
                            </span>
                            <span class="w-full">
                                <span
                                    onClick={() => setFormData({
                                        ...formData,
                                        gender: 'female',
                                    })}
                                    className={`cursor-pointer ${(formData?.gender === 'female') && 'bg-theme-blue text-gray-300'} inline-block w-full p-4 rounded-r-lg hover:text-gray-700 hover:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700`}
                                >
                                    Female
                                </span>
                            </span>
                        </ul>

                        <label for="sort" className="font-normal mb-4 text-gray-300 dark:text-gray-400">Height</label>
                        <div class="flex">
                            <input 
                                value={heightValue} onChange={handleHeightChange} 
                                id="height"
                                name="height"
                                type="number"
                                min="1"
                                max="200"
                                maxlength="3"
                                className="bg-theme-blue  mb-4 autofill:bg-slate-800 relative block w-full appearance-none border border-[#2d3d5c] px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm" 
                                placeholder="Height" 
                                required 
                            />
                            <span class="inline-flex items-center mb-4 px-3 text-sm text-gray-300 bg-gray-800 border border-l-0 border-gray-500 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                CM
                            </span>
                        </div>
            
                        <label for="sort" className="font-normal mb-4 text-gray-300 dark:text-gray-400">Weight</label>
                        <div class="flex">
                            <input 
                                value={weightValue} onChange={handleWeightChange} 
                                id="weight"
                                name="weight"
                                type="number"
                                min="1"
                                max="200"
                                maxlength="3"
                                className="bg-theme-blue  mb-4 autofill:bg-slate-800 relative block w-full appearance-none border border-[#2d3d5c] px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm" 
                                placeholder="Weight" 
                                required 
                            />
                            <span class="inline-flex items-center mb-4 px-3 text-sm text-gray-300 bg-gray-800 border border-l-0 border-gray-500 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                KG
                            </span>
                        </div>

                        <label for="sort" className="font-normal mb-4 text-gray-300 dark:text-gray-400">Status</label>
                        <div class="flex">
                            <select
                                name="status"
                                value={statusValue} onChange={handleStatusChange} 
                                className="bg-theme-blue autofill:bg-slate-800 relative block w-full border border-[#2d3d5c] px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                >
                                <option value="1" style={{background: '#5b719d'}}>Active</option>
                                <option value="2" style={{background: '#5b719d'}}>Limited Access</option>
                                <option value="0" style={{background: '#5b719d'}}>Disable</option>
                            </select>
                        </div>
                    </div>

                    {/* <textarea onChange={(e) => setFormData({ ...formData, content: e.target.value })} id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-400 bg-slate-900 rounded-lg border border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="message" required></textarea> */}
                    {showError && <p className="text-red-500 my-2">* None of the fields should be empty</p>}
                    <div className="my-6 flex">
                        <button onClick={() => updateUser()} type="button" className="button-theme font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                            {loading && (
                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                </svg>
                            )}
                            UPDATE
                        </button>
                        <button onClick={() => goBack()} type="button" className="button-theme font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                            CANCEL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default UserEdit;