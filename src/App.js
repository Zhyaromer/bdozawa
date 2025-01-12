import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './Nav.jsx'
import Home from './Home.jsx';
import Login from './Login.jsx';
import Signup from './Signupform.jsx';
import Emailverification from './Emailverification.jsx'
import Jobs from './Jobs.jsx';
import JobDetails from './JobDetails.jsx';
import PrePostJob from './PrePostJob.jsx';
import Test from './Test.jsx';

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
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
}

export default App;
