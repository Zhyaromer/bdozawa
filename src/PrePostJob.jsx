import { Slide, ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';
import { auth, signOut, onAuthStateChanged } from './FirebaseService';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/prepostjob.css'

const PrePostJob = () => {
    const [user, setUser] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleSidebar = () => setShowSidebar(!showSidebar);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
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

    const handleCloseSidebar = () => {
        setShowSidebar(false);
    };

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
            <div className='prepost-upper-container'>
                <div className='prepost-upper-img-btn-container'>
                    <div className='prepost-upper-img-btn-content'>
                        <div className='prepost-title-btn-content'>
                            <h2 className='prepost-upper-title'>
                                ئایا بە دوای کارماندێکی نایابدا دەگەرێیت بۆ کارەکەت
                            </h2>
                            <div className='prepost-post-btncontainer'>
                                <button className='prepost-post-btn'>
                                    ئیشێک دابنێ
                                </button>
                            </div>
                        </div>
                        <div className='prepost-upper-img'>
                            <img className='prepost-img' src="—Pngtree—people stand in line queuing_7516346.png" width="380" alt="" />
                        </div>
                    </div>
                </div>

                <div className='alert-container'>
                    <div class="alert alert-warning">
                        <i class="fa fa-exclamation-triangle"></i>
                        <p className='alert-warning-p'>ئەگەر ئەتەوێت پۆست بکەی ئەوا پێویستە جۆری ئەکاونتەکەت بە دوای فەرمانبەردا دەگەڕێم بێت</p>
                        <a className='alert-warning-a' href="">یارمەتی بەدەست بهێنە</a>
                    </div>
                </div>

                <div className='vipandhelpjobs-container'>
                    <div className='vipandhelpjobs-content'>
                        <div className='vipandhelpjobs-sec'>
                            <img className='vipandhelpjobs-img' src="find-aurora-785c22.svg" width={'70'} alt="" />
                            <h3 className='vipandhelpjobs-h3'>کەی کارەکەم وەردەگیرێت</h3>
                            <p className='vipandhelpjobs-p'>لەبەر زۆری کاری ساختە، هەر کارێک کە پۆست دەکرێت پێویستی بە نزیکەی ٢٤ کاتژمێر هەیە تاوەکو پشتڕاست بکرێتەوە پێش وەرگرتنی</p>
                        </div>
                        <div className='vipandhelpjobs-sec'>
                            <img className='vipandhelpjobs-img' src="visibility-aurora-01633a.svg" width={'70'} alt="" />
                            <h3 className='vipandhelpjobs-h3'>ئیشەکەت بکە بە ڤی ئای پی</h3>
                            <p className='vipandhelpjobs-p'>ئەگەر ئەتەوێت ئیشەکەت زیاتر بگات بە خەڵکو بینەری زیاتر بێت ئەوا کلیک <a href="">لێرە</a> بکە</p>
                        </div>
                        <div className='vipandhelpjobs-sec'>
                            <img className='vipandhelpjobs-img' src="create-account-icon.png" width={'70'} alt="" />
                            <h3 className='vipandhelpjobs-h3'>هەژمارت نیە و نازانی چۆن دروستی بکەیت</h3>
                            <p className='vipandhelpjobs-p'>بۆ بەدەست هێنانی یارمەتی لە دروستکردنی هەژمارەکەت کلیک <a href="">لێرە</a> بکە</p>
                        </div>
                        <div className='vipandhelpjobs-sec'>
                            <img className='vipandhelpjobs-img' src="help-desk.png" width={'70'} alt="" />
                            <h3 className='vipandhelpjobs-h3'>کێشەیەکت هەیە</h3>
                            <p className='vipandhelpjobs-p'>بۆ بەدەست هێنانی یارمەتی کلیک <a href="">لێرە</a> بکە</p>
                        </div>
                    </div>
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
    );
};

export default PrePostJob;