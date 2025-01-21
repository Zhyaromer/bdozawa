// AboutUs.jsx
import { React } from 'react';
import './css/makejobsvip.css';
import { FaSearch, FaCity, FaUser, FaInstagram, FaTelegram, FaGithub, FaFacebook } from 'react-icons/fa';

const About = () => {

  return (
    <div className="about-us-container">
      <header className="about-us-header">
        <h1 className="about-us-title">دەربارەی ئێمە</h1>
        <p className="about-us-subtitle">
          ئاسانی دۆزینەوەی کار بۆ هەموو بەکارهێنەرانمان، بە تایبەتمەندی تایبەتی.
        </p>
      </header>

      <section className="about-us-section about-us-intro">
        <h2 className="section-title">چی پێشکەش دەکەین؟</h2>
        <div className="about-us-description-container">
          <p className="about-us-description">
            ئێمە پێشکەش دەکەین تایبەتمەندییەکی نوێ و باشتر بۆ دۆزینەوەی کار بە شێوەیەکی ئاسان و
            نوێ، بەرزکردنەوەی کاری هەر شتێک لە هەر شوێنەوە. بە تایبەتمەندی بەردەوام و شێوازە
            نوێی جیهانی، بە ئامانجی یارمەتی جوانانی نیشتیمانمان دەچین.
          </p>
        </div>
        <div className="features-container">
          <div className="feature-item">
            <FaSearch className="feature-icon" />
            <p>گەڕان بەناوی کار</p>
          </div>
          <div className="feature-item">
            <FaUser className="feature-icon" />
            <p>ڕەگەزی بەکارهێنەر</p>
          </div>
          <div className="feature-item">
            <FaCity className="feature-icon" />
            <p>گەڕان بە شار</p>
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
            <div className="social-links">
              <a href="#" className="social-link"><FaInstagram /></a>
              <a href="#" className="social-link"><FaGithub /></a>
              <a href="#" className="social-link"><FaTelegram /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <h2 className="section-title">پەیوەندی بە ئێمە</h2>
        <p>
          بۆ پەیوەندی کردن، ئێمە چەند بەشێکی تایبەتی داینیویە بۆ ئاسانکاری بەرزکردنەوە.
          تەنها کلیک بکەنە سەر ژمارەکان یان ڕاوتەکان.
        </p>
        <div className="social-links">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="social-icon" />
          </a>
          <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
            <FaTelegram className="social-icon" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="social-icon" />
          </a>
        </div>
      </section>

      <footer className="about-us-footer">
        <p>© 2025 - ماڵپەڕی کاری دۆزینەوە. هەموو مافەکان پارێزراون.</p>
      </footer>
    </div>
  );
};

export default About;