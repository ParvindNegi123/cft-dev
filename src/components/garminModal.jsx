import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../config";
import axios from 'axios';
const GarminModal = ({ modalShow, onModalConfirm, setModalShow, title, content, setGarminChecked }) => {
  const [GarminUserForm, setGarminUserForm] = useState({
    garminUserId: "",
    garminPassword: "",
    gender: "",
    age: "",
    weight: ""
  });
  const [formClicked, setFormClicked] = useState(false);
  const [loading, setLoading] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!modalShow) {
      setGarminUserForm({
        garminUserId: "",
        garminPassword: "",
        gender: "",
        age: "",
        weight: ""
      });
      setShowError('');
      setFormClicked(false);
    }
    setShowError('');
  }, [modalShow]);

  const validateInput = (GarminUserForm, forceCheck) => {
    const ageRegex = /^(?:[1-9]|[1-9][0-9]|1[01][0-9]|120)$/;
    const weightRegex = /^(?:[1-9]|[1-9][0-9]|1[01][0-9]|200)$/;
    if (!formClicked && !forceCheck) {
      return true;
    }
    if (!GarminUserForm?.garminUserId) {
      setShowError('Please enter Garmin Id');
      setLoading(false);
      return true;
    }
    if (!GarminUserForm?.garminPassword) {
      setShowError('Please enter Garmin Password');
      setLoading(false);
      return true;
    }
    if (!GarminUserForm?.gender) {
      setShowError('Please select gender');
      setLoading(false);
      return true;
    }
    if (!GarminUserForm?.age) {
      setShowError('Please enter age');
      setLoading(false);
      return true;
    }
    if (!ageRegex.test(GarminUserForm?.age)) {
      setShowError('Please enter valid age');
      setLoading(false);
      return true;
    }
    if (!GarminUserForm?.weight) {
      setShowError('Please enter weight');
      setLoading(false);
      return true;
    }
    if (!weightRegex.test(GarminUserForm?.weight)) {
      setShowError('Please enter valid weight');
      setLoading(false);
      return true;
    }
    else {
      setShowError(false);
      return false;
    }
  };

  const addNewGaminUser = () => {
    setFormClicked(true);
    setLoading(true);

    const isAnyError = validateInput(GarminUserForm, true);
    if (isAnyError) {
      setLoading(false);
      return;
    }

    axios({
      headers: {
        "x-access-token": localStorage.getItem('auth-token')
      },
      url: `${BASE_URL}/garmin/garminewuser`, //your url
      method: 'post',
      data: GarminUserForm
    }).then((res) => {
      if (res?.data?.success) {
        setGarminChecked(true);
        setModalShow(false);
      } else {
        setShowError(res?.data?.message);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    validateInput(GarminUserForm);
  }, [GarminUserForm]);

  return (
    <>
      <div
        id="defaultModal"
        tabindex="-1"
        aria-hidden="true"
        class={`fixed flex justify-center bg-gray-900 bg-opacity-90 pt-[100px] z-50 w-full p-4 overflow-x-hidden ${!modalShow && "hidden"} overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div class="relative w-full max-w-2xl max-h-full">
          <div class="relative bg-theme-blue rounded-lg shadow dark:bg-gray-600">
            <div class="flex items-start justify-between p-4 b rounded-t dark:border-gray-600">
              <div class="text-xl font-semibold text-gray-500 dark:text-white">
                {title}
              </div>
              <button
                onClick={() => setModalShow(false)}
                type="button"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="defaultModal"
              >
                <svg
                  aria-hidden="true"
                  class="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>
            <div class="p-4 space-y-6 flex justify-center">
              <p class="text-base leading-relaxed text-gray-400 dark:text-gray-600">
                {content}
              </p>
            </div>

            <div className="md:pb-4 space-y-6 flex justify-center">
              <form
                style={{ zIndex: "80000" }}
                className="w-[80%] md:w-[20vw]"
                action="#"
                method="POST"
              >
                <div className="md:my-2">
                  <label htmlFor="garminUserId" className="sr-only">
                    Garmin UserId
                  </label>
                  <input
                    value={GarminUserForm?.garminUserId}
                    onChange={(e) =>
                      setGarminUserForm({
                        ...GarminUserForm,
                        garminUserId: e.target.value,
                      })
                    }
                    id="garminUserId"
                    name="garminUserId"
                    type="text"
                    className="bg-theme-blue autofill:bg-slate-800 relative block w-full appearance-none border border-gray-500 px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Garmin UserId"
                    required
                  />
                </div>
                <div className="my-2">
                  <label htmlFor="garminPassword" className="sr-only">
                    Garmin Password
                  </label>
                  <input
                    value={GarminUserForm?.garminPassword}
                    onChange={(e) =>
                      setGarminUserForm({
                        ...GarminUserForm,
                        garminPassword: e.target.value,
                      })
                    }
                    id="garminPassword"
                    name="garminPassword"
                    type="text"
                    className="bg-theme-blue autofill:bg-slate-800 relative block w-full appearance-none border border-gray-500 px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Garmin Password"
                    required
                  />
                </div>
                <ul class="text-sm font-medium text-center text-gray-500 border border-gray-600 divide-x divide-gray-500 shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
                  <span class="w-full">
                    <span
                      onClick={() => setGarminUserForm({
                        ...GarminUserForm,
                        gender: 'male',
                      })}
                      className={`cursor-pointer ${(GarminUserForm?.gender === 'male') && 'bg-theme-blue-secondary text-gray-300'} inline-block w-full p-4 dark:bg-gray-700 dark:text-white`}
                    >
                      Male
                    </span>
                  </span>
                  <span class="w-full">
                    <span
                      onClick={() => setGarminUserForm({
                        ...GarminUserForm,
                        gender: 'female',
                      })}
                      className={`cursor-pointer ${(GarminUserForm?.gender === 'female') && 'bg-theme-blue-secondary text-gray-300'} inline-block w-full p-4 rounded-r-lg hover:text-gray-700 hover:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700`}
                    >
                      Female
                    </span>
                  </span>
                </ul>
                <div className="my-2">
                  <label htmlFor="age" className="sr-only">
                    Age
                  </label>
                  <input
                    value={GarminUserForm?.age}
                    onChange={(e) =>
                      setGarminUserForm({
                        ...GarminUserForm,
                        age: e.target.value,
                      })
                    }
                    id="age"
                    name="age"
                    type="number"
                    min="1"
                    max="120"
                    className="bg-theme-blue autofill:bg-slate-800 relative block w-full appearance-none border border-gray-500 px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Age"
                  />
                </div>
                <div className="my-2">
                  <label htmlFor="weight" className="sr-only">
                    Weight
                  </label>
                  <div class="flex">
                    <input
                      value={GarminUserForm?.weight}
                      onChange={(e) =>
                        setGarminUserForm({
                          ...GarminUserForm,
                          weight: e.target.value,
                        })
                      }
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
            </div>
            {showError && <p className="text-red-500 pb-4 text-center">* {showError}</p>}
            <div className="p-6 md:pt-0 md:pb-10 flex justify-center">
              <button onClick={() => addNewGaminUser()} type="button" className="button-theme font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                SAVE
                {loading && (
                  <svg aria-hidden="true" role="status" className="inline w-4 h-4 ml-3 text-gray-200 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                  </svg>
                )}
              </button>
              <button onClick={() => setModalShow(false)} type="button" className="button-theme font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default GarminModal;