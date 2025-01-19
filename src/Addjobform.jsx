import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill from "react-quill";
import '../node_modules/react-quill/dist/quill.snow.css';
import './css/addjobform.css'
import { Loader } from 'lucide-react';
import { Slide, ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';

const Signupform = () => {
    const [formData, setFormData] = useState({
        jobtitle: '',
        companyname: '',
        description: '',
        gender: '',
        gmail: '',
        degree: '',
        degreetype: '',
        jobtype: '',
        salary: '',
        salaryrange1: '',
        salaryrange2: '',
        currency: '',
        experience: '',
    });
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();
    const [industrySearch, setIndustrySearch] = useState('');
    const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
    const [citySearch, setCitySearch] = useState('');
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const cities = ['Erbil', 'Sulaymaniyah', 'Duhok', 'Kirkuk'];
    const [selectedLanguages, setSelectedLanguages] = useState({
        کوردی: false,
        ئینگلیزی: false,
        عەرەبی: false,
    });
    const [selectedSalaryOption, setSelectedSalaryOption] = useState(null);
    const handleRadioChange = (option) => {
        setSelectedSalaryOption(option);

        if (option !== "salary1") {
            setFormData((prev) => ({ ...prev, salary: "" }));
        }
        if (option !== "salary2") {
            setFormData((prev) => ({
                ...prev,
                salaryrange1: "",
                salaryrange2: "",
            }));
        }
    };

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setSelectedLanguages(prevState => ({
            ...prevState,
            [name]: checked,
        }));
    };

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

    const handleQuillChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            description: value,
        }));
    };

    const formatPhoneNumber = (input) => {
        const cleaned = input.replace(/\D/g, '');

        let numberToFormat = cleaned;
        if (cleaned.length > 3 && !cleaned.startsWith('0')) {
            numberToFormat = '0' + cleaned;
        }

        let formatted = '';
        for (let i = 0; i < numberToFormat.length; i++) {
            if (i === 4 || i === 7) {
                formatted += ' ';
            }
            formatted += numberToFormat[i];
        }

        return formatted;
    };

    const handleChangePhonenumber = (e) => {
        const input = e.target.value;
        const rawNumber = input.replace(/\s/g, '');
        console.log(rawNumber);
        if (rawNumber.length <= 11) {
            const formatted = formatPhoneNumber(rawNumber);
            setPhoneNumber(formatted);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target.closest('form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        try {
            const langs = Object.keys(selectedLanguages).filter(key => selectedLanguages[key]);
            const phoneNum = phoneNumber.replace(/\s/g, '');
            if (langs.length === 0) {
                toast.error('تکایە بە لایەنی کەمەوە زمانێک هەڵبژێرە', { transition: Slide });
                return;
            }

            if (!formData.description || formData.description === '<p><br></p>') {
                toast.error('زانیاری لەسەر کار داواکراوە تکایە بەشی زانیاری کار پڕبکەوە', { transition: Slide });
                return;
            }
            const response = await axios.post('http://localhost:3500/addjob', {
                title: formData.jobtitle,
                company: formData.companyname,
                description: formData.description,
                location: citySearch,
                gender: formData.gender,
                companyNumber: phoneNum,
                companyEmail: formData.gmail,
                degree: formData.degree,
                degreetype: formData.degreetype,
                jobtype: formData.jobtype,
                industry: industrySearch,
                salary: formData.salary,
                language: langs,
                salaryrange1: formData.salaryrange1,
                salaryrange2: formData.salaryrange2,
                currency: formData.currency,
                experience: formData.experience
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                setLoading(true);
                toast.success('کارەکەت بە سەرکەوتووی زیادکرا', { transition: Slide });
            } else if (response.status === 409) {
                toast.error(response.data.message || 'Email already exists. Please use a different email.', { transition: Slide });
            } else if (response.status === 400) {
                toast.error(response.data.message || 'Invalid data. Please check your inputs.', { transition: Slide });
            } else {
                toast.error(response.data.message || 'Signup failed. Please try again later.', { transition: Slide });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred. Please try again later.', { transition: Slide });
        }
    };
    const goBack = () => {
        navigate(-1);
    }

    const modules = {
        toolbar: [
            ["bold", "italic"],
            [{ list: "ordered" }, { list: "bullet" }],
        ],
    };

    const formats = [
        "bold",
        "italic",
        "list",
    ];

    return (
        <div>
            <div className='addjob-back-save-container-pc'>
                <div className='addjob-back-save-container'>
                    <i onClick={goBack} class="fa-solid fa-arrow-left back-icon back-icon-addjob"></i>
                </div>
            </div>
            <div className='signup'>
                <div className='loading-container'>
                    <Loader size={50} className={loading ? 'loader' : 'loader-hidden'} />
                </div>
                <div className="signup-container">
                    <h2 className='signup-title'> ئیشەکەت لێرە دابنێ</h2>
                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="form-row img-section">
                            <label htmlFor="login" className="label-format">لۆگۆی شوێنەکەت لێرە دابنێ (ئەم بەشە ئارەزوومەندانەیە)</label>
                            <input type="file" />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className='label-format'>ناوی کارەکە</label>
                                <input maxLength='60' id='jobtitle' onChange={handleChange} value={formData.jobtitle} className='input-format' type="text" placeholder="ناوی کارەکە بنووسە" required />
                            </div>
                            <div className="form-group">
                                <label className='label-format'>ناوی کۆمپانیا</label>
                                <input maxLength='60' id='companyname' onInvalid={(e) => console.log(`${e.target.name} is invalid`)} onChange={handleChange} value={formData.companyname} className='input-format' type="text" placeholder="ناوی کۆمپانیەکەت بنووسە" required />
                            </div>
                        </div>
                        {/* //todo fix this */}
                        <div className="form-row quill-section">
                            <label className='label-format'>زانیاری لەسەر کارەکە</label>
                            <ReactQuill
                                className='quill-format'
                                id='description'
                                value={formData.description}
                                onChange={handleQuillChange}
                                placeholder="زانیاری پێویست لەسەر ئیشەکە بنووسە..."
                                theme="snow"
                                required
                                mmaxLength='3000'
                                modules={modules}
                                formats={formats}
                                style={{ height: '150px' }}
                            />
                        </div>
                        <br />

                        <div className="form-row salary-section">
                            <div className="addjob-salary-container">
                                <div className="addjob-salary-content">
                                    <div className="addjob-salary-input">
                                        <input
                                            required
                                            className="addjob-salary-radio"
                                            onChange={() => handleRadioChange("salary1")}
                                            type="radio"
                                            name="salary"
                                        />
                                    </div>
                                    <div className="addjob-salary-label">
                                        <label className="label-format">بڕی موچە دیاری بکە</label>
                                    </div>
                                </div>
                                <div className="addjob-salary-content">
                                    <div className="addjob-salary-input">
                                        <input
                                            required
                                            className="addjob-salary-radio"
                                            onChange={() => handleRadioChange("salary2")}
                                            type="radio"
                                            name="salary"
                                        />
                                    </div>
                                    <div className="addjob-salary-label">
                                        <label className="label-format">مەودای موچە دیاری بکە</label>
                                    </div>
                                </div>
                                <div className="addjob-salary-content">
                                    <div className="addjob-salary-input">
                                        <input
                                            required
                                            className="addjob-salary-radio"
                                            onChange={() => handleRadioChange("salary3")}
                                            type="radio"
                                            name="salary"
                                        />
                                    </div>
                                    <div className="addjob-salary-label">
                                        <label className="label-format">موچە دیاری نەکراوە</label>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`addjob-selectedsalary-container ${selectedSalaryOption === "salary3" ? "hide" : ""
                                    }`}
                            >
                                {selectedSalaryOption === "salary1" && (
                                    <div className="addjob-selectedsalary1 show">
                                        <label className="label-format salary-excat-label">
                                            بڕی موچەکە دیاری بکە
                                        </label>
                                        <div className="addjob-selectedsalary1-content">
                                            <div>
                                                <input
                                                    required
                                                    id="salary"
                                                    onChange={handleChange}
                                                    value={formData.salary}
                                                    className="input-format"
                                                    type="text"
                                                    placeholder="بڕی موچەکە بنووسە"
                                                />
                                            </div>
                                            <div>
                                                <select
                                                    required
                                                    id="currency"
                                                    onChange={handleChange}
                                                    value={formData.currency}
                                                    className="currency-picker"
                                                >
                                                    <option value="دینار">دینار</option>
                                                    <option value="دۆلار">دۆلار</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {selectedSalaryOption === "salary2" && (
                                    <div className="addjob-selectedsalary2 show">
                                        <label className="label-format salary-range-label">
                                            مەودای موچەکە دیاری بکە
                                        </label>
                                        <div className="salary-range-input">
                                            <div className="salary-range-input-content">
                                                <div>
                                                    <select
                                                        required
                                                        id="currency"
                                                        onChange={handleChange}
                                                        value={formData.currency}
                                                        className="currency-picker"
                                                    >
                                                        <option value="دینار">دینار</option>
                                                        <option value="دۆلار">دۆلار</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <input
                                                        id="salaryrange2"
                                                        name="salaryrange2"
                                                        onChange={handleChange}
                                                        value={formData.salaryrange2}
                                                        required
                                                        placeholder="نرخی دووەم"
                                                        type="number"
                                                    />
                                                </div>
                                                <div>
                                                    <p>بۆ</p>
                                                </div>
                                                <div>
                                                    <input
                                                        id="salaryrange1"
                                                        name="salaryrange1"
                                                        onChange={handleChange}
                                                        value={formData.salaryrange1}
                                                        required
                                                        placeholder="نرخی یەکەم"
                                                        type="number"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* done */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="label-format">شار یان شارۆچکەی کارەکەت</label>
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
                                <select onChange={handleChange} id='gender' value={formData.gender} className='input-format custom-select' required>
                                    <option value="">ڕەگەزی کەسی داواکراو هەڵبژێرە</option>
                                    <option value="male">نێر</option>
                                    <option value="female">مێ</option>
                                    <option value="notspecified">ڕەگەز گرنگ نیە</option>
                                </select>
                            </div>
                        </div>
                        {/* done */}

                        <div className="form-row">
                            <div className="form-group">
                                <label className='label-format'>ژمارەی مۆبایل</label>
                                <input
                                    maxLength="13"
                                    minLength="10"
                                    onChange={handleChangePhonenumber}
                                    id="phonenumber"
                                    value={phoneNumber}
                                    className="input-format"
                                    type="tel"
                                    placeholder="ژمارەی مۆبایلەکەت بنوسە"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className='label-format'>ئیمەیڵ (ئەم بەشە ئارەزوومەندانەیە)</label>
                                <input onChange={handleChange} id='gmail' value={formData.gmail} className='input-format' type="email" placeholder="ئیمەیڵەکەت بنوسە" required />
                            </div>
                        </div>
                        {/* done */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className='label-format'>شەهادە</label>
                                <select id='degree' value={formData.degree} onChange={handleChange} required className='input-format custom-select'>
                                    <option value="">شەهادەکەی کەسی داواکراو هەڵبژێرە</option>
                                    {degrees.map((degree) => (
                                        <option key={degree} value={degree.toLowerCase()}>
                                            {degree}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className='label-format'>بەشی بڕوانامە (ئەم بەشە ئارەزوومەندانە)</label>
                                <select id='degreetype' value={formData.degreetype} onChange={handleChange} className='input-format custom-select'>
                                    <option value="">بڕوانامەی کەسی داواکراو هەڵبژێرە</option>
                                    {degreetypes.map((degreetype) => (
                                        <option key={degreetype} value={degreetype.toLowerCase()}>
                                            {degreetype}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* done */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className='label-format'>پیشەسازی کار</label>
                                <div className="custom-select">
                                    <input
                                        className='input-format'
                                        type="text"
                                        placeholder="پیشەسازی کەسی داواکراو هەڵبژێرە"
                                        id='industry'
                                        autoComplete="off"
                                        required
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
                                <select id='jobtype' value={formData.jobtype} onChange={handleChange} className='input-format custom-select' required>
                                    <option value="">بژاردەیەک هەڵبژێرە</option>
                                    <option value="لەسەر کار">لەسەر کار</option>
                                    <option value="ئۆنڵاین">ئۆنڵاین</option>
                                    <option value="هەردووکیەتی">هەردووکیەتی</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className='label-format'>ئەزموونی کاری کەسی داواکراو هەڵبژێرە</label>
                                <select id='experience' value={formData.experience} onChange={handleChange} className='input-format custom-select' required>
                                    <option value="">بژاردەیەک هەڵبژێرە</option>
                                    <option value="بێ ئەزموون">بێ ئەزموون</option>
                                    <option value="سێ مانگ ئەزموون">سێ مانگ ئەزموون</option>
                                    <option value="شەش مانگ ئەزموون">شەش مانگ ئەزموون</option>
                                    <option value="نۆۆ مانگ ئەزموون">نۆۆ مانگ ئەزموون</option>
                                    <option value="یەک ساڵ ئەزموون">یەک ساڵ ئەزموون</option>
                                    <option value="دوو ساڵ ئەزموون">دوو ساڵ ئەزموون</option>
                                    <option value="سێ ساڵ ئەزموون">سێ ساڵ ئەزموون</option>
                                    <option value="چوار ساڵ ئەزموون">چوار ساڵ ئەزموون</option>
                                    <option value="پێنج ساڵ یان زیاتر">پێنج ساڵ یان زیاتر</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row language-section">
                            <label className="label-format">زمانی داواکراو هەڵبژێرە</label>
                            <div className="addjob-langs">
                                {Object.keys(selectedLanguages).map(language => (
                                    <div className="addjob-langs-each" key={language}>
                                        <div>
                                            <label htmlFor={language}>{language}</label>
                                        </div>
                                        <div>
                                            <input
                                                className="addjob-salary-checkbox"
                                                type="checkbox"
                                                name={language}
                                                id={language}
                                                checked={selectedLanguages[language]}
                                                onChange={handleCheckboxChange}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="alert alert-warning">
                            <p >
                                !کارەکەت لە ماوەی ٢٤-٤٨ کاتژمێر پەسەند دەکرێت
                            </p>
                        </div>

                        <button type="submit" className="signup-btn">کارەکە دابنێ</button>
                    </form>
                </div>
            </div>
            <ToastContainer position="top-center" />
        </div>
    )
}

export default Signupform;