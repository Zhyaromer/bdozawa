import { Slide, ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaExclamationCircle } from "react-icons/fa";
import './css/jobdetails.css'

const Jobdetails2 = () => {
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
    const [isOpen, setIsOpen] = useState(false);
    const [title, settitle] = useState('');
    const [location, setlocation] = useState('');
    const [company, setcompany] = useState('');
    const [postedDate, setPostedDate] = useState('');
    const [langs, setlangs] = useState('')
    const [companyEmail, setcompanyEmail] = useState('');
    const [companyNumber, setcompanyNumber] = useState('');
    const [formattedcompanyNumber, setformattedcompanyNumber] = useState('');
    const [degree, setdegree] = useState('');
    const [degreetype, setdegreetype] = useState('');
    const [experience, setexperience] = useState('');
    const [gender, setgender] = useState('');
    const [jobtype, setjobtype] = useState('');
    const [salary, setsalary] = useState('');
    const [views, setviews] = useState('');
    const [description, setdescription] = useState('');
    const [postedby, setpostedby] = useState('');

    const handleReportClick = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        const suggestionJobs = async () => {
            try {
                const res = await axios.get(`http://localhost:3500/suggestionjobs?jobid=${jobId}`);
            } catch (error) {
                console.log(error);
            }
        }
        suggestionJobs();
    })

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3500/job?jobid=${jobId}`);
                setJob(response.data);
                console.log(response.data)
                settitle(response.data.title)
                setlocation(response.data.location)
                setcompany(response.data.company)
                setPostedDate(response.data.postedAt)
                setlangs(response.data.language.join(' - '))
                setcompanyEmail(response.data.companyEmail)
                setdegree(response.data.degree)
                setdegreetype(response.data.degreetype)
                setexperience(response.data.experience)
                setgender(response.data.gender)
                setjobtype(response.data.jobtype)
                setviews(response.data.views)
                setpostedby(response.data.postedby)

                const text = response.data.description
                const englishLetterCount = (text.match(/[a-zA-Z]/g) || []).length;
                const isEnglishLang = englishLetterCount >= 50;

                if (isEnglishLang) {
                    setisEnglish(true)
                } else {
                    setisEnglish(false)
                }

                setdescription(response.data.description)
                const handleCompanyNumber = (companyNumber) => {
                    let paddedNumber = companyNumber.toString();

                    if (paddedNumber.length === 10) {
                        paddedNumber = '0' + paddedNumber;
                    }

                    const formattedNumber =
                        paddedNumber.slice(0, 4) + " " +
                        paddedNumber.slice(4, 7) + " " +
                        paddedNumber.slice(7, 11);

                    setcompanyNumber(paddedNumber);
                    setformattedcompanyNumber(formattedNumber);
                };

                handleCompanyNumber(response.data.companyNumber);

                if (response.data.salary === 'موچە دیاری نەکراوە' && response.data.salaryrange1 === "" && response.data.salaryrange1 === "") {
                    setsalary(response.data.salary)
                }
                else if (response.data.salaryrange1 !== "" && response.data.salaryrange1 !== "" && response.data.salary === "موچە دیاری نەکراوە") {
                    setsalary(response.data.salaryrange1 + ' - ' + response.data.salaryrange2 + " " + response.data.currency)
                } else {
                    setsalary(response.data.salary + " " + response.data.currency)
                }
                console.log(response.data.currency)
            } catch (error) {
                console.error(error);
            }
        };

        const checkSavedStatus = async () => {
            try {
                const response = await axios.get("http://localhost:3500/favoritejobs", {
                    withCredentials: true,
                });
                const savedJobs = response.data.foundJobs.map((job) => job._id);
                if (savedJobs.includes(jobId)) {
                    setIsSaved(true);
                }
            } catch (err) {
                console.error("Error fetching saved jobs:", err);
            }
        };

        const checkLikedStatus = async () => {
            try {
                const response = await axios.post("http://localhost:3500/likedjobs", { jobId }, { withCredentials: true });
                const likes = response.data.likedjobs.map((like) => like);
                if (likes.includes(jobId)) {
                    setHasLiked(true);
                } else {
                    setHasLiked(false);
                }
            } catch (error) {
                console.error("Error fetching liked jobs:", error);
            }
        }

        const checkdisLikedStatus = async () => {
            try {
                const response = await axios.post("http://localhost:3500/dislikedjobs", { jobId }, { withCredentials: true });
                const dislikes = response.data.dislikedjobs.map((dislike) => dislike);
                if (dislikes.includes(jobId)) {
                    setHasDisliked(true);
                } else {
                    setHasDisliked(false);
                }
            } catch (error) {
                console.error("Error fetching liked jobs:", error);
            }
        }

        if (jobId) {
            fetchJobDetails();
            checkSavedStatus();
            checkLikedStatus();
            checkdisLikedStatus();
        }
    }, [jobId]);

    const like = async () => {
        try {
            const res = await axios.post("http://localhost:3500/likedjobs", { jobId }, { withCredentials: true });
            const likedJobs = res.data.likedjobs;

            setHasLiked(likedJobs.includes(jobId)); // Update state based on response

            setHasLiked((prevHasLiked) => {
                if (!prevHasLiked) {
                    // Like the job
                    axios.post("http://localhost:3500/like", { jobId }, { withCredentials: true })
                        .then((response) => {
                            try {
                                if (response.status === 200) {
                                    toast.success('You liked the job', { transition: Slide });
                                    setLikes(response.data.like);
                                } else if (response.status === 404) {
                                    toast.error(response.data.message || 'You must log in to like a job', { transition: Slide });
                                }
                            } catch (error) {
                                console.error(error);
                                toast.error('An error occurred while liking the job', { transition: Slide });
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                            toast.error('An error occurred while liking the job', { transition: Slide });
                        })
                    // Unselect dislike when liking a job
                    setHasDisliked(false);  // Unselect dislike
                    axios.post("http://localhost:3500/undislike", { jobId }, { withCredentials: true }) // Remove dislike
                        .then((response) => {
                            if (response.status === 200) {
                                setDisLikes(response.data.dislike);
                            } else if (response.status === 404) {
                                toast.error(response.data.message || 'You must log in to like a job', { transition: Slide });
                            }
                        })
                        .catch((error) => console.error(error));
                } else {
                    // Unlike the job
                    axios.post("http://localhost:3500/unlike", { jobId }, { withCredentials: true })
                        .then((response) => {
                            if (response.status === 200) {
                                setLikes(response.data.like);
                            }
                        })
                        .catch((error) => console.error(error));
                }
                return !prevHasLiked;
            });
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                toast.error('You must log in to like a job', { transition: Slide });
            }
        }
    };

    const disLike = async () => {
        try {
            const res = await axios.post("http://localhost:3500/dislikedjobs", { jobId }, { withCredentials: true });
            const disLikedJobs = res.data.dislikedjobs;

            setHasDisliked(disLikedJobs.includes(jobId)); // Update state based on response

            setHasDisliked((prevHasDisliked) => {
                if (!prevHasDisliked) {
                    // Dislike the job
                    axios.post("http://localhost:3500/dislike", { jobId }, { withCredentials: true })
                        .then((response) => {
                            if (response.status === 200) {
                                toast.success('You disliked the job', { transition: Slide });
                                setDisLikes(response.data.dislike);
                            } else if (response.status === 401) {
                                toast.error('You must log in to dislike a job', { transition: Slide });
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                            toast.error('An error occurred while disliking the job', { transition: Slide });
                        })
                    // Unselect like when disliking a job
                    setHasLiked(false);  // Unselect like
                    axios.post("http://localhost:3500/unlike", { jobId }, { withCredentials: true }) // Remove like
                        .then((response) => {
                            if (response.status === 200) {
                                setLikes(response.data.like);
                            }
                        })
                        .catch((error) => console.error(error));
                } else {
                    // Remove dislike
                    axios.post("http://localhost:3500/undislike", { jobId }, { withCredentials: true })
                        .then((response) => {
                            if (response.status === 200) {
                                setDisLikes(response.data.dislike);
                            }
                        })
                        .catch((error) => console.error(error));
                }
                return !prevHasDisliked;
            });
        } catch (error) {
            console.error(error);
            if (error.response.status === 401) {
                toast.error('You must log in to dislike a job', { transition: Slide });
            }
        }
    };

    const unSaveJobs = async () => {
        try {
            const response = await axios.post(
                "http://localhost:3500/unsavejob",
                { jobId },
                { withCredentials: true }
            );
            if (response.status === 200) {
                setIsSaved(false);
            } else if (response.status === 404) {
                toast.error(response.data.message || "You must be logged in to unsave jobs.", { transition: Slide });
            }
        } catch (error) {
            console.error(error);
            alert(error.response.data.message);
        }
    };

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
            return ` ${minutesAgo !== 1 ? '' : ''}` + "" + minutesAgo + " خولەک ";
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
                    <i onClick={goBack} class="fa-solid fa-arrow-left back-icon "></i>
                    <i class="fa-regular fa-bookmark save-icon "></i>
                </div>

                <div className='jobdetails-upper-background'>
                    {/* for the bg or bg color  */}
                </div>


                <div className='jobdetails-upper-infos' >
                    <div className='jobdetails-infos-content'>
                        <div className='jobdetails-upper-infos-content'>
                            <h1>وەستای کارەبا</h1>
                            <p>ڕيسوڵ باقی</p>
                        </div>
                        <div className='jobdetails-lower-infos-content'>
                            <div className='jobdetails-lower-infos-content-grid'>
                                <div>
                                    <i class="fa-regular fa-eye jobdetails-eye-icon"></i>
                                </div>
                                <div>
                                    <p>2000</p>
                                </div>
                            </div>
                            <div className='jobdetails-lower-infos-content-grid'>
                                <div>
                                    <i class="fa-solid fa-location-dot jobdetails-location-icon"></i>
                                </div>
                                <div>
                                    <p>هەڵەبجەی</p>
                                </div>
                            </div>
                            <div className={`jobdetails-lower-infos-content-grid jobdetails-lower-infos-content-email isemailavailable ${companyEmail === "" ? "" : 'hide'}`}>
                                <div>
                                    <i class="fa-solid fa-envelope jobdetails-email-i"></i>
                                </div>
                                <div>
                                    <p>: ئیمەیڵ</p>
                                </div>
                                <div>
                                    <p>zhyarala4443@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='jobdetails-job-info-container'>
                    <div className='jobdetails-job-info-content'>
                        <div className='optional-extra-info-container-content'>
                            <div>
                                <p>دوانزە ڕۆژ لەمەوپێش</p>
                            </div>
                            <div>
                                <i class="fa-regular fa-clock jobdetails-clock-icon"></i>
                            </div>
                        </div>
                        <div className='optional-extra-info-container-content'>
                            <div>
                                <p>موچە : 250 </p>
                            </div>
                            <div>
                                <i class="fa-solid fa-dollar-sign jobdetails-salary-i"></i>
                            </div>
                        </div>
                        <div className={`optional-extra-info-container-content isemailavailable ${jobtype === "" ? "" : 'hide'}`}>
                            <div>
                                <p>جۆری کار : ئێنڵاین </p>
                            </div>
                            <div>
                                <i class="fa-solid fa-briefcase jobdetails-jobtype-i"></i>
                            </div>
                        </div>
                        <div className={`optional-extra-info-container-content isemailavailable ${degreetype === "" ? "" : 'hide'}`}>
                            <div>
                                <p>بواری بروانامە : ئایتی یان سی ئێس</p>
                            </div>
                            <div>
                                <i class="fa-solid fa-graduation-cap jobdetails-degreetype-i"></i>
                            </div>
                        </div>
                        <div className={`optional-extra-info-container-content optional-extra-info-container-content-whatssapp`}>
                            <div>
                                <a className='optional-extra-info-a' href="https://wa.me/+9647703227250/?text=http%3A%2F%2Flocalhost%3A3000%2Fjobs%2Fjobdetails%3Fjobid%3D676c81294aab377963316acd" target="_blank" rel="noreferrer"><p className='optional-extra-info-whatssapp-p'>لە وەتساپ نامە بنێرە</p></a>
                            </div>
                            <div>
                                <i class="fa-brands fa-whatsapp jobdetails-whatsapp-i"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='jobdetails-description-container'>
                    <div className='jobdetails-description-header'>
                        <h2>دەربارەی ئەم کارە</h2>
                    </div>
                    <div>
                        <p className={`jobdetails-description-p ${isEnglish ? "jobdetails-description-p-en" : "jobdetails-description-p-ku"}`}
                            dangerouslySetInnerHTML={{
                                __html: `Full job description
The Assistant Manager will be responsible for assisting in the oversight of gym operations to ensure exceptional “Judgement Free” member experience as well as a financially successful club.


Essential Duties and Responsibilities

Assist in recruiting, hiring, training and developing a high performing staff consisting of Member Service Representatives, Trainers and Custodians.
Assist in maintaining a welcoming atmosphere for all members, prospective members and guests and ensuring staff follows superior customer service guidelines.
Assist with Staff Management and provide backup support to Club Manager as needed
Involved in all front desk related activities
Assist in overseeing cleanliness and maintenance of facility.
Assist in ordering of supplies using specific budget based on club requirements.
Assist in tracking statistics and reports (weekly, monthly, and annually).
Backup support for any employee who is absent.

We are currently holding open interviews for management positions every Monday 10am-12pm at our Somerset Planet Fitness - 1135 Easton Avenue, Somerset, NJ 08873. Submit your online application so it is on file for the hiring manager, then come by our open house and meet our great team!`
                            }} style={{
                                whiteSpace: 'pre-line',
                                fontSize: '18px',
                            }} />
                    </div>
                    <hr />
                </div>




                <div>
                    {isOpen && (
                        <div className="popup-overlay">
                            <div className="popup-content">
                                <button className="close-btn" onClick={handleClose}>
                                    <i className="fa-solid fa-xmark report-xmark"></i>
                                </button>
                                <br />
                                <form>
                                    <div className="form-group">
                                        <label className="job-details-report-label" htmlFor="name">ناوی سیانیت بنوسە</label>
                                        <input className="job-details-report-input" placeholder="ناوت لێرە بنوسە" type="text" id="name" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="job-details-report-label" htmlFor="reason">هۆکاری ریپۆرت کردنەکەت</label>
                                        <select id="reason" className="form-control job-details-report-dropdown" required>
                                            <option value="">هۆکارێک هەلبژێرە</option>
                                            <option value="Fake job">ئەم ئیشە ڕاست نیە</option>
                                            <option value="already got an employment">کارمەندیان دەستکەوتووە</option>
                                            <option value="Misleading Information">زانیاری چەواشەکارانە و هەڵە</option>
                                            <option value="fake company">ئەم شوێنە بوونی نیە</option>
                                            <option value="Duplicate Listing">ئیشی دووبارە</option>
                                            <option value="Fake Employer">ئەم کەسە خاوەنی ئەم ئیشە نییە</option>
                                            <option value="other">هیتر</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="job-details-report-label" htmlFor="feedback">زانیاری ڕیپۆرت (ئارەزوومەندانەیە)</label>
                                        <textarea
                                            id="feedback"
                                            className="form-control job-details-report-textarea"
                                            rows="5"
                                            placeholder="تکایە ئاگادارمان بکەرەوە بۆچی ئەم کارە ڕاپۆرت دەکەیت (بۆ نموونە، چەواشەکاری، فێڵکردن)، فیدباکەکانت یارمەتیدەرمانە بۆ باشترکردنی کوالیتی کارەکە بۆ هەمووان"
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-primary job-details-report-button">
                                            ناردن
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
                <div className='optional-extra-info-container-2-container'>
                    <div className='optional-extra-info-container-2'>
                        <div>
                            <p className='optional-extra-info-p-user'>{postedby} <i class="fa-solid fa-user"></i> </p>
                        </div>
                        <hr className='optional-extra-info-container-2-hr' />
                        <div>
                            <p onClick={handleReportClick} className='optional-extra-info-p-report'><a href="#" onClick={(event) => event.preventDefault()}><i class="fa-solid fa-triangle-exclamation"></i> ڕیپۆرت</a></p>
                        </div>
                        <div>
                            <p onclick={copyurl} className='optional-extra-info-p-share'><a href="#" onClick={(event) => event.preventDefault()}><i class="fa-solid fa-share"></i>  شەیری بکە</a></p>
                        </div>
                        <div >
                            <p className='optional-extra-info-p-vip'><a href="#" onClick={(event) => event.preventDefault()}><i class="fa-solid fa-star"></i> VIP بیکە ڕیکلامی </a></p>
                        </div>
                    </div>
                </div>
                <div className='jobdetails-recommended-jobs-container'>
                    <div className='jobdetails-recommended-jobs-title'>
                        <h2>کاری پەیواندیدار</h2>
                    </div>

                    <div className='jobdetails-recommendedjobs'>
                        <div className='responsivejobs-container'>
                            {/* {filteredJob.length > 0 ? (
                                filteredJob.map((job) => ( */}
                            <div className='jobs-container'>
                                <div className='job-card'>
                                    <div className='job-card-content'>
                                        <div className='job-card-upper'>
                                            <div className='upper-img-container'>
                                                <img className='job-img' src='images.png' width={50} height={50} alt='job' />
                                            </div>
                                            <div className='upper-title-container'>
                                                <h1 className='job-title'>123</h1>
                                            </div>
                                            <div className='upper-favicon-container'>
                                                <i
                                                    className={`fa-solid fa-bookmark fav-icon`}></i>
                                            </div>
                                        </div>
                                        <div className='job-info-title'>
                                            <p className='job-info'></p>
                                            <p className='job-info'></p>
                                        </div>
                                        <div style={{ marginTop: '-30px' }}>
                                            <div className='job-langs-container'>
                                                <p className='job-langs'>  : زمان</p>
                                            </div>
                                            <div className='job-exp-container'>
                                                <p className='job-exp'>  :  ئەزموون  </p>
                                            </div>
                                            <div className='job-gender-container'>
                                                <p className='job-gender'> : ڕەگەز</p>
                                            </div>
                                            <div className='job-gender-container'>
                                                <p className='job-gender'>  :  شەهادە</p>
                                                <div className='job-btn-container'>
                                                    <p className='job-info job-posted'></p>
                                                    <button className='view-job-btn'>بینینی زیاتر</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* ))
                            ) : (
                                <p>هیچ کارێکی پەیواندیدار نەدۆزرایەوە</p>
                            )} */}
                        </div>
                    </div>
                    <ToastContainer position="top-center" />
                </div>
                <footer className='footer-main'>
                    <div className='footer-container'>
                        <div className='footer-main-div'>
                            <h2 className='footer-h2'>Jobify</h2>
                            <p className='footer-p1'>ماڵپەڕەکەمان پلاتفۆرمێکە کە دەتوانیت بە ئاسانی و بە خێرایی کار بدۆزیتەوە. هەروەها دەتوانیت کارەکەت لێرە بڵاو بکەیتەوە و باشترین کاندید بدۆزیتەوە بۆ کارەکەت.</p>
                            <div className='footer-main-social'>
                                <a className='socials' href="/"><i class="fa-brands fa-facebook"></i></a>
                                <a className='socials' href="/"><i class="fa-brands fa-tiktok"></i></a>
                                <a className='socials' href="/"><i class="fa-brands fa-instagram"></i></a>
                            </div>
                        </div>
                        <div className='footer-main-secs'>
                            <div className='footer-main-sec-links'>
                                <h3 className='footer-h3'>یارمەتی</h3>
                                <ul className='footer-ul'>
                                    <li><a href="/">پرسیارە دووبارەکان</a></li>
                                    <li><a href="/jobs">یارمەتی بەدەست بهێنە</a></li>
                                    <li><a href="/jobs">پەیوەندیکردن</a></li>
                                    <li><a href="/jobs">ڕێنمایی</a></li>
                                    <li><a href="/jobs">ڕیکلام کردن</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className='footer-main-secs'>
                            <div className='footer-main-sec-links'>
                                <h3 className='footer-h3'>کارەکان</h3>
                                <ul className='footer-ul'>
                                    <li><a href="/">بینینی ئیشەکان</a></li>
                                    <li><a href="/jobs">ئیشی ڤی ئای پی</a></li>
                                    <li><a href="/jobs">دۆزینەوەی هەلی کار</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className='footer-main-secs'>
                            <div className='footer-main-sec-links'>
                                <h3 className='footer-h3'>هەژمار</h3>
                                <ul className='footer-ul'>
                                    <li><a href="/jobs">چونە ژوورەوە</a></li>
                                    <li><a href="/">دروستکرندی هەژمار</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='footer-bottom'>
                        <div className='footer-bottom-line'>
                        </div>
                        <div className='footer-bottom-txt'>
                            <p className='footer-bottom-p'>هەموو مافێک پارێزراوە بۆ جۆبی فای &copy; 2025</p>
                        </div>
                        <p className='powerby-p'>powered by <a className='powerby-a' target='_blank' rel="noreferrer" href="https://www.facebook.com/zhyaromer999/">zhyar omer</a></p>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default Jobdetails2;