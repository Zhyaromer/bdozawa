import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth, signOut, onAuthStateChanged } from './FirebaseService';
import './css/faq.css';
import { Slide, ToastContainer, toast } from 'react-toastify';

const Faq = () => {
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const [user, setUser] = useState(null);
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleCloseSidebar = () => {
        setShowSidebar(false);
    };

    const deleteCookie = (name) => {
        document.cookie = `${name}=; Max-Age=0; path=/;`;
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
                                <p onClick={toggleDropdown} className='accountName'> <i className="fa-solid fa-user"></i> {user.displayName.split(' ')[0]}</p>
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
            <div className='faq-header'>
                <div className='faq-header-container'>
                    <div>
                        <h2 className='faq-section-title'>پرسیارە باوەکان</h2>
                    </div>
                    <div>
                        <img className='faq-header-image' src="image_processing20201231-4907-a8958e.gif" alt="" />
                    </div>
                </div>
            </div>
            <div className='faqq-container'>
                <div className='help-section'>

                    <div className="faq-container faq-section-vip">
                        {[
                            {
                                q: "چەند کاتژمێر دەخایەنێت تاکو کارەکەم بڵاو دەبێتەوە؟",
                                a: "دوای پێداچوونەوە لە ماوەی ٢٤ کاتژمێر بڵاو دەکرێتەوە بۆ ڕیگری کردن لە هەلی کاری ساختە"
                            },
                            {
                                q: "ئایا دەتوانم ڕیپۆرت لە هەلی کارێک بدەم؟",
                                a: 'بەڵێ دەتوانیت، ئەگەر هەستت کرد هەلی کارێک کێشەیەکی هەیە ئەوا دەتوانی ڕیپۆرتی بکەیت و هۆکارو تێبینی خۆت بنێریت'
                            },
                            {
                                q: 'نرخی بڵاوکردنەوەی هەلی کار چەندە؟',
                                a: 'بڵاوکردنەوەی هەلی کار بە خۆراییەو هیچ بڕە پارەیەک نادەیت تەنها پێویستت بە هەژمارێکە'
                            },
                            {
                                q: 'ئایا سوودی چیە کە هەلی کارەکەمان بکەینە VIP؟',
                                a: 'ئەگەر بتەوێت بە زووترین کات کارمەندێکی نایاب بۆ ئیشەکەت بدۆزیتەوە ئەم بەشە بۆتۆ گونجاوە چونکە زۆرترین کەس بینەری دەبێت'
                            },
                            {
                                q: 'ئایا پێویستە بڕە پارەیەک بنێرم بۆ ئەوەی هەلی کارەکەم بکەمە VIP؟',
                                a: 'پێویستە بڕی 15,000 بنێریت بۆ ئەوەی هەلی کارەکەت بکەینە VIP بۆ ماوەی هەفتەیەک'
                            },
                            {
                                q: 'چی بەسەر هەلی کارەکەمان دێت ئەگەر بکەینە VIP؟',
                                a: 'هەلی کارەکەت لە پێش هەموو کارەکانی تر لە سەرەوەی ماڵپەرەکە دەمێنێتەوەو زۆرترین بینەری دەبێت'
                            }
                        ].map((faq, index) => (
                            <div
                                key={index}
                                className={`faq-item ${activeQuestion === index ? 'active' : ''}`}
                                onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
                            >
                                <div className="question">
                                    <span>{faq.q}</span>
                                    <span className="arrow"><i class="fa-solid fa-angle-down"></i></span>
                                </div>
                                <div className="answer">{faq.a}</div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
            <div className='faq-contact'>
                <p>پرسیارەکەت لێرە نیە؟ <a href="/contact">پەیوەندیمان پێوە بکە</a></p>
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
    )
}

export default Faq;