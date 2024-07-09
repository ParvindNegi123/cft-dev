import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { BASE_URL } from "../config";
const ForumEdit = ({ forumData, goBack, getHealthyContentList }) => {

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
        title: forumData.title,
        content: forumData.content,
        threadBy: forumData.threadBy
    });
    const [showForumDetail, setShowForumDetail] = useState('');
    const [showError, setShowError] = useState(false);
    const [formClicked, setFormClicked] = useState(false);
    const [loading, setLoading] = useState(false);

    const editorRef = useRef(null);
    const getText = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
            setFormData({ ...formData, content: editorRef.current.getContent() })
        }
    };

    const [inputValue, setInputValue] = useState(forumData.title);

    const handleChange = (e) => {
        setInputValue(e.target.value); // Update the inputValue state with the new value
        setFormData({ ...formData, title: e.target.value })
      };


    const navigate = useNavigate();

    useEffect(() => {
        if (!formClicked) {
            return;
        }
        if (!formData?.title || !formData?.content) {
            setShowError(true);
            return;
        } else {
            setShowError(false);
        }
    }, [formData]);

    const updateForumPost = () => {
        setLoading(true);
        setFormClicked(true);
        if (!formData?.title || !formData?.content) {
            setShowError(true);
            setLoading(false);
            return;
        }
        axios({
            headers: {
                "x-access-token": localStorage.getItem('auth-token')
            },
            url: `${BASE_URL}/forum`, //your url
            method: 'put',
            data: formData
        }).then((res) => {
            setLoading(false);
            goBack();
            getHealthyContentList();
        });
    };

    return (
        <div className="bg-theme-blue dark:bg-slate-900 h-[80vh] md:w-[80%] md:my-6 mx-4 p-6 md:px-44 md:py-14 rounded md:mx-20" >
            <div className="pb-6 text-center text-gray-200">Edit Post</div>

            <button onClick={() => goBack()} type="button" className="flex items-center bg-theme-blue-secondary text-gray-200 p-2 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fill-rule="evenodd" d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z" clip-rule="evenodd" />
                </svg>
            </button>

            <div className="mb-4 mt-6">
                <div className="pb-2 text-left text-gray-200">Subject</div>
                <input value={inputValue} onChange={handleChange} type="text" className="bg-theme-blue autofill:bg-slate-800 relative block w-full appearance-none border border-[#2d3d5c] px-3 py-2 text-gray-300 placeholder-gray-600 focus:z-10 focus:border-gray-400 focus:outline-none focus:ring-indigo-500 sm:text-sm" placeholder="subject" required />
            </div>

            <div className="pb-2 text-left text-gray-200">Content</div>
            <Editor
                className="bg-theme-blue-secondary"
                onMouseLeave={() => getText()}
                apiKey='g64cjnqhg5z2xyt5dqqnvtvugubbr19suf3mljwa9h2ys1sr'
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={forumData.content || ''}
                init={{
                    height: 300,
                    menubar: true,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'fontsize' // Add 'fontsize' plugin
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor image | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | fontsizeselect | help',
                    header_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: #202c40; color: white; }',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color: #202c40; color: white; }'
                }}
            />

            {/* <textarea onChange={(e) => setFormData({ ...formData, content: e.target.value })} id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-400 bg-slate-900 rounded-lg border border-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="message" required></textarea> */}
            {showError && <p className="text-red-500 my-2">* subject or message cannot be empty</p>}
            <div className="my-6 flex">
                <button onClick={() => updateForumPost()} type="button" className="button-theme font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
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
    )
}
export default ForumEdit;