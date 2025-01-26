import { Slide, ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';
import { auth, signOut, onAuthStateChanged } from './FirebaseService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './css/jobs.css'
import { FaFilter } from 'react-icons/fa';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [vipjobs, setVIPJobs] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterclose, setFilterclose] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [filters, setFilters] = useState({
        location: [],
        title: '',
        minSalary: '',
        maxSalary: '',
        industry: [],
        yearsOfExp: '',
        language: [],
        gender: ''
    });
    const [filteredJob, setFilteredJob] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [result, setResult] = useState(0);
    const [savedJobs, setSavedJobs] = useState([]);
    const toggleSidebar = () => setShowSidebar(!showSidebar);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const toggleFilter = () => setFilterclose(!filterclose);
    const deleteCookie = (name) => {
        document.cookie = `${name}=; Max-Age=0; path=/;`;
    };

    const logout = () => {
        signOut(auth)
            .then(() => {
                deleteCookie('idToken');
                console.log("User logged out");
            })
            .catch((error) => {
                console.error("Error signing out: ", error);
            });
    };

    useEffect(() => {
        const getVIPJobs = async () => {
            try {
                const response = await axios.get('http://localhost:3500/vipjobs');
                setVIPJobs(response.data.jobs);
                console.log(response.data.jobs.length);
            } catch (error) {
                console.error(error);
            }
        };
        getVIPJobs();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % vipjobs.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [vipjobs.length]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                console.log('Firebase user:', firebaseUser);
                try {
                    const response = await axios.post(
                        "http://localhost:3500/checkAuth",
                        { uid: firebaseUser.uid },
                        { withCredentials: true }
                    );

                    console.log(`Firebase user response status: ${response.status}`);
                    if (response.status === 200) {
                        console.log("Authenticated user");
                        setUser(firebaseUser);
                    } else if (response.status === 404) {
                        console.log("User not authenticated or profile not complete");
                        setUser(false);
                    } else {
                        console.log(`Unexpected status code: ${response.status}`);
                        setUser(false);
                    }
                } catch (error) {
                    console.error(`Error checking authentication: ${error.message}`);
                    setUser(false);
                }
            } else {
                console.log("No user signed in");
                setUser(false);
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                let url = 'http://localhost:3500/?';
                Object.keys(filters).forEach((key) => {
                    if (filters[key] && (filters[key].length > 0)) {
                        if (Array.isArray(filters[key])) {
                            url += `${key}=${filters[key].join(',')}&`;
                        } else {
                            url += `${key}=${filters[key]}&`;
                        }
                    }
                });
                url = url.slice(0, -1);
                console.log(url);

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
                setJobs(data);
                setResult(data.length);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const checkSavedStatus = async () => {
            try {
                const response = await axios.get("http://localhost:3500/favoritejobs", { withCredentials: true });
                const savedJobs = response.data.foundJobs.map((job) => job._id);
                setSavedJobs(savedJobs);
            } catch (err) {
                console.error("Error fetching saved jobs:", err);
            }
        };
        fetchJobs();
        checkSavedStatus();
    }, [filters]);

    const isJobSaved = (jobId) => savedJobs.includes(jobId);

    const handleCloseSidebar = () => {
        setShowSidebar(false);
    };

    const saveJobs = async (jobId) => {
        try {
            const response = await axios.post("http://localhost:3500/savedjobs", { jobId }, { withCredentials: true });
            if (response.status === 200) {
                setSavedJobs((prev) => [...prev, jobId]);
                toast.success("Job saved successfully", { transition: Slide });
            }
        } catch (error) {
            console.error("Error saving job:", error);
        }
    };

    const unSaveJobs = async (jobId) => {
        try {
            const response = await axios.post("http://localhost:3500/unsavejob", { jobId }, { withCredentials: true });
            if (response.status === 200) {
                setSavedJobs((prev) => prev.filter((id) => id !== jobId));
            }
        } catch (error) {
            console.error("Error unsaving job:", error);
        }
    };

    useEffect(() => {
        const filtered = jobs.filter(job =>
            job.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredJob(filtered);
        setResult(filtered.length);
    }, [searchTerm, jobs]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const resetFilters = () => {
        setFilters({
            location: [],
            title: '',
            minSalary: '',
            maxSalary: '',
            industry: [],
            yearsOfExp: '',
            language: [],
            gender: ''
        });
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
        console.log(`Viewing job details for job ID: ${jobId}`);
        navigate(`/jobs/jobdetails?jobid=${jobId}`);
    };

    const styles = {
        wrapper: {
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
        },
        sliderContainer: {
            width: '100%',
            height: '300px',
            overflow: 'hidden'
        },
        slider: {
            display: 'flex',
            height: '100%',
            transition: 'transform 0.5s ease-in-out',
            transform: `translateX(-${currentSlide * 96}%)`
        },
        slide: {
            minWidth: '345px',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '24px',
            color: 'white'
        },
        dotsContainer: {
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            padding: '10px 0'
        },
        dot: {
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#ccc',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
        },
        activeDot: {
            backgroundColor: '#333'
        }
    };

    const handleDotClick = (index) => {
        setCurrentSlide(index);
    };

    const handleCheckboxChange = (filterType, value) => {
        setFilters(prevFilters => {
            const updatedValues = prevFilters[filterType].includes(value)
                ? prevFilters[filterType].filter(item => item !== value)
                : [...prevFilters[filterType], value];

            return {
                ...prevFilters,
                [filterType]: updatedValues
            };
        });
    };

    if (loading) return <p>Loading jobs...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <div className='nav'>
                <div className='container'>
                    <nav className='navigation' >
                        <div className='hamburger' onClick={toggleSidebar}>
                            <div className='bar'></div>
                            <div className='bar'></div>
                            <div className='bar'></div>
                        </div>
                        <div className='logodiv'>
                            <h2 className='logo'>Jobify</h2>
                        </div>
                        <ul className='nav-list'>
                            <li className='nav-item'><a href="/">پەیوەندی کردن</a></li>
                            <li className='nav-item'><a href="/jobs">دەربارە</a></li>
                            <li className='nav-item'><a href="/post">ئیشێک دابنێ</a></li>
                            <li className='nav-item'><a href="/CV">دروستکردنی سیڤی</a></li>
                            <li className='nav-item'><a href="/about">ئیشەکان</a></li>
                            <li className='nav-item'><a href="/contact">سەرەتا</a></li>
                        </ul>
                        <div className='account'>
                            {user ? (
                                <p onClick={toggleDropdown} className='accountName'> <i className="fa-solid fa-user accoun-icon"></i>{user.displayName.split(' ')[0]}</p>
                            ) : (
                                <p onClick={toggleDropdown} className='accountName'> <i className="fa-solid fa-user"></i> guest</p>
                            )}
                            <div className="user-dropdown">
                                <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                                    {user ? (
                                        <>
                                            <a href="#profile"><i className="fa-solid fa-gear"></i> پرۆفایل</a>
                                            <a href="#saves"><i className="fa-solid fa-bookmark"></i> لیستی دڵخوازەکان</a>
                                            <div className="logout">
                                                <a onClick={logout} href="#logout"><i className="fa-solid fa-right-from-bracket"></i> دەرچون</a>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <a href="/login"><i className="fa-solid fa-right-to-bracket"></i> چونەژورەوە</a>
                                            <a href="#profile"><i className="fa-solid fa-user-plus"></i> دروستکردنی هەژمار</a>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={`sidebar-container ${showSidebar ? 'open' : ''}`}>
                            <div>
                                <i onClick={handleCloseSidebar} className={`fa-solid fa-x close ${showSidebar ? '' : 'open'}`}></i>
                            </div>
                            <ul className='nav-list-sidebar'>
                                <li className='nav-item-sidebar'><a href="/contact">سەرەتا</a></li>
                                <li className='nav-item-sidebar'><a href="/about">ئیشەکان</a></li>
                                <li className='nav-item-sidebar'><a href="/post">ئیشێک دابنێ</a></li>
                                <li className='nav-item-sidebar'><a href="/CV">دروستکردنی سیڤی</a></li>
                                <li className='nav-item-sidebar'><a href="/">پەیوەندی کردن</a></li>
                                <li className='nav-item-sidebar'><a href="/jobs">دەربارە</a></li>
                            </ul>
                        </div>
                    </nav>
                </div >
            </div >
            <div className='ad-container'>
                <div className='ad-text'>
                    <h1 className='ad-title'>ڕیکلامەکەت لێرە بکە</h1>
                    <a className='ad-email' href="mailto:eshbdozawabusiness@gmail.com">eshbdozawabusiness@gmail.com</a>
                </div>
            </div>

            <div className='search-container'>
                <div className='search-title-container'>
                    <h1 className='search-title'>ئیشی خەونەکانت لێرە بدۆزەوە</h1>
                </div>
                <div className='seachandfilter-container'>
                    <div className='seachandfilter'>
                        <div className='search'>
                            <input
                                className='search-input'
                                type='text'
                                placeholder='...گەڕان بە دوای کار'
                                value={searchTerm}
                                onChange={handleSearchChange}
                                autoComplete='off'
                            />
                        </div>
                        <div className='filter'>
                            <button onClick={toggleFilter} className='filterbtn'><FaFilter /> فلتەر</button>
                        </div>
                    </div>
                </div>

                <div className='result-container'>
                    <p className='result'>ئیشی بەردەست: {result}</p>
                </div>
            </div>

            <div className={`filters-container ${filterclose ? "open" : ""}`}>
                <div className='upper-sec'>
                    <h3 className='filter-title-result'>ئیشی بەردەست {result}</h3>
                    <i onClick={toggleFilter} class="fa-solid fa-xmark filter-close"></i>
                </div>
                <div className="filters-content">
                    <div className="filters">
                        <h3 className="filter-title">شارەکان</h3>
                        <div className="checkbox-container">
                            {['سلێمانی', 'هەولێر', 'دهۆک', 'کەرکوک'].map(city => (
                                <div className="checkbox-item" key={city}>
                                    <input
                                        className="checkbox-input"
                                        type="checkbox"
                                        checked={filters.location.includes(city)}
                                        onChange={() => handleCheckboxChange('location', city)}
                                    />
                                    <label className="checkbox-label">{city}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="hr-line" />

                    <div className="filters">
                        <h3 className="filter-title">پیشەسازی</h3>
                        <div className="checkbox-container">
                            {['پزیشکی', 'ئەندازیاری', 'مامۆستا', 'تەکنالۆژیا', 'یاسا', 'خانو بەرە'].map(ind => (
                                <div className="checkbox-item" key={ind}>
                                    <input
                                        className="checkbox-input"
                                        type="checkbox"
                                        checked={filters.industry.includes(ind)}
                                        onChange={() => handleCheckboxChange('industry', ind)}
                                    />
                                    <label className="checkbox-label">{ind}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="hr-line" />

                    <div className="filters">
                        <h3 className="filter-title">ئەزموون</h3>
                        <div className="checkbox-container">
                            {[
                                'بێ ئەزموون',
                                '٣ مانگ',
                                '٦ مانگ',
                                '٩ مانگ',
                                '١ ساڵ',
                                '٢ ساڵ',
                                '٣ ساڵ',
                                '٤ ساڵ',
                                '٥ ساڵ یان زیاتر'
                            ].map(exp => (
                                <div className="checkbox-item" key={exp}>
                                    <input
                                        className="checkbox-input"
                                        type="checkbox"
                                        checked={filters.yearsOfExp.includes(exp)}
                                        onChange={() => handleCheckboxChange('yearsOfExp', exp)}
                                    />
                                    <label className="checkbox-label">{exp}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="hr-line" />

                    <div className="filters">
                        <h3 className="filter-title">ڕەگەز</h3>
                        <div className="checkbox-container">
                            {['نێر', 'مێ', 'ڕەگەز گرنگ نیە'].map(gen => (
                                <div className="checkbox-item" key={gen}>
                                    <input
                                        className="checkbox-input"
                                        type="checkbox"
                                        checked={filters.gender.includes(gen)}
                                        onChange={() => handleCheckboxChange('gender', gen)}
                                    />
                                    <label className="checkbox-label">{gen}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="hr-line" />

                    <div className="filters">
                        <h3 className="filter-title">زمان</h3>
                        <div className="checkbox-container">
                            {['کوردی', 'ئینگلیزی', 'عەرەبی'].map(lang => (
                                <div className="checkbox-item" key={lang}>
                                    <input
                                        className="checkbox-input"
                                        type="checkbox"
                                        checked={filters.language.includes(lang)}
                                        onChange={() => handleCheckboxChange('language', lang)}
                                    />
                                    <label className="checkbox-label">{lang}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='resetFilter-container'>
                    <button onClick={resetFilters} className='resetFilter'>لابردنی فلتەرەکان</button>
                </div>
            </div>

            <div className={`jobs-vip-container ${vipjobs.length > 0 ? '' : 'hide'}`}>
                <h3 className='jobs-rec-title'><i class="fa-solid fa-crown"> <span className='vip'> VIP</span> </i>کاری</h3>
            </div>

            <div className={`vipjobsmob-container ${vipjobs.length < 0 ? '' : 'hide'}`}>
                <div style={styles.wrapper}>
                    <div style={styles.sliderContainer}>
                        <div style={styles.slider}>
                            {vipjobs.length > 0 ? (
                                vipjobs.map((job, _) => (
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
                                                            <p className='job-info job-posted'>٢ ڕۆژ لەمەوپێش</p>
                                                            <button className='view-job-btn'>بینینی زیاتر</button>
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

                    </div>
                    <div style={styles.dotsContainer}>
                        {vipjobs.map((_, index) => (
                            <div
                                key={index}
                                onClick={() => handleDotClick(index)}
                                style={{
                                    ...styles.dot,
                                    ...(currentSlide === index ? styles.activeDot : {})
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className={`vipjobspc-container ${vipjobs.length < 0 ? '' : 'hide'}`}>
                {vipjobs.map((job, index) => (
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
                                                <p className='job-info job-posted'>٢ ڕۆژ لەمەوپێش</p>
                                                <button onClick={() => viewJobDetails(job._id)} className='view-job-btn'>بینینی زیاتر</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className='jobs-rec-container'>
                <h3 className='jobs-rec-title'>کارە بەردەستەکان</h3>
            </div>

            <div className={`responsivejobs-container ${filteredJob.length > 0 ? 'hide' : ''}`}>
                    {filteredJob.map((job) => (
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
                                        <p className='job-info'>{job.jobtype}</p>
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
               }
            </div>
            <p className={`novipjob-text  ${filteredJob.length > 0 ? 'hide' : ''}`}>هیچ کارێک بەردەست نیە</p>
            <ToastContainer position='top-center' autoClose={3000} closeOnClick pauseOnHover draggable pauseOnFocusLoss />
        </div>
    );
}

export default Jobs