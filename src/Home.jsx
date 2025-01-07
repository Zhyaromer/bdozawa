import './css/Home.css'
import './css/Nav.css'
import React, { useState, useEffect } from 'react'
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth, signOut, onAuthStateChanged } from './FirebaseService';

const Home = () => {
    useEffect(() => {
        AOS.init({
            duration: 800, // Animation duration in ms
            easing: 'ease-in-out', // Animation easing
            offset: 100, // Offset from the viewport
            once: false, // Whether animation should happen only once
        });
    }, []);
    const [showSidebar, setShowSidebar] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleCloseSidebar = () => {
        console.log('Close button clicked');
        setShowSidebar(false);
    };

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
                        "http://localhost:3600/checkAuth",
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

    function navToJobs() {
        navigate('/jobs');
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
                                <p onClick={toggleDropdown} className='accountName'> <i className="fa-solid fa-user"></i>{user.displayName.split(' ')[0]}</p>
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
            <br />
            <div className='main'>
                <div className='Main-container'>
                    <h1 className='Main-h1'>ئایا بە دوای کاردا ئەگەڕێیت؟</h1>
                    <p className='Main-p1'>لێرە دەتوانیت ئیشی خەونەکانت بدۆزیتەوە، بگەڕێو ئەو کارەی ئەتەوێ بە کەمترین کات لێرە بدۆزەوە، لەگەل ئێمە ژیانت ئاسانتر بکە</p>
                    <div className='Main-button-container'>
                        <button onClick={navToJobs} className='Main-button'>کارەکان ببینە</button>
                    </div>
                    <p className='Main-p2'>ئەتوانیت  <a className='Main-p2-a' href="/login">بچیتە ژورەوە</a> بۆ هەژمارەکەت یان هەژمارێکی تازە <a className='Main-p2-a' href="/signup">دروست بکەی</a>، یان بەبێ هەژمار بەردەوام بیت</p>
                </div>
            </div>

            <div className='imgsecmain'>
                <img className='imgsecmain-img' src="65_MjExMi53MDEyLm4wMDEuMjTQoS5wNi4yNA.jpg" alt="" />
            </div>

            <div className='titleandimgsec'>
                <div className='title'>
                    <div className='titleline'></div>
                    <div className='titletxt'>بۆچی ئێمە هەڵبژێریت</div>
                    <div className='titleline'></div>
                </div>

                <div className='imgsec1'>
                    <img  className='imgsec1-img' src="7.webp" alt="" />
                    <div className='imgsec1-txt'>
                        <h2 className='imgsec1-h2'>بێزار بوویت لە گەڕان بەدوای کاردا؟</h2>
                        <p className='imgsec1-p'> دۆزینەوەی کارێکی گونجاو دەتوانێت هەست بە ماندووبوون بکات، لە شوێنێکەوە بۆ شوێنێکی تر، داواکاری بێکۆتایی پێشکەش بکەیت و ڕووبەڕووی ڕەتکردنەوە ببیتەوە. لەگەڵ ئێمەدا، ئیتر پێویست ناکات خەبات بکەیت. پلاتفۆرمی ئێمە ڕاستەوخۆ دەتبەستێتەوە بە خاوەنکارە سەرەکییەکان، ئەمەش کات و هەوڵ و فشارت بۆ پاشەکەوت دەکات. با گەڕان بەدوای کارەکەتدا ئاسانتر و کاریگەرتر بکەین</p>
                    </div>
                </div>

                <div className='imgsec2'>
                    <div  className='imgsec2-txt'>
                        <h2 className='imgsec2-h2'>دۆزینەوەی هەلی کار ئاسانترە</h2>
                        <p className='imgsec2-p'>لە ماڵپەڕەکەماندا، دەتوانیت کارەکان بەپێی ئارەزووەکانت فلتەر بکەیت، جا جۆری کارەکە، شوێن، مووچە، یان پیشەسازی بێت. ئەمەش وا دەکات دۆزینەوەی دەرفەتەکان کە لەگەڵ لێهاتوویی و پێداویستییەکانتان بگونجێت، هەمووی لە یەک شوێندا ئاسان بێت. ئەمڕۆ دەست بکە بە گەڕان و بزانە ڕاوکردنی کار چەندە ئاسانە!</p>
                    </div>
                    <img className='imgsec2-img' src="workfromhome.jpg" alt="" />
                </div>
            </div>

            <div className='cvsec-main'>
                <div  className='cvsec-main-titletxt'>کێشەی سیڤیت هەیە؟</div>
                <div className='cvsec-main-cards'>
                    <div  class="cv-card">
                        <div class="cv-card-image">
                            <img class="cv-card-img" src="309901-P8G9WT-600.jpg" alt="" />
                        </div>
                        <p class="cv-card-title">ئەتوانیت سیڤی خۆت دروست بکەی</p>
                        <p class="cv-card-body">
                            ئەتوانی بە ئاسانترین شێوە سیڤی بۆخۆت دروست بکەی بە بێ هیچ بڕە پارەیەک <span className='cv-card-link'>کلیک لێرە</span> بکەو چۆنیەتی دروستکردنی سیڤی بۆ خۆت فێربە
                        </p>
                    </div>
                </div>
            </div>
            <footer  className='footer-main'>
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
        </div >
    )
}

export default Home