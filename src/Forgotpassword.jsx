import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Slide, ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import './css/emailverification.css';
import './css/forgetpassowrd.css'

const Forgotpassword = () => {
    const [timer, setTimer] = useState(0);
    const [email, setEmail] = useState('');
    const [canResend, setCanResend] = useState(false);
    const navigate = useNavigate();

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

    const handleResendClick = async (e) => {
        if (!canResend) return;
        try {
            const response = await axios.post(
                "http://localhost:3500/resetpassword",
                { email },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                }
            );
            if (response.status === 200) {
                toast.success("بەستەری گۆڕینی وشەی نهێنی هەژمارەکەت نێردرا", { transition: Slide });
                setEmail('');
                const newTimer = 30;
                const expirationTime = Math.floor(Date.now() / 1000) + newTimer;
                localStorage.setItem('emailVerificationTimer', expirationTime);
                setTimer(newTimer);
                setCanResend(false);
            } else if (response.status === 400) {
                toast.success("تکایە ئیـەیڵەکەت بنووسە", { transition: Slide });
            } else if (response.status === 404) {
                toast.success("هیچ ئیمەیڵێك نەدۆزرایەوە", { transition: Slide });
            } else {
                toast.error('هەڵەیەک ڕویدا تکایە دووبارە هەوڵ بدەوە', { transition: Slide });
            }
        } catch (error) {
            toast.error("هەڵەیەک لە ناردنی بەستەری گۆڕینی وشەی نهێنی هەژمارەکەت ڕووی دا. تکایە دووبارە هەوڵ بدەوە", { transition: Slide });
        }
    };

    return (
        <div>
            <div className='emailverify'>
                <div className='emailverify-container'>
                    <div className='emailverify-content'>
                        <img className='forgotpassowrd-img' src="forgot-password.png" alt="" />
                        <h2 className='emailverify-title'>وشەی نهێنیەکەی لەبیر کردوە؟</h2>
                        <p className='emailverify-text'>
                            ئیمەیڵی هەژمارەکەت بنووسە تاوەکو بەستەرێکت بۆ بنێرین بۆ یارمەتی دان لە گۆرینی وشەی نهێنیەکەت
                        </p>

                        <input className='forgotemail-input' type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ئیمەیڵەکەت بنووسە" required/>

                        <button onClick={(e) => {
                            if (!canResend) e.preventDefault();
                            else handleResendClick();
                        }} className={`cool-btn ${!canResend ? "disabled-link" : ""}`}
                        >بەستەرەکە بنێرە</button>

                        <p className="spantimer forgotpass-timer">{timer > 0 && `${timer}s`}</p>
                        <br />
                        <button className="transparent-btn" onClick={() => navigate(-1)}>
                            <i className="fa-solid fa-arrow-left"></i> گەڕانەوە
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-center" />
        </div>
    )
}

export default Forgotpassword;
