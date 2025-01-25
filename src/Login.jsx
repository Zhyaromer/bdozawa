import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import useAuthRedirect from './ChekingAuth';
import { Slide, ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';
import './css/Nav.css';
import { Eye, EyeOff } from 'lucide-react';
import { auth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from './FirebaseService';
import './css/login.css'

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [showSidebar, setShowSidebar] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleCloseSidebar = () => {
        setShowSidebar(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();

            const response = await axios.post("http://localhost:3500/login", { email, password }, {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
                withCredentials: true,
            });

            console.log(`response.status: ${response.status}`);

            if (response.status === 200) {
                navigate('/');
            } else if (response.status === 429) {
                setMessage(response.data.message);
            } else {
                setMessage("وشەی نهێنی یان ئیمەیڵەکەت هەلەیە");
                toast.error('وشەی نهێنی یان ئیمەیڵەکەت هەلەیە', { transition: Slide });
            }
        } catch (err) {
            setMessage('idk');
            toast.error(`idk`, { transition: Slide });
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account',
        });
        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();
            const response = await axios.post("http://localhost:3500/googleauth", { email: result.user.email }, { headers: { Authorization: `Bearer ${idToken}` }, withCredentials: true })

            console.log(`response.status: ${response.status}`);

            if (response.status === 200) {
                console.log(`response.status === 200`);
                navigate('/jobs');
            } else if (response.status === 201) {
                console.log(`response.status === 201`);
                navigate(`/SignUpGoogle?email=${encodeURIComponent(result.user.email)}&displayName=${encodeURIComponent(result.user.displayName)}`);
            }
        } catch (err) {
            toast.error(`${err.message}`, { transition: Slide });
            console.error(err);
        }
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
            <div className="login-container">
                <div className="login-card">
                    <h1 className="login-title">چونەژوورەوە</h1>

                    <div className={`${message ? 'alert alert-danger' : ''}`}>{message && <p>{message}</p>}</div>

                    <form onSubmit={handleLogin}>
                        <div className="form-label-email">
                            <label className='email-label' htmlFor="email"><i class="fa-regular fa-envelope mail-icon"></i>ئیمەیڵ
                            </label>
                        </div>
                        <div className="form-group">
                            <input
                                className='email-input'
                                type="email"
                                placeholder="ئیمەیڵەکەت بنووسە"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <div className="form-label-email">
                                <label className='email-label' htmlFor="email"><i class="fa-solid fa-lock mail-icon"></i>وشەی نهێنی
                                </label>
                            </div>
                            <input
                                className='email-input'
                                type={showPassword ? "text" : "password"}
                                placeholder="وشەی نهێنیکەت بنووسە"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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

                        <a href="/forgotpassword" className="forgot-password">
                            وشەی نهێنیت لەبیرکردووە؟
                        </a>

                        <button type="submit" className="submit-btn">
                            چونەژوورەوە
                        </button>

                        <h4 className='divider-or'>یان</h4>

                        <button onClick={handleGoogleLogin} type="button" className="google-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 48 48">
                                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                                <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
                                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                            </svg>
                            بەردەوام بوون لە ڕێگەی گووگڵ
                        </button>

                        <p className="signup-text">
                            هەژمارت نییە؟{' '}
                            <a href="/signup" className="signup-link">
                                دروستکردنی هەژمار
                            </a>
                        </p>
                        <ToastContainer position='top-right' />
                    </form>
                </div>
            </div>
        </div >
    )
}

export default Login;