// AboutUs.jsx
import { React, useState, useEffect } from 'react';
import './css/makejobsvip.css';
import { FaSearch, FaNewspaper, FaRegMoneyBillAlt, FaInstagram, FaTelegram, FaGithub } from 'react-icons/fa';
import axios from 'axios';
import { auth, signOut, onAuthStateChanged } from './FirebaseService';

const About = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const [user, setUser] = useState(null);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleCloseSidebar = () => {
    console.log('Close button clicked');
    setShowSidebar(false);
  };

  const deleteCookie = (name) => {
    document.cookie = `${name}=; Max-Age=0; path=/;`;
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        deleteCookie('idToken');
        console.log("User logged out");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log('Firebase user:', firebaseUser);
        try {
          const response = await axios.post(
            "http://localhost:3500/checkAuth",
            { uid: firebaseUser.uid },
            { withCredentials: true }
          );

          console.log(`Firebase user response status: ${response.status}`);
          if (response.status === 200) {
            console.log("Authenticated user");
            setUser(firebaseUser);
          } else if (response.status === 404) {
            console.log("User not authenticated or profile not complete");
            setUser(false);
          } else {
            console.log(`Unexpected status code: ${response.status}`);
            setUser(false);
          }
        } catch (error) {
          console.error(`Error checking authentication: ${error.message}`);
          setUser(false);
        }
      } else {
        console.log("No user signed in");
        setUser(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
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
              {user ? (
                <p onClick={toggleDropdown} className='accountName'> <i className="fa-solid fa-user"></i> {user.displayName.split(' ')[0]}</p>
              ) : (
                <p onClick={toggleDropdown} className='accountName'> <i className="fa-solid fa-user"></i> guest</p>
              )}
              <div className="user-dropdown">
                <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                  {user ? (
                    <>
                      <a href="#profile"><i className="fa-solid fa-gear"></i> پرۆفایل</a>
                      <a href="#saves"><i className="fa-solid fa-bookmark"></i> لیستی دڵخوازەکان</a>
                      <div className="logout">
                        <a onClick={logout} href="#logout"><i className="fa-solid fa-right-from-bracket"></i> دەرچون</a>
                      </div>
                    </>
                  ) : (
                    <>
                      <a href="/login"><i className="fa-solid fa-right-to-bracket"></i> چونەژورەوە</a>
                      <a href="#profile"><i className="fa-solid fa-user-plus"></i> دروستکردنی هەژمار</a>
                    </>
                  )}
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
      <div className="about-us-container">
        <header className="about-us-header">
          <h1 className="about-us-title">ئامانجی ئێمە</h1>
          <p className="about-us-subtitle">
            پلاتفۆرمێکی سەردەمیانە بۆ یەکگرتنەوەی خاوەن کار و کارخوازان، باشترین شوێن بۆ دۆزینەوەی کاری داهاتووت
          </p>
        </header>

        <section className="about-us-section about-us-intro">
          <h2 className="section-title">چی پێشکەش دەکەین؟</h2>
          <div className="about-us-description-container">
            <p className="about-us-description">
              لە ڕێگەی تەکنەلۆژیای نوێ و سیستەمی پێشکەوتوو، ئێمە هەوڵ دەدەین ببینە پردێک لە نێوان کۆمپانیاکان و ئەو کەسانەی بەدوای کاردا دەگەڕێن. ئامانجمان دروستکردنی پلاتفۆرمێکی متمانەپێکراو و کاریگەرە بۆ دۆزینەوەی هەلی کار.
            </p>
          </div>
          <div className="features-container">
            <h2>تایبەتمەندییەکانی ماڵپەڕەکەمان</h2>
            <div className="feature-item">
              <FaSearch className="feature-icon" />
              <h3>گەڕانی پێشکەوتوو</h3>
              <p>گەڕان بەپێی ناوی کار، ڕەگەز، شار و چەندین فلتەری پێشکەوتوو وە دۆزینەوەی خێرا</p>
            </div>
            <div className="feature-item">
              <FaNewspaper className="feature-icon" />
              <h3>نوێترین هەلی کارەکان</h3>
              <p>هەلی بەردەوام بینەری تازەترین هەلی کارەکان ببە، نوێکردنەوەی ڕۆژانە و هەلی کاری ئۆنڵاین</p>
            </div>
            <div className="feature-item">
              <FaRegMoneyBillAlt className="feature-icon" />
              <h3>بەکارهێنانی بێبەرامبەر</h3>
              <p>ماڵپەڕەکەمان بۆ دۆزینەوەی کار بێبەرامبەرە و دەتوانی بەخۆڕایی بەکاری بهێنیت</p>
            </div>
          </div>
        </section>

        <section className="creator-section">
          <div className='creator-imagetitle-container'>
            <h2>دەربارەی دروستکەر</h2>
            <div className="creator-image-wrapper">
              <img src="/api/placeholder/150/150" alt="Creator" className="creator-image" />
            </div>
          </div>
          <div className="creator-content">
            <div className="creator-info">
              <div className="creator-text">
                <p className="creator-main-text">
                  من خوێندکاری قۆناغی دووەمم لە بەشی تەکنەلۆژیای زانیاری. ئەم پڕۆژەیەم دروستکردووە بۆ یارمەتیدانی گەنجانی وڵاتەکەم لە دۆزینەوەی هەلی کار.
                </p>
                <p className="creator-vision">
                  ئامانجم ئەوەیە کە پردێک دروست بکەم لە نێوان خاوەن کار و ئەو کەسانەی بەدوای کاردا دەگەڕێن. بە بەکارهێنانی تەکنەلۆژیای نوێ، دەمانەوێت پرۆسەی دۆزینەوەی کار ئاسانتر بکەین.
                </p>
              </div>
              <div className="about-social-links">
                <a href="#" className="about-social-link"><FaInstagram /></a>
                <a href="#" className="about-social-link"><FaGithub /></a>
                <a href="#" className="about-social-link"><FaTelegram /></a>
              </div>
            </div>
          </div>
        </section>

        <div className="help-section">
          <div className="contact-section about-contact-section">
            <h2>پەیوەندیمان پێوە بکە</h2>
            <div className="contact-grid">
              <div className="contact-item">
                <div className="contact-icon"><i class="fa-solid fa-envelope"></i></div>
                <h3>ئیمەیڵ</h3>
                <p>contact@example.com</p>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><i class="fa-solid fa-phone"></i></div>
                <h3>تەلەفۆن</h3>
                <p>0750 123 4567</p>
              </div>
            </div>

            <div className="social-links">
              <div className="social-icon">
                <span><i class="fa-brands fa-facebook"></i></span> Facebook
              </div>
              <div className="social-icon">
                <span><i class="fa-brands fa-instagram"></i></span> Instagram
              </div>
              <div className="social-icon">
                <span><i class="fa-brands fa-telegram"></i></span> Telegram
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className='footer-main'>
        <div className='footer-container'>
          <div className='footer-main-div'>
            <h2 className='footer-h2'>Jobify</h2>
            <p className='footer-p1'>ماڵپەڕەکەمان پلاتفۆرمێکە کە دەتوانیت بە ئاسانی و بە خێرایی کار بدۆزیتەوە. هەروەها دەتوانیت کارەکەت لێرە بڵاو بکەیتەوە و باشترین کاندید بدۆزیتەوە بۆ کارەکەت.</p>
            <div className='footer-main-social'>
              <a className='socials' href="/"><i class="fa-brands fa-facebook"></i></a>
              <a className='socials' href="/"><i class="fa-brands fa-tiktok"></i></a>
              <a className='socials' href="/"><i class="fa-brands fa-instagram"></i></a>
            </div>
          </div>
          <div className='footer-main-secs'>
            <div className='footer-main-sec-links'>
              <h3 className='footer-h3'>یارمەتی</h3>
              <ul className='footer-ul'>
                <li><a href="/">پرسیارە دووبارەکان</a></li>
                <li><a href="/jobs">یارمەتی بەدەست بهێنە</a></li>
                <li><a href="/jobs">پەیوەندیکردن</a></li>
                <li><a href="/jobs">ڕێنمایی</a></li>
                <li><a href="/jobs">ڕیکلام کردن</a></li>
              </ul>
            </div>
          </div>
          <div className='footer-main-secs'>
            <div className='footer-main-sec-links'>
              <h3 className='footer-h3'>کارەکان</h3>
              <ul className='footer-ul'>
                <li><a href="/">بینینی ئیشەکان</a></li>
                <li><a href="/jobs">ئیشی ڤی ئای پی</a></li>
                <li><a href="/jobs">دۆزینەوەی هەلی کار</a></li>
              </ul>
            </div>
          </div>
          <div className='footer-main-secs'>
            <div className='footer-main-sec-links'>
              <h3 className='footer-h3'>هەژمار</h3>
              <ul className='footer-ul'>
                <li><a href="/jobs">چونە ژوورەوە</a></li>
                <li><a href="/">دروستکرندی هەژمار</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className='footer-bottom'>
          <div className='footer-bottom-line'>
          </div>
          <div className='footer-bottom-txt'>
            <p className='footer-bottom-p'>هەموو مافێک پارێزراوە بۆ جۆبی فای &copy; 2025</p>
          </div>
          <p className='powerby-p'>powered by <a className='powerby-a' target='_blank' rel="noreferrer" href="https://www.facebook.com/zhyaromer999/">zhyar omer</a></p>
        </div>
      </footer>
    </div>
  );
};

export default About;