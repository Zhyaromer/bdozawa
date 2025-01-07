import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Slide, ToastContainer, toast } from 'react-toastify';
import '../node_modules/react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './css/emailverification.css';

const EmailVerification = () => {
    const location = useLocation();
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const { email } = location.state || {};
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!email) {
            toast.error('No email provided.', { transition: Slide });
        }
    }, [email]);

    const handleVerifyEmail = async () => {
        if (!email) return;

        setLoading(true);
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
                toast.success('Email verified successfully', { transition: Slide });
                navigate('/login');
            } else if (response.status === 401) {
                toast.error('Your Email has not been verified.Please try again', { transition: Slide });
            } else {
                toast.warn('Something went wrong. Please try again', { transition: Slide });
            }
        } catch (error) {
            console.error('Error verifying email:', error);
            toast.error('Error verifying email. Please try again.', { transition: Slide });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
            return () => clearInterval(countdown); // Cleanup interval on component unmount
        } else {
            setCanResend(true); // Enable link after timer reaches 0
        }
    }, [timer]);

    const handleResendClick = () => {
        setTimer(30); 
        setCanResend(false);
        // Add logic to resend the email here
        console.log("Resending verification email...");
    };

    const resendEmailVerification = async () => {
        try {
            const response = await axios.post('http://localhost:3500/resendemailverify', { email }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            })
            if (response.status === 200) {
                toast.success('Email verification link has been resent.', { transition: Slide });
            }
        } catch (error) {
            toast.error('Error resending email verification. Please try again.', { transition: Slide });
        }
    }

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
                        <p className='spanemail'><a
                            href="#resend"
                            className={`btn-link ${!canResend ? "disabled-link" : ""}`}
                            onClick={(e) => {
                                if (!canResend) e.preventDefault();
                                else resendEmailVerification();
                            }}
                        >
                            ئیمەیڵی پشتڕاستکردنەوە بنێرەوە
                        </a></p>
                        <p className='spantimer'>{timer > 0 && `${timer}s`}</p>
                        <a className="btnlink" href="login" onClick={() => navigate('/login')}>
                            <i class="fa-solid fa-arrow-left"></i>دواتر ئەیکەم
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmailVerification;