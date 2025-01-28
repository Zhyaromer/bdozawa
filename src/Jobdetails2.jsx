import { Slide, ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaExclamationCircle } from "react-icons/fa";
import './css/jobdetails.css'
import {
    Briefcase, MapPin, Mail, Phone, Award,
    DollarSign, Languages, Users, GraduationCap,
    Book, Eye, Building2, AlertCircle, Info, Clock
} from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const Card = ({ children, className = "" }) => (
    <div className={`card ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children, className = "" }) => (
    <div className={`card-header ${className}`}>
        {children}
    </div>
);

const CardContent = ({ children, className = "" }) => (
    <div className={`card-body ${className}`}>
        {children}
    </div>
);

const IconWrapper = ({ icon, color = "#2ecc71", className = "" }) => (
    <div
        className={`rounded p-2 text-white ${className}`}
        style={{ backgroundColor: color }}
    >
        {icon}
    </div>
);

const Badge = ({ icon, text }) => (
    <div className="badge bg-light bg-opacity-25 text-white d-flex align-items-center gap-2 py-2 px-3">
        {icon}
        <span className="fs-6">{text}</span>
    </div>
);

const RequirementCard = ({ icon, title, value, color }) => (
    <Card className="h-100 border">
        <CardContent className="p-3">
            <div className="d-flex gap-3">
                <IconWrapper icon={icon} color={color} />
                <div>
                    <h3 className="text-muted small mb-1">{title}</h3>
                    <p className="fw-semibold mb-0">{value}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

const ContactItem = ({ icon, value, color }) => (
    <div className="card bg-light">
        <div className="card-body p-3">
            <div className="d-flex align-items-center gap-3">
                <IconWrapper icon={icon} color={color} />
                <span>{value}</span>
            </div>
        </div>
    </div>
);

const Section = ({ icon, title, children, className = "" }) => (
    <Card className={`shadow-sm ${className}`}>
        <CardHeader className="d-flex align-items-center gap-3 bg-white border-bottom">
            <IconWrapper icon={icon} />
            <h2 className="h4 mb-0">{title}</h2>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </Card>
);

const Jobdetails2 = () => {
    const navigate = useNavigate();
    const seachParams = new URLSearchParams(window.location.search);
    const jobId = seachParams.get('jobid');
    const [job, setJob] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
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

        if (jobId) {
            fetchJobDetails();
            checkSavedStatus();
        }
    }, [jobId]);

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

    const requirements = [
        { icon: <Award />, title: "ئەزموون", value: "شەش مانگ ئەزموون", color: "#f39c12" },
        { icon: <GraduationCap />, title: "بڕوانامە", value: "بەکالۆریۆس", color: "#3498db" },
        { icon: <Book />, title: "جۆری بڕوانامە", value: "پەرستاری", color: "#e74c3c" },
        { icon: <Languages />, title: "زمانەکان", value: "کوردی، ئینگلیزی", color: "#9b59b6" }
    ];

    const contactInfo = [
        { icon: <Mail />, value: "zhyaraland123@gmail.com", color: "#e74c3c" },
        { icon: <Phone />, value: "7703227250", color: "#3498db" }
    ];

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

                <div className="min-vh-100 py-4 px-3" dir="rtl" style={{ background: 'linear-gradient(135deg, rgba(46,204,113,0.1) 0%, rgba(39,174,96,0.1) 100%)' }}>
                    <div className="container-xl">
                        {/* Header Section */}
                        <div className="card mb-4 overflow-hidden" style={{ background: 'linear-gradient(90deg, #2ecc71 0%, #27ae60 100%)' }}>
                            <div className="px-4 py-2 d-flex justify-content-end gap-2" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                                <Badge icon={<Clock size={16} />} text="لەسەر کار" />
                                <Badge icon={<Eye size={16} />} text="٩٢ بینراوە" />
                            </div>

                            <div className="card-body">
                                <div className="d-flex flex-column flex-md-row gap-4">
                                    <div className="d-flex align-items-center justify-content-center rounded p-3"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            backdropFilter: 'blur(8px)',
                                            border: '4px solid rgba(255,255,255,0.3)'
                                        }}>
                                        <Building2 size={40} className="text-white" />
                                    </div>

                                    <div className="flex-grow-1">
                                        <h1 className="custom-title text-white mb-2">وەستای کارەبا</h1>
                                        <div className="text-white d-flex align-items-center gap-2 mb-3">
                                            <Briefcase size={20} />
                                            <span className="fs-2">رەسول</span>
                                        </div>

                                        <div className="d-flex flex-wrap gap-2">
                                            <Badge icon={<MapPin size={18} />} text="هەڵەبجەی شەهید" />
                                            <Badge icon={<DollarSign size={18} />} text="٥٠٠ دۆلار" />
                                            <Badge icon={<Users size={18} />} text="هەردوو ڕەگەز" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row g-4">
                            <div className="col-lg-8">
                                <div className="d-flex flex-column gap-4">
                                    <Section icon={<AlertCircle size={24} />} title="وەسفی کار">
                                        <p className="text-secondary description-text">
                                            هەر ئیشێك بزانی بەسمانە بەس زیرک بێتی ئیتر گۆرانی بزانیطو سەوتی خۆس بەیتو کوردپەروەر بەیتو جلی کوردی بکات ئیتر ئەم جۆرە ستانە بکات
                                        </p>
                                    </Section>

                                    <Section icon={<Info size={24} />} title="داواکارییەکانی کار">
                                        <div className="row g-3">
                                            {requirements.map((req, index) => (
                                                <div className="col-sm-6" key={index}>
                                                    <RequirementCard {...req} />
                                                </div>
                                            ))}
                                        </div>
                                    </Section>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <Section icon={<Phone size={24} />} title="زانیاری پەیوەندی">
                                    <div className="d-flex flex-column gap-3">
                                        {contactInfo.map((contact, index) => (
                                            <ContactItem key={index} {...contact} />
                                        ))}

                                        <div className="pt-4 mt-3 border-top">
                                            <p className="text-muted badge-text mb-0">
                                                بڵاوکراوەتەوە لەلایەن: <span className="text-success fw-semibold">Zhyar omar</span>
                                            </p>
                                        </div>
                                    </div>
                                </Section>
                            </div>
                        </div>
                    </div>
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