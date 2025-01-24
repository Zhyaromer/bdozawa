import Nav from './Nav.jsx'
import React, { useState, useEffect } from 'react';
import { Slide, ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/savedjobs.css'

const Savedjobs = () => {
    const [jobs, setJobs] = useState([]);
    const [savedJobs, setSavedJobs] = useState([]);
    const isJobSaved = (jobId) => savedJobs.includes(jobId);
    const navigate = useNavigate();

    const saveJobs = async (jobId) => {
        try {
            const response = await axios.post("http://localhost:3500/savedjobs", { jobId }, { withCredentials: true });
            if (response.status === 200) {
                setSavedJobs((prev) => [...prev, jobId]);
                toast.success("کارەکە کرایە لیستی دڵخوازەوە", { transition: Slide });
            }
        } catch (error) {
            toast.error("هەڵەیەک ڕویدا", { transition: Slide });
        }
    };

    const unSaveJobs = async (jobId) => {
        try {
            const response = await axios.post("http://localhost:3500/unsavejob", { jobId }, { withCredentials: true });
            if (response.status === 200) {
                setSavedJobs((prev) => prev.filter((id) => id !== jobId));
            }
        } catch (error) {
            toast.error("هەڵەیەک ڕویدا", { transition: Slide });
        }
    };

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

    const viewJobDetails = (jobId) => {
        navigate(`/jobs/jobdetails?jobid=${jobId}`);
    };

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://localhost:3500/favoritejobs', { withCredentials: true });
                const data = response.data.foundJobs;
                setJobs(data);
            } catch (err) {
                toast.error("هەڵەیەک ڕویدا", { transition: Slide });
            }
        };

        const checkSavedStatus = async () => {
            try {
                const response = await axios.get("http://localhost:3500/favoritejobs", { withCredentials: true });
                const savedJobs = response.data.foundJobs.map((job) => job._id);
                setSavedJobs(savedJobs);
            } catch (err) {
                toast.error("هەڵەیەک ڕویدا", { transition: Slide });
            }
        };

        fetchJobs();
        checkSavedStatus();
    }, []);

    return (
        <div>
            {<Nav />}
            <div className='savedjobs-title-container'>
                <div>
                    <h1>هەلی کارە دڵخوازەکان</h1>
                </div>
                <div>
                    <i class="fa-solid fa-bookmark"></i>
                </div>
            </div>

            <div className={`no-jobs-container-savedjobs ${jobs.length === 0 ? 'hidden' : ''}`}>
                <p>هیچ هەلی کارێکی دڵخوازت نییە</p>
            </div>
            <div className='responsivejobs-container'>
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <div key={job._id} className='jobs-container'>
                            <div className='job-card'>
                                <div className='job-card-content'>
                                    <div className='job-card-upper'>
                                        <div className='upper-img-container'>
                                            <img className='job-img' src='images.png' width={50} height={50} alt='job' />
                                        </div>
                                        <div className='upper-title-container'>
                                            <h1 className='job-title'>{job.title}</h1>
                                        </div>
                                        <div className='upper-favicon-container'>
                                            <i onClick={() => isJobSaved(job._id) ? unSaveJobs(job._id) : saveJobs(job._id)}
                                                className={`fa-${isJobSaved(job._id) ? 'solid' : 'regular'} fa-bookmark fav-icon`}></i>
                                        </div>
                                    </div>
                                    <div className='job-info-title'>
                                        <p className='job-info'>{job.company}</p>
                                        <p className='job-info'>{job.location}</p>
                                    </div>
                                    <div style={{ marginTop: '-30px' }}>
                                        <div className='job-langs-container'>
                                            <p className='job-langs'>{job.language.join(', ')}  : زمان</p>
                                        </div>
                                        <div className='job-exp-container'>
                                            <p className='job-exp'> {job.yearsOfExp} :  ئەزموون  </p>
                                        </div>
                                        <div className='job-gender-container'>
                                            <p className='job-gender'> {job.gender}: ڕەگەز</p>
                                        </div>
                                        <div className='job-gender-container'>
                                            <p className='job-gender'> {job.degree} :  شەهادە</p>
                                            <div className='job-btn-container'>
                                                <p className='job-info job-posted'>{formatDate(job.postedAt)}</p>
                                                <button onClick={() => viewJobDetails(job._id)} className='view-job-btn'>بینینی زیاتر</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p></p>
                )}
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
            <ToastContainer position='top-center' />
        </div>
    );
}

export default Savedjobs;