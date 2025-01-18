import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill from "react-quill";
import '../node_modules/react-quill/dist/quill.snow.css';
import './css/addjobform.css'
import { Eye, EyeOff } from 'lucide-react';
import { Slide, ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';

const Signupform = () => {
    const [formData, setFormData] = useState({
        jobtitle: '',
        companyname: '',
        description: '',
        city: '',
        gender: '',
        phonenumber: '',
        gmail: '',
        degree: '',
        degreetype: '',
        role: '',
        industry: '',
    });
    const navigate = useNavigate();
    const [industrySearch, setIndustrySearch] = useState('');
    const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
    const [citySearch, setCitySearch] = useState('');
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const cities = ['Erbil', 'Sulaymaniyah', 'Duhok', 'Kirkuk'];
    const [salary1, setSalary1] = useState(false);
    const [salary2, setSalary2] = useState(false);
    const [salary3, setSalary3] = useState(false);
    const showSalary1 = () => {
        setSalary1(true);
        setSalary2(false);
        setSalary3(false);
    }

    const showSalary2 = () => {
        setSalary1(false)
        setSalary2(true);
        setSalary3(false);
    }

    const showSalary3 = () => {
        setSalary1(false);
        setSalary2(false);
        setSalary3(true);
    }

    const industries = [
        'Technology', 'Healthcare', 'Finance', 'Education',
        'Manufacturing', 'Retail', 'Construction', 'Entertainment'
    ];

    const degrees = [
        'No Degree', 'Diploma', 'Bachelor', 'Master', 'PhD'
    ];

    const degreetypes = [
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

    const goBack = () => {
        navigate(-1);
    }

    const modules = {
        toolbar: [
            ["bold", "italic"], // Bold and Italic
            [{ list: "ordered" }, { list: "bullet" }], // Numbered and Bullet Lists
        ],
    };

    const formats = [
        "bold",
        "italic",
        "list", // Includes both "ordered" and "bullet"
    ];

    return (
        <div>
            <div className='addjob-back-save-container'>
                <i onClick={goBack} class="fa-solid fa-arrow-left back-icon back-icon-addjob"></i>
            </div>
            <div className='signup'>
                <div className="signup-container">
                    <h2 className='signup-title'> ئیشەکەت لێرە دابنێ</h2>
                    <form className="signup-form">
                        <div className="form-row">
                            <label htmlFor="login" className="label-format">لۆگۆی شوێنەکەت لێرە دابنێ (ئەم بەشە ئارەزوومەندانەیە)</label>
                            <input type="file" />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className='label-format'>ناوی کارەکە</label>
                                <input id='jobtitle' onChange={handleChange} value={formData.jobtitle} className='input-format' type="text" placeholder="ناوی کارەکە بنووسە" required />
                            </div>
                            <div className="form-group">
                                <label className='label-format'>ناوی کۆمپانیا</label>
                                <input id='companyname' onChange={handleChange} value={formData.companyname} className='input-format' type="text" placeholder="نمونە کۆمپانیەکەت بنووسە" required />
                            </div>
                        </div>
                        {/* //todo fix this */}
                        {/* <div className="form-row">
                            <label className='label-format'>زانیاری لەسەر کارەکە</label>
                            <ReactQuill
                                value={formData.description}
                                placeholder="Enter job description..."
                                theme="snow"
                                maxLength={4000}
                                modules={modules}
                                formats={formats}
                                style={{ height: '150px' }}
                            />
                        </div>
                        <br /> */}

                        <div className="form-row">
                            <div className='addjob-salary-container'>
                                <div className='addjob-salary-content'>
                                    <div className='addjob-salary-input'>
                                        <input className='addjob-salary-radio' onChange={showSalary1} type="radio" name="salary" id="salary" />
                                    </div>
                                    <div className='addjob-salary-label'>
                                        <label className='label-format'>بڕی موچە دیاری  بکە</label>
                                    </div>
                                </div>
                                <div className='addjob-salary-content'>
                                    <div className='addjob-salary-input'>
                                        <input className='addjob-salary-radio' onChange={showSalary2} type="radio" name="salary" id="salary" />
                                    </div>
                                    <div className='addjob-salary-label'>
                                        <label className='label-format'>مەودای موچە دیاری بکە</label>
                                    </div>
                                </div>
                                <div className='addjob-salary-content'>
                                    <div className='addjob-salary-input'>
                                        <input className='addjob-salary-radio' onChange={showSalary3} type="radio" name="salary" id="salary" />
                                    </div>
                                    <div className='addjob-salary-label'>
                                        <label className='label-format'>موچە دیاری نەکراوە</label>
                                    </div>
                                </div>
                            </div>
                            <div className={`addjob-selectedsalary-container ${salary3 ? 'hide' : ''}`}>
                                <div className='addjob-selectedsalary-content'>
                                    <div className={`addjob-selectedsalary1 ${salary1 ? 'show' : ''}`}>
                                        <div className="form-group">
                                            <label className='label-format'>بڕی موچەکە دیاری بکە</label>
                                            <input id='jobtitle' onChange={handleChange} value={formData.jobtitle} className='input-format' type="text" placeholder="ناوی کارەکە بنووسە" required />
                                        </div>
                                    </div>
                                    <div className={`addjob-selectedsalary2 ${salary2 ? 'show' : ''}`}>
                                        <div className="form-group">
                                            <label className='label-format'>مەودای موچەکە دیاری بکە</label>
                                            <input id='jobtitle' onChange={handleChange} value={formData.jobtitle} className='input-format' type="text" placeholder="ناوی کارەکە بنووسە" required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div >

                        <div className="form-row">
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
                            <div className="form-group">
                                <label className='label-format'>ڕەگەز</label>
                                <select onChange={handleChange} id='gender' value={formData.gender} className='input-format' required>
                                    <option value="">ڕەگەزەکەت هەڵبژێرە</option>
                                    <option value="male">نێر</option>
                                    <option value="female">مێ</option>
                                    <option value="notspecified">ڕەگەز گرنگ نیە</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className='label-format'>ژمارەی مۆبایل</label>
                                <input onChange={handleChange} id='phonenumber' value={formData.phonenumber} className='input-format' type="tel" placeholder="ژمارەی مۆبایلەکەت بنوسە" required />
                            </div>
                            <div className="form-group">
                                <label className='label-format'>ئیمەیڵ (ئەم بەشە ئارەزوومەندانەیە)</label>
                                <input onChange={handleChange} id='gmail' value={formData.gmail} className='input-format' type="email" placeholder="ئیمەیڵەکەت بنوسە" required />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className='label-format'>شەهادە</label>
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
                                <label className='label-format'>بەشی بڕوانامە (ئەم بەشە ئارەزوومەندانە)</label>
                                <select id='deegreetype' onChange={handleChange} className='input-format'>
                                    <option value="">شەهادەکەت هەڵبژێرە</option>
                                    {degreetypes.map((degreetype) => (
                                        <option key={degreetype} value={degreetype.toLowerCase()}>
                                            {degreetype}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className='label-format'>پیشەسازی کار</label>
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
                            <div className="form-group">
                                <label className='label-format'>جۆری کارەکە (ئەم بەشە ئارەزوومەندانەیە)</label>
                                <select id='role' value={formData.role} onChange={handleChange} className='input-format' required>
                                    <option value="">بژاردەیەک هەڵبژێرە</option>
                                    <option value="job">لەسەر کار</option>
                                    <option value="employee">ئۆنڵاین</option>
                                    <option value="employee">هەردووکیەتی</option>
                                </select>
                            </div>
                        </div>

                        <div className="alert alert-warning">
                            <p >
                                !کارەکەت لە ماوەی ٢٤-٤٨ کاتژمێر پەسەند دەکرێت
                            </p>
                        </div>

                        <button onClick={handleSubmit} type="submit" className="signup-btn">کارەکە دابنێ</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signupform;