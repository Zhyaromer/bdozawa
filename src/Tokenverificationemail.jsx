import { React, useState, useEffect } from 'react'
import './css/Tokenverificationemail.css'

const Tokenverificationemail = () => {
    const [isVerified, setIsVerified] = useState(false);
    const [istimeout, setIsTimeout] = useState(false);
    const [iserror, setIsError] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const email = urlParams.get('email');
        const verificationfunc = async () => {
            try {
                if (token && email) {
                    const response = await fetch(`http://localhost:3500/auth/emailverification?email=${email}&token=${token}`);
        
                    if (response.ok) {
                        setIsVerified(true);
                        setIsTimeout(false);
                        setIsError(false);
                    } else {
                        if (response.status === 410) {
                            setIsTimeout(true);
                            setIsVerified(false);
                            setIsError(false);
                        } else if (response.status === 404 || response.status === 403) {
                            setIsError(true);
                            setIsTimeout(false);
                            setIsVerified(false);
                        }
                    }
                }
            } catch (error) {
                setIsError(true);
                setIsTimeout(false);
                setIsVerified(false);
            }
        };
        
        verificationfunc();
    }, [])
    return (
        <div>
            <div className={`verified ${isVerified ? 'show' : ''}`}>
                <div class="Tokenverificationemail-container">
                    <div class="Tokenverificationemail-verified-icon"><i class="fa-solid fa-check"></i></div>
                    <h1>هەژمارەکەت پشتڕاستکرایەوە</h1>
                    <p>ئیمەیڵەکەت بە سەرکەوتووی پشتڕاستکرایەوە. دەتوانیت ئەم پەڕەیە داخەیت</p>
                </div>
            </div>
            <div className={`timeout ${istimeout ? 'show' : ''}`}>
                <div class="Tokenverificationemail-container">
                    <div class="Tokenverificationemail-timeout-icon"><i class="fa-solid fa-hourglass-end"></i></div>
                    <h1>کاتی پشتڕاستکردنەوە بەسەرچووە</h1>
                    <p>کاتی بەستەری پشتڕاستکردنەوەی ئێمەیلەکەت بەسەرچووە. تکایە داوای بەستەرێکی نوێ بکە</p>
                </div>
            </div>
            <div className={`error ${iserror ? 'show' : ''}`}>
                <div class="Tokenverificationemail-container">
                    <div class="Tokenverificationemail-error-icon"><i class="fa-solid fa-circle-check"></i></div>
                    <h1>هەڵەیەک ڕووی دا</h1>
                    <p>کێشەیەک لە پڕۆسەی پشتڕاستکردنەوەدا هەیە. تکایە دواتر دووبارەی بکەوە یان پەیوەندیمان پێوە بکە</p>
                </div>
            </div>
        </div>
    )
}

export default Tokenverificationemail