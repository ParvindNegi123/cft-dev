import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../config";
import Skeleton from "react-loading-skeleton";
import './PopUp.css';

const EditProfilebyUsrPopUp = ({ handlePopUp }) => {
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    weight: "",
    height: ""
  });
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    weight: "",
    height: ""
  });
  const [profileImage, setProfileImage] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setProfileImage(files[0]);
    } else {
      setUserForm({
        ...userForm,
        [name]: value
      });
    }
  };

  const handleGenderChange = (e) => {
    setUserForm({
      ...userForm,
      gender: e.target.value
    });
  };

  const updateProfile = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fullName = `${userForm.firstName} ${userForm.lastName}`;
    const formData = new FormData();

    formData.append("firstName", userForm.firstName);
    formData.append("lastName", userForm.lastName);
    formData.append("email", userForm.email);
    formData.append("password", userForm.password);
    formData.append("age", userForm.age);
    formData.append("gender", userForm.gender);
    formData.append("weight", userForm.weight);
    formData.append("height", userForm.height);
    formData.append("name", fullName);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    axios({
      headers: {
        "x-access-token": localStorage.getItem("auth-token"),
        "Content-Type": "multipart/form-data",
      },
      url: `${BASE_URL}/user/profile`,
      method: 'POST',
      data: formData
    }).then((res) => {
      setLoading(false);
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

  const getProfile = () => {
    setError("");
    setProfileLoading(true);
    axios({
      headers: {
        "x-access-token": localStorage.getItem("auth-token"),
      },
      url: `${BASE_URL}/user/profile`,
      method: 'GET'
    }).then((res) => {
      const userData = res?.data?.data;
      const [firstName, lastName] = userData.name.split(" ");
      setUser({
        ...userData,
        firstName,
        lastName
      });
      setUserForm({
        ...userData,
        firstName,
        lastName
      });
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

  return (
    <>
      <div className="edit-user-page sign-in-default">
        <div className="container">
          <span className="close-btn" onClick={() => { handlePopUp(0) }} >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
          <div className="form-box-outer">
            <div className="form-box">
              <h1>Edit Profile Page</h1>
              {profileLoading ? (
                <Skeleton count={5} />
              ) : (
                <form onSubmit={updateProfile}>
                  <div className="input-box">
                    <div className="heading">First Name</div>
                    <input
                      value={userForm.firstName}
                      onChange={handleInputChange}
                      id="firstName"
                      name="firstName"
                      type="text"
                    />
                  </div>
                  <div className="input-box">
                    <div className="heading">Last Name</div>
                    <input
                      value={userForm.lastName}
                      onChange={handleInputChange}
                      id="lastName"
                      name="lastName"
                      type="text"
                    />
                  </div>
                  <div className="input-box">
                    <div className="heading">Age</div>
                    <input
                      value={userForm.age}
                      onChange={handleInputChange}
                      id="age"
                      name="age"
                      type="number"
                    />
                  </div>
                  <div className="input-box radio-box">
                    <div className="heading">Gender</div>
                    <div>
                      <label>
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={userForm.gender === "male"}
                          onChange={handleGenderChange}
                        />
                        Male
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={userForm.gender === "female"}
                          onChange={handleGenderChange}
                        />
                        Female
                      </label>
                    </div>
                  </div>
                  <div className="input-box">
                    <div className="heading">Weight</div>
                    <input
                      value={userForm.weight}
                      onChange={handleInputChange}
                      id="weight"
                      name="weight"
                      type="text"
                    />
                  </div>
                  <div className="input-box">
                    <div className="heading">Height</div>
                    <input
                      value={userForm.height}
                      onChange={handleInputChange}
                      id="height"
                      name="height"
                      type="text"
                    />
                  </div>
                  <div className="input-box">
                    <div className="heading">Profile Image</div>
                    <input
                      type="file"
                      name="profileImage"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="submit-box">
                    <button type="submit">Update</button>
                    <button type="button" className="cancel-btn" onClick={() => handlePopUp(0)}>Cancel</button>
                  </div>
                  {loading && <Skeleton count={5} />}
                  {error && <div className="error-message">{error}</div>}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfilebyUsrPopUp;




////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { BASE_URL } from "../../config";
// import Skeleton from "react-loading-skeleton";
// import './PopUp.css';

// const EditProfilebyUsrPopUp = ({handlePopUp}) => {
//   const [loading, setLoading] = useState(false);
//   const [profileLoading, setProfileLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [user, setUser] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     age: "",
//     gender: "",
//     weight: "",
//     height: ""
//   });
//   const [userForm, setUserForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     age: "",
//     gender: "",
//     weight: "",
//     height: ""
//   });

//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     getProfile();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUserForm({
//       ...userForm,
//       [name]: value
//     });
//   };

//   const handleGenderChange = (e) => {
//     setUserForm({
//       ...userForm,
//       gender: e.target.value
//     });
//   };

//   const updateProfile = (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     const fullName = `${userForm.firstName} ${userForm.lastName}`;

//     axios({
//       headers: {
//         "x-access-token": localStorage.getItem("auth-token"),
//       },
//       url: `${BASE_URL}/user/profile`, // your url
//       method: 'POST',
//       data: {
//         ...userForm,
//         name: fullName
//       }
//     }).then((res) => {
//       setLoading(false);
//       getProfile();
//     }).catch((err) => {
//       if (err?.response?.data?.message) {
//         setError(err?.response?.data?.message);
//         setTimeout(() => {
//           setError("");
//         }, 3000);
//       }
//       setLoading(false);
//     });
//   };

//   const getProfile = () => {
//     setError("");
//     setProfileLoading(true);
//     axios({
//       headers: {
//         "x-access-token": localStorage.getItem("auth-token"),
//       },
//       url: `${BASE_URL}/user/profile`, // your url
//       method: 'GET'
//     }).then((res) => {
//       const userData = res?.data?.data;
//       const [firstName, lastName] = userData.name.split(" ");
//       setUser({
//         ...userData,
//         firstName,
//         lastName
//       });
//       setUserForm({
//         ...userData,
//         firstName,
//         lastName
//       });
//       setProfileLoading(false);
//     }).catch((err) => {
//       if (err?.response?.data?.message) {
//         setError(err?.response?.data?.message);
//         setTimeout(() => {
//           setError("");
//         }, 3000);
//       }
//       setProfileLoading(false);
//     });
//   };

//   return (
//     <>
//       <div className="edit-user-page sign-in-default">
//         <div className="container">
//           <span className="close-btn" onClick={()=>{handlePopUp(0)}} >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//             </svg>
//           </span>
//           <div className="form-box-outer">
//             <div className="form-box">
//               <h1>Edit Profile Page</h1>
//               {profileLoading ? (
//                 <Skeleton count={5} />
//               ) : (
//                 <form onSubmit={updateProfile}>
//                   <div className="input-box">
//                     <div className="heading">First Name</div>
//                     <input
//                       value={userForm.firstName}
//                       onChange={handleInputChange}
//                       id="firstName"
//                       name="firstName"
//                       type="text"
//                     />
//                   </div>
//                   <div className="input-box">
//                     <div className="heading">Last Name</div>
//                     <input
//                       value={userForm.lastName}
//                       onChange={handleInputChange}
//                       id="lastName"
//                       name="lastName"
//                       type="text"
//                     />
//                   </div>
//                   <div className="input-box">
//                     <div className="heading">Age</div>
//                     <input
//                       value={userForm.age}
//                       onChange={handleInputChange}
//                       id="age"
//                       name="age"
//                       type="number"
//                     />
//                   </div>
//                   <div className="input-box radio-box">
//                     <div className="heading">Gender</div>
//                     <div>
//                       <label>
//                         <input
//                           type="radio"
//                           name="gender"
//                           value="male"
//                           checked={userForm.gender === "male"}
//                           onChange={handleGenderChange}
//                         />
//                         Male
//                       </label>
//                       <label>
//                         <input
//                           type="radio"
//                           name="gender"
//                           value="female"
//                           checked={userForm.gender === "female"}
//                           onChange={handleGenderChange}
//                         />
//                         Female
//                       </label>
//                     </div>
//                   </div>
//                   <div className="input-box">
//                     <div className="heading">Weight</div>
//                     <input
//                       value={userForm.weight}
//                       onChange={handleInputChange}
//                       id="weight"
//                       name="weight"
//                       type="text"
//                     />
//                   </div>
//                   <div className="input-box">
//                     <div className="heading">Height</div>
//                     <input
//                       value={userForm.height}
//                       onChange={handleInputChange}
//                       id="height"
//                       name="height"
//                       type="text"
//                     />
//                   </div>
//                   <div className="submit-box">
//                     <button type="submit">Update</button>
//                     <button type="button" className="cancel-btn" onClick={() => handlePopUp(0)}>Cancel</button>
//                   </div>
//                   {loading && <Skeleton count={5} />}
//                   {error && <div className="error-message">{error}</div>}
//                 </form>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EditProfilebyUsrPopUp;
