import React, { useState } from 'react';
import './css/jobs.css'
import { FaFilter } from 'react-icons/fa';

const Test = () => {
    const [filterclose, setFilterclose] = useState(false);
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
    const [showSidebar, setShowSidebar] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleSidebar = () => setShowSidebar(!showSidebar);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const toggleFilter = () => setFilterclose(!filterclose);

    const handleCloseSidebar = () => {
        console.log('Close button clicked');
        setShowSidebar(false);
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
                            <p onClick={toggleDropdown} className='accountName'> <i className="fa-solid fa-user"></i> guest</p>
                            <div className="user-dropdown">
                                <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                                    <>
                                        <a href="/login"><i className="fa-solid fa-right-to-bracket"></i> چونەژورەوە</a>
                                        <a href="#profile"><i className="fa-solid fa-user-plus"></i> دروستکردنی هەژمار</a>
                                    </>
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
                                autoComplete='off'
                            />
                        </div>
                        <div className='filter'>
                            <button onClick={toggleFilter} className='filterbtn'><FaFilter /> فلتەر</button>
                        </div>
                    </div>
                </div>

                <div className='result-container'>
                    <p className='result'>ئیشی بەردەست: 22</p>
                </div>
            </div>

            <div className={`filters-container ${filterclose ? "open" : ""}`}>
                <div className='upper-sec'>
                    <h3 className='filter-title-result'>ئیشی بەردەست 22</h3>
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
                        <div  className="checkbox-container">
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
        </div>
    )
}

export default Test