import { Slide, ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaExclamationCircle } from "react-icons/fa";
import { franc } from 'franc-min';
import './css/jobdetails.css'

const JobDetails = () => {
    const navigate = useNavigate();
    const seachParams = new URLSearchParams(window.location.search);
    const jobId = seachParams.get('jobid');
    const [job, setJob] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [hasDisliked, setHasDisliked] = useState(false);
    const [dislikes, setDisLikes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEnglish, setisEnglish] = useState(false);

    useEffect(() => {
        const text = `ob description
Quality Control Manager is in charge of Product Quality, which includes supervising the production process to make sure that all products meet consistent standards. His duties include developing and implementing quality control tests, inspecting products at various stages and writing reports documenting production issues.



General Duties and Responsibilities:

· Implementing methods to inspect, test and evaluate products and production equipment.

· Ensuring that products adhere to quality standards.

· Preparing reports by collecting, analysing and summarizing data.

· Working according to deadlines for the delivery of products.

· Training and managing production line staff in production practices and quality assessment of goods.

· Tracking products through the manufacturing process to guarantee that each part of the process is correct.

· Performing detailed and recorded inspections of final products so the products are up to industry and company standards.

· Dealing with customers complaints and issues.



Requirements:

BSC Degree or similar.
5+ years quality experience in manufacturing environment PET machines.
ISO 9001, ISO 14001, FSC22000 OSHA
Analytical prowess to allow comprehension of scientific/technical journals, financial reports, and legal regulations.
Skills in monitoring and measurement of process control, auditing, manufacturing of food products, sanitation process, knowledge of HACCP, SSOP regulations, skills in team leadership and root cause analysis
Excellent intra/inter-department communication skills with attention to detail and organization.


What the company Offers:

- Comprehensive Medical Coverage within the company.

- Accommodation with full utilities (including food, electricity, etc.).

- Visa, work permit, and a full onboarding process.

- Annual Vacation Allowance and 30 Days’ Paid Annual Leave.

- Competitive salary package and Bonus.

- Opportunities for Professional Development and career growth`;

        const englishLetterCount = (text.match(/[a-zA-Z]/g) || []).length;
        const isEnglishLang = englishLetterCount >= 50;

        console.log(`Is the text using the English alphabet? ${isEnglishLang}`);
        if (isEnglishLang) {
            setisEnglish(true)
        } else {
            setisEnglish(false)
        }
    })

    // useEffect(() => {
    //     const fetchJobDetails = async () => {
    //         try {
    //             const response = await axios.get(`http://localhost:3500/job?jobid=${jobId}`);
    //             setJob(response.data);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };

    //     const checkSavedStatus = async () => {
    //         try {
    //             const response = await axios.get("http://localhost:3500/favoritejobs", {
    //                 withCredentials: true,
    //             });
    //             const savedJobs = response.data.foundJobs.map((job) => job._id);
    //             if (savedJobs.includes(jobId)) {
    //                 setIsSaved(true);
    //             }
    //         } catch (err) {
    //             console.error("Error fetching saved jobs:", err);
    //         }
    //     };

    //     const checkLikedStatus = async () => {
    //         try {
    //             const response = await axios.post("http://localhost:3500/likedjobs", { jobId }, { withCredentials: true });
    //             const likes = response.data.likedjobs.map((like) => like);
    //             console.log(likes);
    //             if (likes.includes(jobId)) {
    //                 setHasLiked(true);
    //             } else {
    //                 setHasLiked(false);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching liked jobs:", error);
    //         }
    //     }

    //     const checkdisLikedStatus = async () => {
    //         try {
    //             const response = await axios.post("http://localhost:3500/dislikedjobs", { jobId }, { withCredentials: true });
    //             const dislikes = response.data.dislikedjobs.map((dislike) => dislike);
    //             console.log(dislikes);
    //             if (dislikes.includes(jobId)) {
    //                 setHasDisliked(true);
    //             } else {
    //                 setHasDisliked(false);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching liked jobs:", error);
    //         }
    //     }

    //     if (jobId) {
    //         fetchJobDetails();
    //         checkSavedStatus();
    //         checkLikedStatus();
    //         checkdisLikedStatus();
    //     }
    // }, [jobId]);

    // const like = async () => {
    //     try {
    //         const res = await axios.post("http://localhost:3500/likedjobs", { jobId }, { withCredentials: true });
    //         const likedJobs = res.data.likedjobs;

    //         setHasLiked(likedJobs.includes(jobId)); // Update state based on response

    //         setHasLiked((prevHasLiked) => {
    //             if (!prevHasLiked) {
    //                 // Like the job
    //                 axios.post("http://localhost:3500/like", { jobId }, { withCredentials: true })
    //                     .then((response) => {
    //                         try {
    //                             console.log(`response.status: ${response.status}`);
    //                             if (response.status === 200) {
    //                                 toast.success('You liked the job', { transition: Slide });
    //                                 setLikes(response.data.like);
    //                             } else if (response.status === 404) {
    //                                 toast.error(response.data.message || 'You must log in to like a job', { transition: Slide });
    //                             }
    //                         } catch (error) {
    //                             console.error(error);
    //                             toast.error('An error occurred while liking the job', { transition: Slide });
    //                         }
    //                     })
    //                     .catch((error) => {
    //                         console.error(error);
    //                         toast.error('An error occurred while liking the job', { transition: Slide });
    //                     })
    //                 // Unselect dislike when liking a job
    //                 setHasDisliked(false);  // Unselect dislike
    //                 axios.post("http://localhost:3500/undislike", { jobId }, { withCredentials: true }) // Remove dislike
    //                     .then((response) => {
    //                         if (response.status === 200) {
    //                             setDisLikes(response.data.dislike);
    //                         } else if (response.status === 404) {
    //                             toast.error(response.data.message || 'You must log in to like a job', { transition: Slide });
    //                         }
    //                     })
    //                     .catch((error) => console.error(error));
    //             } else {
    //                 // Unlike the job
    //                 axios.post("http://localhost:3500/unlike", { jobId }, { withCredentials: true })
    //                     .then((response) => {
    //                         if (response.status === 200) {
    //                             setLikes(response.data.like);
    //                         }
    //                     })
    //                     .catch((error) => console.error(error));
    //             }
    //             return !prevHasLiked;
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         if (error.response.status === 401) {
    //             toast.error('You must log in to like a job', { transition: Slide });
    //         }
    //     }
    // };

    // const disLike = async () => {
    //     try {
    //         const res = await axios.post("http://localhost:3500/dislikedjobs", { jobId }, { withCredentials: true });
    //         const disLikedJobs = res.data.dislikedjobs;

    //         setHasDisliked(disLikedJobs.includes(jobId)); // Update state based on response

    //         setHasDisliked((prevHasDisliked) => {
    //             if (!prevHasDisliked) {
    //                 // Dislike the job
    //                 axios.post("http://localhost:3500/dislike", { jobId }, { withCredentials: true })
    //                     .then((response) => {
    //                         if (response.status === 200) {
    //                             toast.success('You disliked the job', { transition: Slide });
    //                             setDisLikes(response.data.dislike);
    //                         } else if (response.status === 401) {
    //                             toast.error('You must log in to dislike a job', { transition: Slide });
    //                         }
    //                     })
    //                     .catch((error) => {
    //                         console.error(error);
    //                         toast.error('An error occurred while disliking the job', { transition: Slide });
    //                     })
    //                 // Unselect like when disliking a job
    //                 setHasLiked(false);  // Unselect like
    //                 axios.post("http://localhost:3500/unlike", { jobId }, { withCredentials: true }) // Remove like
    //                     .then((response) => {
    //                         if (response.status === 200) {
    //                             setLikes(response.data.like);
    //                         }
    //                     })
    //                     .catch((error) => console.error(error));
    //             } else {
    //                 // Remove dislike
    //                 axios.post("http://localhost:3500/undislike", { jobId }, { withCredentials: true })
    //                     .then((response) => {
    //                         if (response.status === 200) {
    //                             setDisLikes(response.data.dislike);
    //                         }
    //                     })
    //                     .catch((error) => console.error(error));
    //             }
    //             return !prevHasDisliked;
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         if (error.response.status === 401) {
    //             toast.error('You must log in to dislike a job', { transition: Slide });
    //         }
    //     }
    // };

    // const unSaveJobs = async () => {
    //     try {
    //         const response = await axios.post(
    //             "http://localhost:3500/unsavejob",
    //             { jobId },
    //             { withCredentials: true }
    //         );
    //         if (response.status === 200) {
    //             setIsSaved(false);
    //         } else if (response.status === 404) {
    //             toast.error(response.data.message || "You must be logged in to unsave jobs.", { transition: Slide });
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         alert(error.response.data.message);
    //     }
    // };

    if (error)
        return (
            <div className="text-center text-danger py-5">
                <FaExclamationCircle className="fa-3x" />
                <p>Error: {error}</p>
            </div>
        );

    const formatDate = (date) => {
        const postedDate = new Date(date);
        const now = new Date();
        const timeDifference = now - postedDate;
        const secondsAgo = Math.floor(timeDifference / 1000);
        const minutesAgo = Math.floor(secondsAgo / 60);
        const hoursAgo = Math.floor(minutesAgo / 60);
        const daysAgo = Math.floor(hoursAgo / 24);

        if (secondsAgo < 60) {
            return `${secondsAgo} چرکە${secondsAgo !== 1 ? 'چرکە' : ''} لەمەوپێش`;
        } else if (minutesAgo < 60) {
            return `${minutesAgo} خولەک${minutesAgo !== 1 ? '' : ''} لەمەوپێش`;
        } else if (hoursAgo < 24) {
            return `${hoursAgo} کاتژمێر${hoursAgo !== 1 ? '' : ''} لەمەوپێش`;
        } else {
            return ` ${daysAgo !== 1 ? '' : ''}   ${daysAgo} لەمەوپێش ڕؤژ`;
        }
    };

    const copyurl = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('URL copied to clipboard', { transition: Slide });
    }

    const goBack = () => {
        navigate(-1);
    }
    return (
        <div>
            <div className='jobdetails-container'>
                <div className='back-save-container'>
                    <i onclick={goBack} class="fa-solid fa-arrow-left back-icon "></i>
                    <i class="fa-regular fa-bookmark save-icon "></i>
                </div>

                <div className='jobdetails-upper-info'>
                    <div className='jobdetails-bg-container'>
                        <div className='img-placer'>
                            <img className='jobdetails-img' src='https://via.placeholder.com/150/ff0000/ffffff?text=Placeholder' alt="" />
                        </div>
                        <div className='job-title-container'>
                            <h3 className='jobdetails-title'>حسابات و ژمێریاری</h3>
                        </div>
                        <div className='jobdetails-info-container'>
                            <p className='jobdetails-info'>گوگڵ</p>
                            <p className='jobdetails-info'>سلێمانی</p>
                            <p className='jobdetails-info'>دوو ڕۆژ لەمەوپێش</p>
                        </div>
                        <div className='jobdetails-info-container jobdetails-info-container-2'>
                            <p className='jobdetails-info'>زمان : کوردی-عەرەبی-ئینگلیزی</p>
                            <p className='jobdetails-info'>شەهادەی زانکۆ</p>
                        </div>

                        <div className='jobdetails-info-container jobdetails-info-container-2 like-dislike-view'>
                            <div className='like-dislike-container'>
                                <button
                                    className={`like-button ${hasLiked ? "active" : ""}`}
                                >
                                    <i className={`fa${hasLiked ? "-solid" : "-regular"} fa-thumbs-up`}></i> {likes}
                                </button>

                                <button
                                    className={`dislike-button ${hasDisliked ? "active" : ""}`}
                                >
                                    <i className={`fa${hasDisliked ? "-solid" : "-regular"} fa-thumbs-down`}></i> {dislikes}
                                </button>
                            </div>
                            <div>
                                <i class="fa-solid fa-eye"></i> 250
                            </div>
                        </div>
                    </div>
                    <div className='jobdetails-lower-info'>
                        <div className='jobdetails-lower-info-container'>
                            <div className='jobdetails-lower-info-container-each'>
                                <div className='jobdetails-lower-info-icon first-one-container'>
                                    <i class="fa-solid fa-user circle-icon first-one-icon"></i>
                                </div>
                                <div className='jobdetails-lower-info-text'>
                                    <p className='jobdetails-lower-info-p'>ڕەگەز</p>
                                    <p className='jobdetails-lower-info-p2'>نێر</p>
                                </div>
                            </div>
                            <div className='jobdetails-lower-info-container-each'>
                                <div className='jobdetails-lower-info-icon second-one-container'>
                                    <i class="fa-solid fa-briefcase circle-icon first-one-icon"></i>
                                </div>
                                <div className='jobdetails-lower-info-text'>
                                    <p className='jobdetails-lower-info-p'>ئەزموون</p>
                                    <p className='jobdetails-lower-info-p2'>٥ ساڵ یان زیاتر</p>
                                </div>
                            </div>
                            <div className='jobdetails-lower-info-container-each'>
                                <div className='jobdetails-lower-info-icon third-one-container'>
                                    <i class="fa-solid fa-phone-flip circle-icon first-one-icon"></i>
                                </div>
                                <div className='jobdetails-lower-info-text'>
                                    <p className='jobdetails-lower-info-p'>ژ.مۆبایل</p>
                                    <a className='jobdetails-lower-info-phone-num-a' href="tel:7703227250"> <p className='jobdetails-lower-info-p2'>770 322 7250</p></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='optional-extra-info'>
                    <div className='optional-extra-info-container'>
                        <div>
                            <p className='optional-extra-info-p'>موچە : $250 <i style={{ color: 'green' }} class="fa-solid fa-dollar-sign"></i></p>
                        </div>
                        <div>
                            <p className='optional-extra-info-p'>zhyaraland123@gmail.com : ئیمەیڵ <i style={{ color: '#007BFF' }} class="fa-solid fa-envelope"></i></p>
                        </div>
                        <div>
                            <p className='optional-extra-info-p'>بواری بروانامە : ژمێریاری <i class="fa-solid fa-graduation-cap"></i></p>
                        </div>
                    </div>
                </div>
                <hr />
                <div className='jobdetails-description-container'>
                    <div className='jobdetails-description-header'>
                        <h3>دەربارەی ئیشەکە</h3>
                    </div>

                    <div>
                        <p className={`jobdetails-description-p ${isEnglish ? "jobdetails-description-p-en" : "jobdetails-description-p-ku"}`}
                            dangerouslySetInnerHTML={{
                                __html: `ob description

Quality Control Manager is in charge of Product Quality, which includes supervising the production process to make sure that all products meet consistent standards. His duties include developing and implementing quality control tests, inspecting products at various stages and writing reports documenting production issues.



General Duties and Responsibilities:

· Implementing methods to inspect, test and evaluate products and production equipment.

· Ensuring that products adhere to quality standards.

· Preparing reports by collecting, analysing and summarizing data.

· Working according to deadlines for the delivery of products.

· Training and managing production line staff in production practices and quality assessment of goods.

· Tracking products through the manufacturing process to guarantee that each part of the process is correct.

· Performing detailed and recorded inspections of final products so the products are up to industry and company standards.

· Dealing with customers complaints and issues.



Requirements:

BSC Degree or similar.
5+ years quality experience in manufacturing environment PET machines.
ISO 9001, ISO 14001, FSC22000 OSHA
Analytical prowess to allow comprehension of scientific/technical journals, financial reports, and legal regulations.
Skills in monitoring and measurement of process control, auditing, manufacturing of food products, sanitation process, knowledge of HACCP, SSOP regulations, skills in team leadership and root cause analysis
Excellent intra/inter-department communication skills with attention to detail and organization.


What the company Offers:

- Comprehensive Medical Coverage within the company.

- Accommodation with full utilities (including food, electricity, etc.).

- Visa, work permit, and a full onboarding process.

- Annual Vacation Allowance and 30 Days’ Paid Annual Leave.

- Competitive salary package and Bonus.

- Opportunities for Professional Development and career growth.
    `}} style={{
                                whiteSpace: 'pre-line',
                                fontSize: '18px',
                            }} />
                    </div>
                    <hr />
                    <div className='jobdetails-botoom-container'>
                        <div className='jobdetails-botoom-content'>
                            <p>ژیار عومەر <i class="fa-solid fa-user"></i> </p>
                            <button className='jobdetails-botoom-report-button'><i class="fa-solid fa-triangle-exclamation"></i> ڕیپۆرت</button>
                            <button className='jobdetails-botoom-vip-button'><i class="fa-solid fa-star"></i> VIP بیکە ڕیکلامی </button>
                        </div>
                    </div>
                    <hr />
                </div>
            </div>
        </div>
    )
}

export default JobDetails