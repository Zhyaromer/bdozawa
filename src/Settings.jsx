import './css/settings.css';
import { auth, signOut, onAuthStateChanged } from './FirebaseService';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Settings = () => {
    const [changename, setChangename] = useState(false);
    const [changeemail, setChangeemail] = useState(true);
    const [changepassword, setChangepassword] = useState(true);
    const [deleteaccount, setDeleteaccount] = useState(true);

    const [user, setUser] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
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
    };

    const openChangeEmail = () => {
        setChangename(true);
        setChangeemail(false);
        setChangepassword(true);
        setDeleteaccount(true);
    };

    const openChangePassword = () => {
        setChangename(true);
        setChangeemail(true);
        setChangepassword(false);
        setDeleteaccount(true);
    };

    const openDeleteAccount = () => {
        setChangename(true);
        setChangeemail(true);
        setChangepassword(true);
        setDeleteaccount(false);
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
            <div className='settings-container'>
                <div className='settings-options'>
                    <div className='settings-options-title'>
                        <div onClick={openChangeName} className='settings-options-title-text-icon'>
                            <div>
                                <p>گۆرینی ناو</p>
                            </div>
                            <div>
                                <i class="fa-solid fa-gear"></i>
                            </div>
                        </div>
                        <div onClick={openChangeEmail} className='settings-options-title-text-icon'>
                            <div>
                                <p>گۆرینی ئیمەیڵ</p>
                            </div>
                            <div>
                                <i class="fa-solid fa-envelope"></i>
                            </div>
                        </div>
                        <div onClick={openChangePassword} className='settings-options-title-text-icon'>
                            <div>
                                <p>گۆرینی وشەی نهێنی</p>
                            </div>
                            <div>
                                <i class="fa-solid fa-lock"></i>
                            </div>
                        </div>
                        <div onClick={openDeleteAccount} className='settings-options-title-text-icon'>
                            <div>
                                <p>سڕێنەوەی هەژمار</p>
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
                                <p>گۆرینی ناوی هەژمارەکەت</p>
                                <small>بۆ گۆڕینی ناوی هەژمارەکەت, ناوە تازەکەت بنووسە</small>
                            </div>
                            <div className='settings-pages-input'>
                                <input type='text' placeholder='ناوی نوێ' />
                            </div>
                            <div className='settings-pages-alert-container'> 
                                <div className='settings-pages-alert'>
                                    <small>ناوی ئێستای هەژمارەکەت ژیار </small>
                                </div>
                            </div>
                            <div className='settings-pages-changename-button'>
                                <button>ناوەکەم بگۆرە</button>
                            </div>
                        </div>
                    </div>
                    <div className={`settings-pages-changeemail ${changeemail ? '' : 'active'}`}>
                        <div>
                            <div className='settings-pages-title'>
                                <p>گۆرینی ئیمایڵ</p>
                            </div>
                            <div className='settings-pages-input'>
                                <input type='text' placeholder='ناوی نوێ' />
                            </div>
                        </div>
                    </div>
                    <div className={`settings-pages-changepassword ${changepassword ? '' : 'active'}`}>
                        <div>
                            <div className='settings-pages-title'>
                                <p>گۆرینی پاسۆرد</p>
                            </div>
                            <div className='settings-pages-input'>
                                <input type='text' placeholder='ناوی نوێ' />
                            </div>
                        </div>
                    </div>
                    <div className={`settings-pages-deleteaccount ${deleteaccount ? '' : 'active'}`}>
                        <div>
                            <div className='settings-pages-title'>
                                <p>تەنەکەی خۆڵ</p>
                            </div>
                            <div className='settings-pages-input'>
                                <input type='text' placeholder='ناوی نوێ' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings;