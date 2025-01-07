import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/signup.css';
import { Eye, EyeOff } from 'lucide-react';
import './css/Nav.css';
import { Slide, ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';

const Signupform = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        gmail: '',
        password: '',
        city: '',
        role: '',
        gender: '',
        degree: '',
        industry: '',
    });
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };
    const handleCloseSidebar = () => {
        setShowSidebar(false);
    };

    const [industrySearch, setIndustrySearch] = useState('');
    const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
    const [citySearch, setCitySearch] = useState('');
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const cities = ['Erbil', 'Sulaymaniyah', 'Duhok', 'Kirkuk'];

    const industries = [
        'Technology', 'Healthcare', 'Finance', 'Education',
        'Manufacturing', 'Retail', 'Construction', 'Entertainment'
    ];

    const degrees = [
        'No Degree', 'Diploma', 'Bachelor', 'Master', 'PhD'
    ];

    const filteredCities = cities.filter((city) =>
        city.toLowerCase().includes(citySearch.toLowerCase())
    );

    const filteredIndustries = industries.filter(industry =>
        industry.toLowerCase().includes(industrySearch.toLowerCase())
    );

    const handleCitySelect = (selectedCity) => {
        setCitySearch(selectedCity);
        setShowCityDropdown(false);
    };

    const handleCitychange = (e) => {
        setCitySearch(e.target.value);
        setShowCityDropdown(true);
    };

    const handleIndustrySelect = (selectedIndustry) => {
        setIndustrySearch(selectedIndustry);
        setShowIndustryDropdown(false);
    };

    const handleindustrychange = (e) => {
        setIndustrySearch(e.target.value);
        setShowIndustryDropdown(true);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        console.log(formData);
        e.preventDefault();
        try {
            console.log('here');
            const response = await axios.post('http://localhost:3500/signup', {
                displayName: formData.fullName,
                email: formData.gmail,
                password: formData.password,
                city: citySearch,
                gender: formData.gender,
                role: formData.role,
                degree: formData.degree,
                industry: industrySearch
            }, {
                withCredentials: true
            })

            if (response.status === 201) {
                navigate('/emailVerification', { state: { email: formData.gmail } });
            } else if (response.status === 409) {
                toast.error(response.data.message || 'Email already exists. Please use a different email.', { transition: Slide });
            } else if (response.status === 400) {
                toast.error(response.data.message || 'Invalid data. Please check your inputs.', { transition: Slide });
            } else {
                toast.error(response.data.message || 'Signup failed. Please try again later.', { transition: Slide });
            }
        } catch (error) {
            toast.error(error.response.data.message || 'An error occurred. Please try again later.', { transition: Slide });
        }
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
                                    <a href="#profile"><i className="fa-solid fa-right-to-bracket"></i> چونەژورەوە</a>
                                    <a href="#profile"><i className="fa-solid fa-user-plus"></i> دروستکردنی هەژمار</a>
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
            <div className='signup'>
                <div className="signup-container">
                    <h2 className='signup-title'>دروستکردنی هەژمار</h2>
                    <form className="signup-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label className='label-format'>ناوی سیانی</label>
                                <input id='fullName' onChange={handleChange} value={formData.fullName} className='input-format' type="text" placeholder="ناوی سیانیت بنوسە" required />
                            </div>

                            <div className="form-group">
                                <label className="label-format">شار یان شارۆچکە</label>
                                <div className="custom-select">
                                    <input
                                        className="input-format"
                                        type="text"
                                        placeholder="بە دوای شار یان شارۆچکەکەت بگەڕێ"
                                        id="city"
                                        value={citySearch}
                                        autoComplete="off"
                                        onChange={handleCitychange}
                                        onFocus={() => setShowCityDropdown(true)}
                                        required
                                    />
                                    {showCityDropdown && filteredCities.length > 0 && (
                                        <div >
                                            {
                                                filteredCities.map((city) => (
                                                    <div
                                                        className="dropdown-item"
                                                        key={city}
                                                        onClick={() => handleCitySelect(city)}
                                                    >
                                                        {city}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className='label-format'>ئیمەیڵ</label>
                                <input onChange={handleChange} id='gmail' value={formData.gmail} className='input-format' type="email" placeholder="ئیمەیڵەکەت بنوسە" required />
                            </div>

                            <div className="form-group">
                                <label className='label-format'>ڕەگەز</label>
                                <select onChange={handleChange} id='gender' value={formData.gender} className='input-format' required>
                                    <option value="">ڕەگەزەکەت هەڵبژێرە</option>
                                    <option value="male">نێر</option>
                                    <option value="female">مێ</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className='label-format'>شەهادە (ئەم بەشە ئارەزوومەندانە)</label>
                                <select id='degree' onChange={handleChange} className='input-format'>
                                    <option value="">شەهادەکەت هەڵبژێرە</option>
                                    {degrees.map((degree) => (
                                        <option key={degree} value={degree.toLowerCase()}>
                                            {degree}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className='label-format'>پیشەسازی کار (ئەم بەشە ئارەزوومەندانە)</label>
                                <div className="custom-select">
                                    <input
                                        className='input-format'
                                        type="text"
                                        placeholder="پیشەسازی کارەکەت هەڵبژێرە"
                                        id='industry'
                                        autoComplete="off"
                                        value={industrySearch}
                                        onChange={handleindustrychange}
                                        onFocus={() => setShowIndustryDropdown(true)}
                                    />
                                    {showIndustryDropdown && filteredIndustries.length > 0 && (
                                        <div >
                                            {
                                                filteredIndustries.map((industry) => (
                                                    <div
                                                        className="dropdown-item"
                                                        key={industry}
                                                        onClick={() => handleIndustrySelect(industry)}
                                                    >
                                                        {industry}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className='label-format'>بە دوای چیا ئەگەڕێی؟</label>
                                <select id='role' value={formData.role} onChange={handleChange} className='input-format' required>
                                    <option value="">بژاردەیەک هەڵبژێرە</option>
                                    <option value="job">بە دوای ئیشێکدا ئەگەڕێم</option>
                                    <option value="employee">بە دوای فەرمانبەردا ئەگەڕێم</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className='label-format'>وشەی نهێنی</label>
                                <input
                                    id='password'
                                    onChange={handleChange}
                                    value={formData.password}
                                    className='email-input input-format'
                                    type={showPassword ? "text" : "password"}
                                    placeholder="وشەی نهێنیکەت بنووسە"
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
                        </div>

                        <p className="signup-text">
                            هەژمارت هەیە؟{' '}
                            <a href="/login" className="signup-link">
                                چونەژورەوە
                            </a>
                        </p>

                        <button onClick={handleSubmit} type="submit" className="signup-btn">دروستکردن</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signupform;