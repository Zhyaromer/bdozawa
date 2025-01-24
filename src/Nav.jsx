import './css/Nav.css'
import { auth, signOut, onAuthStateChanged } from './FirebaseService';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Slide, ToastContainer, toast } from 'react-toastify';

const Nav = () => {
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
            <ToastContainer position="top-center" />
        </div >
    )
}

export default Nav