import './css/settings.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { Slide, ToastContainer, toast } from 'react-toastify';
import { auth, onAuthStateChanged, updatePassword, signOut, EmailAuthProvider, reauthenticateWithCredential } from './FirebaseService';

const Settings = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [displayName, setDisplayName] = useState(null);
    const [oldpassword, setoldPassword] = useState('');
    const [newpassword, setnewPassword] = useState('');
    const [confirmpassword, setconfirmPassword] = useState('');
    const [changename, setChangename] = useState(false);
    const [changeemail, setChangeemail] = useState(true);
    const [changepassword, setChangepassword] = useState(true);
    const [myposts, setMyposts] = useState(true);
    const [deleteaccount, setDeleteaccount] = useState(true);
    const navigate = useNavigate();
    const [haspasswordchanged, setHasPasswordChanged] = useState(false);
    const [hasChanged, setHasChanged] = useState(false);
    const [user, setUser] = useState(null);
    const [useremail, setUserEmail] = useState(null);
    const [userdisplayname, setUserDisplayName] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [allPostedJobs, setAllPostedJobs] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleSidebar = () => setShowSidebar(!showSidebar);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const deleteCookie = (name) => {
        document.cookie = `${name}=; Max-Age=0; path=/;`;
    };

    const openChangeName = () => {
        setChangename(false);
        setChangeemail(true);
        setChangepassword(true);
        setDeleteaccount(true);
        setMyposts(true);
    };

    const openChangeEmail = () => {
        setChangename(true);
        setChangeemail(false);
        setChangepassword(true);
        setDeleteaccount(true);
        setMyposts(true);
    };

    const openChangePassword = () => {
        setChangename(true);
        setChangeemail(true);
        setChangepassword(false);
        setDeleteaccount(true);
        setMyposts(true);
    };

    const openMyPosts = () => {
        setChangename(true);
        setChangeemail(true);
        setChangepassword(true);
        setDeleteaccount(true);
        setMyposts(false);
    };

    const openDeleteAccount = () => {
        setChangename(true);
        setChangeemail(true);
        setChangepassword(true);
        setDeleteaccount(false);
        setMyposts(true);
    };

    const logout = () => {
        signOut(auth)
            .then(() => {
                deleteCookie('idToken');
            })
            .catch((error) => {
                toast.error("هەڵەیەک ڕویدا" + error.message, { transition: Slide })
            });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const response = await axios.post(
                        "http://localhost:3500/checkAuth",
                        { uid: firebaseUser.uid },
                        { withCredentials: true }
                    );
                    if (response.status === 200) {
                        setUser(firebaseUser);
                        setUserEmail(firebaseUser.email);
                        setUserDisplayName(firebaseUser.displayName);
                    } else if (response.status === 404) {
                        setUser(false);
                    } else {
                        setUser(false);
                    }
                } catch (error) {
                    setUser(false);
                }
            } else {
                setUser(false);
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    const handleCloseSidebar = () => {
        setShowSidebar(false);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        if (id === "changeDisplayName") {
            setDisplayName(value);
            setHasChanged(value.length > 0);
        } else if (id === "oldpassword") {
            setoldPassword(value);
        } else if (id === "newpassword") {
            setnewPassword(value);
        } else if (id === "confirmpassword") {
            setconfirmPassword(value);
        }

        const isPasswordValid =
            (id === "oldpassword" ? value.length >= 6 : oldpassword.length >= 6) &&
            (id === "newpassword" ? value.length >= 6 : newpassword.length >= 6) &&
            (id === "confirmpassword" ? value.length >= 6 : confirmpassword.length >= 6);
        setHasPasswordChanged(isPasswordValid);
    };

    const updateName = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3500/changename", { displayName: displayName }, { withCredentials: true });
            if (response.status === 200) {
                setUserDisplayName(displayName);
                toast.success("ناوەکەت بە سەرکەتووی گۆردرا", { transition: Slide });
                setDisplayName('');
            } else if (response.status === 400) {
                toast.error(response.data.message || "تکایە ناوێک بنووسە", { transition: Slide });
            } else if (response.status === 404) {
                toast.error(response.data.message || "‌هەژمارەکەت نەدۆزرایەوە", { transition: Slide });
            } else {
                toast.error(response.data.message || "هەڵەیەک ڕویدا تکایە دووبارە هەوڵ بدەرەوە", { transition: Slide });
            }
        } catch (error) {
            toast.error(error.data.message || "هەڵەیەک ڕویدا تکایە دووبارە هەوڵ بدەرەوە", { transition: Slide });
        }
    }

    const updaterePassword = async (e) => {
        e.preventDefault();
        try {
            const credential = EmailAuthProvider.credential(useremail, oldpassword);
            await reauthenticateWithCredential(auth.currentUser, credential);
            if (newpassword !== confirmpassword) {
                toast.error("وشە نهێنیە تازەکان وەک یەک نین", { transition: Slide });
                return;
            } else if (oldpassword === confirmpassword || newpassword === oldpassword) {
                toast.error("وشەی نهێنیە نوێیەکە نابێت هەمان وشەی نهێنی کۆن بێت", { transition: Slide });
                return;
            }
            await updatePassword(auth.currentUser, newpassword);
            toast.success("وشەی نهێنیەکەت بەسەرکەوتوویی نوێ کرایەوە", { transition: Slide });
            setoldPassword('');
            setnewPassword('');
            setconfirmPassword('');
        } catch (error) {
            toast.error('هەڵەیەک ڕویدا تکایە دووبارە هەوڵ بدەرەوە', { transition: Slide });
        }
    }

    useEffect(() => {
        const postedJobs = async () => {
            try {
                const response = await axios.get("http://localhost:3500/myposts", { withCredentials: true });
                setAllPostedJobs(response.data.posts);
            } catch (error) {
                toast.error('هەڵەیەک ڕویدا تکایە دووبارە هەوڵ بدەرەوە', { transition: Slide });
            }
        }
        postedJobs();
    }, []);

    const deleteAccount = async () => {
        try {
            const response = await axios.post("http://localhost:3500/deleteaccounts", {}, { withCredentials: true });
            if (response.status === 200) {
                navigate("/jobs");
                toast.success("هەژمارەکەت سڕایەوە", { transition: Slide });
            } else if (response.status === 404) {
                toast.error(response.data.message || "‌هەژمارەکەت نەدۆزرایەوە", { transition: Slide });
            } else if (response.status === 400) {
                toast.error("کێشەیەک ڕویدا", { transition: Slide });
            } else {
                toast.error('هەڵەیەک ڕویدا تکایە دووبارە هەوڵ بدەرەوە', { transition: Slide });
            }
        } catch (error) {
            toast.error(error.response.data.message || "هەڵەیەک ڕویدا تکایە دووبارە هەوڵ بدەرەوە", { transition: Slide });
        }
    }

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

    const copyID = (jobId) => {
        navigator.clipboard.writeText(jobId);
        toast.success("ئایدی کارەکە کۆپی کرا", { transition: Slide });
    };

    const deleteJob = async (jobId) => {
        try {
            const response = await axios.get(`http://localhost:3500/deletejob?jobid=${jobId}`, { withCredentials: true });
            if (response.status === 200) {
                setAllPostedJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
                toast.success(response.data.message || "کارەکە سڕایەوە", { transition: Slide });
            } else if (response.status === 404) {
                toast.error(response.data.message || "هیچ کارێک نەدۆزرایەوە تکایە دووبارە هەوڵ بدەرەوە", { transition: Slide });
            } else if (response.status === 400) {
                toast.error(response.data.message || "کێشەیەک ڕویدا", { transition: Slide });
            } else {
                toast.error(response.data.message || "هەڵەیەک ڕویدا تکایە دووبارە هەوڵ بدەرەوە", { transition: Slide });
            }
        } catch (error) {
            toast.error(error.response.data.message || "هەڵەیەک ڕویدا تکایە دووبارە هەوڵ بدەرەوە", { transition: Slide });
        }
    }

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
            <div className='settings-container'>
                <div className='settings-options'>
                    <div className='settings-options-title'>
                        <div onClick={openChangeName} className={`settings-options-title-text-icon ${changename ? '' : 'activechangename'}`}>
                            <div>
                                <p>گۆرینی ناو</p>
                            </div>
                            <div>
                                <i class="fa-solid fa-user"></i>
                            </div>
                        </div>
                        <div onClick={openChangeEmail} className={`settings-options-title-text-icon ${changeemail ? '' : 'activechangename'}`}>
                            <div>
                                <p>گۆرینی ئیمەیڵ</p>
                            </div>
                            <div>
                                <i class="fa-solid fa-envelope"></i>
                            </div>
                        </div>
                        <div onClick={openChangePassword} className={`settings-options-title-text-icon ${changepassword ? '' : 'activechangename'}`}>
                            <div>
                                <p>گۆرینی وشەی نهێنی</p>
                            </div>
                            <div>
                                <i class="fa-solid fa-lock"></i>
                            </div>
                        </div>
                        <div onClick={openMyPosts} className={`settings-options-title-text-icon ${myposts ? '' : 'activechangename'}`}>
                            <div>
                                <p>پۆستەکانم</p>
                            </div>
                            <div>
                                <i class="fa-solid fa-pen-to-square"></i>
                            </div>
                        </div>
                        <div onClick={openDeleteAccount} className={`settings-options-title-text-icon ${deleteaccount ? '' : 'activedeleteaccount'} settings-options-title-text-icon-delete`}>
                            <div>
                                <p>سڕینەوەی هەژمار</p>
                            </div>
                            <div>
                                <i class="fa-solid fa-trash"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='settings-pages'>
                    <div className={`settings-pages-changename ${changename ? '' : 'active'}`}>
                        <div>
                            <div className='settings-pages-title'>
                                <p>گۆرینی ناوی هەژمارەکەت <i class="fa-solid fa-user"></i></p>
                                <small>بۆ گۆڕینی ناوی هەژمارەکەت, ناوە تازەکەت بنووسە</small>
                            </div>
                            <div className='settings-pages-input'>
                                <input id='changeDisplayName' onChange={handleInputChange} value={displayName} type='text' placeholder='ناوە نوێیەکەت لێرە بنووسە' />
                            </div>
                            <div className='settings-pages-currentname'>
                                <small> {userdisplayname} : ناوی ئێستات </small>
                            </div>
                            <div className={`settings-pages-changename-button settings-pages-changename-button-password`}>
                                <button className={` ${hasChanged ? '' : 'hasChanged'}`} onClick={updateName} disabled={!hasChanged}>ناوەکەم بگۆرە</button>
                            </div>
                        </div>
                    </div>
                    <div className={`settings-pages-changeemail ${changeemail ? '' : 'active'}`}>
                        <div>
                            <div>
                                <div className='settings-pages-title'>
                                    <p>گۆرینی ئیمەیڵی هەژمارەکەت <i class="fa-solid fa-envelope"></i></p>
                                </div>
                                <div className='settings-pages-input settings-pages-input-email'>
                                    <input type='email' value={useremail} readOnly />
                                </div>
                                <div className='settings-pages-alert-container settings-pages-alert-container-email'>
                                    <div className='settings-pages-alert'>
                                        <i class="fa-solid fa-triangle-exclamation"></i>
                                        <small> ببورە ناتوانیت ئیمەیڵەکەت بگۆڕیت</small>
                                    </div>
                                </div>
                                <div className='settings-pages-changename-button settings-pages-changename-button-password'>
                                    <button className='hasChanged' disabled={true}>ئیمەیڵەکەم بگۆرە</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`settings-pages-changepassword ${changepassword ? '' : 'active'}`}>
                        <div>
                            <div className='settings-pages-title settings-pages-title-password'>
                                <p>گۆرینی وشەی نهێنی <i class="fa-solid fa-lock"></i></p>
                                <small>بۆ گۆڕینی وشەی نهێنی پێوسیتە وشە نهێنیە کۆنەکە بزانیت</small>
                            </div>
                            <div className="form-group">
                                <div className="form-label-email">
                                    <label className='email-label' htmlFor="email"><i class="fa-solid fa-lock mail-icon"></i>وشەی نهێنیە کۆنەکە
                                    </label>
                                </div>
                                <input
                                    className='email-input'
                                    type={showPassword ? "text" : "password"}
                                    placeholder="وشەی نهێنیە کۆنەکەت بنووسە"
                                    value={oldpassword}
                                    id='oldpassword'
                                    onChange={handleInputChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>
                            <div className="form-group">
                                <div className="form-label-email">
                                    <label className='email-label' htmlFor="email"><i class="fa-solid fa-lock mail-icon"></i>وشەی نهێنیە تازەکەت بنووسە
                                    </label>
                                </div>
                                <input
                                    id='newpassword'
                                    className='email-input'
                                    type={showPassword ? "text" : "password"}
                                    placeholder="وشەی نهێنیە تازەکەت بنووسە"
                                    value={newpassword}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>
                            <div className="form-group">
                                <div className="form-label-email">
                                    <label className='email-label' htmlFor="email"><i class="fa-solid fa-lock mail-icon"></i>وشەی نهێنیە تازەکەت بنووسەوە
                                    </label>
                                </div>
                                <input
                                    id='confirmpassword'
                                    className='email-input'
                                    type={showPassword ? "text" : "password"}
                                    placeholder="وشەی نهێنیکە تازەکەت بنووسەوە بنووسە"
                                    value={confirmpassword}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>
                            <div className='settings-pages-changename-button settings-pages-changename-button-password'>
                                <button onClick={updaterePassword} className={` ${haspasswordchanged ? '' : 'hasChanged'}`} disabled={!haspasswordchanged}>وشەی نهێنی بگۆرە</button>
                            </div>

                            <div className='settings-pages-changename-button-password settings-pages-changename-button-password-forget'>
                                <p>وشەی نهێنیە کۆنەکەت لەیاد کردووە؟ <a href="/forgotpassword">کلیک لێرە بکە</a></p>
                            </div>
                        </div>
                    </div>
                    <div className={`settings-pages-myposts ${myposts ? '' : 'active'}`}>
                        <div>
                            <div className='settings-pages-title'>
                                <p>هەلی کارەکانت <i class="fa-solid fa-pen-to-square"></i></p>
                                <small>ئەتوانی هەلی کارەکانت دەستکاری بکەی بە پێی خواستی خۆت</small>
                            </div>

                            <div className='responsivejobs-container-settings'>
                                {allPostedJobs.length > 0 ? (
                                    allPostedJobs.map((job) => (
                                        <div key={job._id} className='jobs-container'>
                                            <div className='job-card-content-settings'>
                                                <div className='job-card-content'>
                                                    <div className='job-card-upper'>
                                                        <div className='upper-img-container'>
                                                            <img className='job-img' src='images.png' width={50} height={50} alt='job' />
                                                        </div>
                                                        <div className='upper-title-container'>
                                                            <h1 className='job-title'>{job.title}</h1>
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
                                                    <hr />
                                                    <div className='settings-pages-myposts-buttons'>
                                                        <div className='settings-pages-myposts-delete'>
                                                            <button onClick={() => deleteJob(job._id)}>delete</button>
                                                        </div>
                                                        <div className='settings-pages-myposts-copyid'>
                                                            <button onClick={() => copyID(job._id)}><i class="fa-solid fa-copy"></i> کۆپی کردنی ئایدی</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='no-jobs'>
                                        <p>هیچ کارێک نەدۆزرایەوە</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={`settings-pages-deleteaccount ${deleteaccount ? '' : 'active'}`}>
                        <div>
                            <div className='settings-pages-title'>
                                <p>سڕینەوەی هەژمارەکەت <i class="fa-solid fa-trash"></i></p>
                                <small>ئایا دڵنیایت کە هەژمارەکەت دەسڕیتەوە؟ هەژمارەکەت بە تەواوی بوونی نامێنێت</small>
                            </div>

                            <div className='settings-pages-changename-deletebutton'>
                                <button onClick={deleteAccount}>هەژمارەکەم بسڕەوە</button>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer position="top-center" />
            </div>
        </div>
    )
}

export default Settings;