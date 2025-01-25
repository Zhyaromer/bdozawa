import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Slide, ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './css/emailverification.css';

const EmailVerification = () => {
    const location = useLocation();
    const [timer, setTimer] = useState(0);
    const [canResend, setCanResend] = useState(false);
    const { email } = location.state || {};
    const navigate = useNavigate();

    useEffect(() => {
        if (!email) {
            toast.error('هیچ ئیمەیلێك نەدۆزرایەوە', { transition: Slide });
        }
    }, [email]);

    useEffect(() => {
        const savedTimer = localStorage.getItem('emailVerificationTimer');
        if (savedTimer) {
            const timeRemaining = parseInt(savedTimer, 10) - Math.floor(Date.now() / 1000);
            if (timeRemaining > 0) {
                setTimer(timeRemaining);
                setCanResend(false);
            } else {
                setCanResend(true);
            }
        }
    }, []);

    useEffect(() => {
        let countdown;
        if (timer > 0) {
            countdown = setInterval(() => {
                setTimer((prevTimer) => {
                    const newTimer = prevTimer - 1;
                    localStorage.setItem('emailVerificationTimer', Math.floor(Date.now() / 1000) + newTimer);
                    return newTimer;
                });
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
            localStorage.removeItem('emailVerificationTimer');
        }
        return () => clearInterval(countdown);
    }, [timer]);

    const handleVerifyEmail = async () => {
        if (!email) return;
        try {
            const response = await axios.post(
                'http://localhost:3500/emailverify',
                { email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 201) {
                toast.success('ئیمەیڵەکەت بە سەرکەوتووی پشتراستکرایەوە', { transition: Slide });
                navigate('/login');
            } else if (response.status === 401) {
                toast.error('ئیمەیڵەکەت پشتڕاست نەکرایەوە. تکایە دووبارە هەوڵ بدەوە', { transition: Slide });
            } else {
                toast.warn('هەڵەیەک ڕویدا تکایە دووبارە هەوڵ بدەرەوە', { transition: Slide });
            }
        } catch (error) {
            toast.error('هەڵەیەک لە پشتڕاستکردنەوەی ئیمەیڵەکەتدا ڕوویدا. تکایە دووبارە هەوڵ بدەوە', { transition: Slide });
        }
    };

    const handleResendClick = async () => {
        if (!canResend) return;

        try {
            const response = await axios.post(
                "http://localhost:3500/resendemailverify",
                { email },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                }
            );
            if (response.status === 200) {
                toast.success("بەستەری پشتڕاستکردنەوەی ئیمەیڵەکەت دووبارە نێردرایەوە", { transition: Slide });
                const newTimer = 30;
                const expirationTime = Math.floor(Date.now() / 1000) + newTimer;
                localStorage.setItem('emailVerificationTimer', expirationTime);
                setTimer(newTimer);
                setCanResend(false);
            } else {
                toast.error('هەڵەیەک ڕویدا تکایە دووبارە هەوڵ بدەرەوە', { transition: Slide });
            }
        } catch (error) {
            toast.error("هەڵەیەک لە ناردنەوەی بەستەری پشتڕاستکردنەوەی ئیمەیڵەکەتدا ڕووی دا. تکایە دووبارە هەوڵ بدەوە", { transition: Slide });
        }
    };

    return (
        <div>
            <div className='emailverify'>
                <div className='emailverify-container'>
                    <div className='emailverify-content'>
                        <img width={"300px"} src="043_success-mail.gif" alt="" />
                        <h2 className='emailverify-title'>ئیمەیڵەکەت پشتڕاست بکەرەوە</h2>
                        <p className='emailverify-text'>
                            <strong>{email}</strong> <br />
                            ئیمەیڵێکی پشتڕاستکردنەوە بۆ ئیمەیڵەکەت نێردراوە، تکایە ئیمەیڵەکەت پشتڕاستبکەوە
                        </p>

                        <button onClick={handleVerifyEmail} className="cool-btn">پشتڕاستکردنەوە</button>
                        <p className="spanemail">
                            <p
                                className={`btn-link ${!canResend ? "disabled-link" : ""}`}
                                onClick={(e) => {
                                    if (!canResend) e.preventDefault();
                                    else handleResendClick();
                                }}
                            >
                                ئیمەیڵی پشتڕاستکردنەوە بنێرەوە
                            </p>
                        </p>
                        <p className="spantimer">{timer > 0 && `${timer}s`}</p>
                        <a className="btnlink" href="login" onClick={() => navigate('/login')}>
                            <i className="fa-solid fa-arrow-left"></i>دواتر ئەیکەم
                        </a>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-center" />
        </div>
    )
}

export default EmailVerification;
