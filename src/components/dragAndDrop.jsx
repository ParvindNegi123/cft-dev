import { useState } from "react";
import csvtojson from "csvtojson";
import { useEffect } from "react";
// import UploadComponent from "./UploadComponent";

const DragAndDrop = ({ inviteBulkUser, uploadLoading, modalShow }) => {
    const [files, setFiles] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [userFormList, setUserFormList] = useState([]);
    const fileReader = new FileReader();

    useEffect(() => {
        setUserFormList([]);
        setFiles('');
    }, [modalShow]);

    const convertCsvToJson = (csvText) => {
        csvtojson()
            .fromString(csvText)
            .then((jsonArrayObj) => {
                setUserFormList(jsonArrayObj);
            })
            .catch((err) => console.error(err));
    };

    const handleUpload = (e) => {
        e.preventDefault();
        const file = e.target.files;
        setFiles(file[0]);
        console.log(file[0], '-----');
        if (file) {
            fileReader.onload = function (event) {
                const csvOutput = event.target.result;
                convertCsvToJson(csvOutput);
            };

            fileReader.readAsText(file[0]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files;
        setFiles(file[0]);
        if (file) {
            fileReader.onload = function (event) {
                const csvOutput = event.target.result;
                convertCsvToJson(csvOutput);
            };

            fileReader.readAsText(file[0]);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const onDragEnter = (event) => {
        event.preventDefault();
        setDragActive(true);
        console.log('enter');
    };

    const onDragLeave = (event) => {
        event.preventDefault();
        setDragActive(false);
        console.log('exit');
    };

    const downloadSampleCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," +
            "firstName,lastName,companyName,personInCharge,email,invitedBy,inviterEmail,typeOfCompany\n" +
            "John,Wick,ABC Company,Person A,abcd@abcd.com,Person B,efgh@abcd.com,IT\n"

        const encodedURI = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedURI);
        link.setAttribute("download", "sample.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div>
            <div style={{ position: "relative" }} className="flex justify-center rounded-lg w-[100%] p-4">
                {!files && (
                    <div style={{ position: "relative", left: '186px', top: '8px', zIndex: 10, height: '120px' }} className="rounded min-w-[360px] h-50">
                        <div style={{ zIndex: 10, height: '132px' }} className={`${dragActive && 'opacity-40'} rounded min-w-[300px] h-50`} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={onDragLeave} onDragEnter={onDragEnter}>

                        </div>
                    </div>
                )}
                {files ? (
                    <div className={`flex justify-center flex-wrap border-dashed rounded-lg`}>
                        <div className="flex flex-wrap justify-center m-1 w-[100%]" >
                            <div className="mb-10 w-[100%]">
                                <div style={{ height: '230px', overflowY: 'scroll' }}>
                                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-400 uppercase bg-theme-blue-secondary">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">
                                                    First Name
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Last Name
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Email
                                                </th>
                                                <th scope="col" className="px-6 py-3">
                                                    Company
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(userFormList.map((data, i) => (
                                                <tr className="border-b border-gray-600">
                                                    <th scope="row" className="px-6 py-2 font-medium text-gray-400 whitespace-nowrap dark:text-white">
                                                        {data?.firstName}
                                                    </th>
                                                    <td className="px-6 py-2 text-gray-300">
                                                        {data?.lastName}
                                                    </td>
                                                    <td className="px-6 py-2 text-gray-300">
                                                        {data?.email}
                                                    </td>
                                                    <td className="px-6 py-2 text-gray-300">
                                                        {data?.companyName}
                                                    </td>
                                                </tr>
                                            )))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div onClick={() => { setFiles(''); setUserFormList([]); }} class="button-theme h-8 cursor-pointer text-white font-medium rounded-md text-sm px-5 text-center inline-flex items-center">
                                Remove File
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ position: "relative", right: '180px' }} className={`flex justify-center flex-wrap ${!dragActive && 'border border-2 border-gray-400 '} border-dashed rounded-lg`}>
                        <div className="flex flex-wrap justify-center m-1" >
                            <div className="flex flex-wrap justify-center w-full h-[110px]">
                                {dragActive && <div className="flex justify-center item-center h-full items-center text-2xl text-gray-400 font-bold w-full"> Drop Here ...</div>}
                                {!dragActive && (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2565cf" class="w-20 h-20">
                                            <path fill-rule="evenodd" d="M19.5 21a3 3 0 003-3V9a3 3 0 00-3-3h-5.379a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H4.5a3 3 0 00-3 3v12a3 3 0 003 3h15zm-6.75-10.5a.75.75 0 00-1.5 0v4.19l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V10.5z" clip-rule="evenodd" />
                                        </svg>
                                        <div className="text-gray-400 text-sm font-semibold text-center w-[300px] pb-10">{dragActive ? 'Drag Here ...' : 'Drag your CSV'}</div>
                                    </>
                                )}
                            </div>
                            <div className="text-gray-400 text-sm text-center font-bold w-[300px] pb-2">OR</div>
                            <label for="dropzone-file">
                                <span class="text-white cursor-pointer bg-[#2565cf] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-md text-sm px-5 py-1 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mb-2">
                                    Browse Files
                                </span>
                            </label>
                            <input id="dropzone-file" type="file" class="hidden" onChange={handleUpload} accept={".csv"} />
                        </div>
                    </div>
                )}
            </div>
            <div class="flex justify-center p-6 space-x-2 rounded-b dark:border-gray-600">
                {files ? (
                    <button onClick={() => inviteBulkUser(userFormList)} data-modal-hide="defaultModal" type="button" className="flex items-center bg-blue-700 text-gray-300 align-middle mx-8 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:text-gray-200 dark:focus:ring-blue-800">
                        INVITE
                        {uploadLoading && (
                            <svg aria-hidden="true" role="status" className="ml-2 inline w-3.5 h-3.5 text-gray-200 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                            </svg>
                        )}
                    </button>
                ) : (
                    <button onClick={() => downloadSampleCSV()} data-modal-hide="defaultModal" type="button" className="flex items-center align-middle mx-8 button-theme font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:text-gray-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        DOWNLOAD SAMPLE CSV
                    </button>
                )}
            </div>
        </div>
    );
}

export default DragAndDrop;