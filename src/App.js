import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './Nav.jsx'
import Home from './Home.jsx';
import Login from './Login.jsx';
import Signup from './Signupform.jsx';
import Emailverification from './Emailverification.jsx'
import Jobs from './Jobs.jsx';
import JobDetails from './JobDetails.jsx';
import PrePostJob from './PrePostJob.jsx';
import Addjobform from './Addjobform.jsx';
import JobPostingGuide from './Postingtutorial.jsx';
import VIPJobGuide from './Makejobvip.jsx';
import About from './About.jsx';
import ContactPage from './Contact.jsx';
import Faq from './Faq.jsx';
import Settings from './Settings.jsx';
import Test from './Test.jsx';
import Googlesignup from './Googlesignup.jsx'
import Forgotpassword from './Forgotpassword.jsx';
import Jobdetails2 from './Jobdetails2.jsx';
import Tokenverificationemail from './Tokenverificationemail.jsx';
import Savedjobs from './Savedjobs.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nav" element={<Nav />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/emailverification" element={<Emailverification />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/prepostjob" element={<PrePostJob />} />
        <Route path="/jobs/jobdetails" element={<JobDetails />} />
        <Route path="/jobs/jobdetails2" element={<Jobdetails2 />} />
        <Route path="/addjob" element={<Addjobform />} />
        <Route path="/postingtutorial" element={<JobPostingGuide />} />
        <Route path="/makejobvip" element={<VIPJobGuide />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth/emailverification" element={<Tokenverificationemail />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/savedjobs" element={<Savedjobs />} />
        <Route path="/googlesignup" element={<Googlesignup />} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
}

export default App;
