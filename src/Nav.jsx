import './css/Nav.css'
import React, { useState } from 'react'

const Nav = () => {
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleCloseSidebar = () => {
        console.log('Close button clicked');
        setShowSidebar(false);
    };

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

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
                        <p onClick={toggleDropdown} className='accountName'> <i className="fa-solid fa-user"></i> guest</p>
                        <div className="user-dropdown">
                            <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                                <a href="#profile"><i class="fa-solid fa-gear"></i> پرۆفایل</a>
                                <a href="#saves"><i class="fa-solid fa-bookmark"></i> لیستی دڵخوازەکان</a>
                                <div className='logout'>
                                <a  href="#logout"><i class="fa-solid fa-right-from-bracket"></i> دەرچون</a>
                                </div>
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
            </div>
        </div>
    )
}

export default Nav