import { Route, Routes, BrowserRouter, Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './layout/layout';
import Layout1 from "./Layout1/SidebarHeader";
import Login from './page/SignIn/SignIn';
import Dashboard from './page/dashboard';
import Devices from './page/devices';
import HealthyContent from './page/healthyContent';
import Forums from './page/forums';
import ForumAdd from './page/forumAdd';
import SignUp from './page/SignUp/SignUp'
import WellnessProgram from './page/wellnessProgram/wellnessProgram';
import CustomerAddForm from './page/wellnessProgram/companyAddForm';
import CompanySignUp from './page/signupCompany';
import UserAddForm from './page/wellnessProgram/userAddForm';
import UserSignUp from './page/signupUser';
import CompanyEmployee from './page/wellnessProgram/companyEmployee';
import FitbitAuthentication from './page/authentication/fitbitAuthetication';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Membership from './page/membership';
import PaymentConfirm from './page/membership/PaymentConfirm';
import Profile from './page/profile';
import ConfirmUser from './page/authentication/confirmUser';
import SummaryGoals from './page/summaryGoals';
import CompanySignUpLanding from './page/signupCompanyLanding';
import Leaderboard from './page/leaderboard/leaderboard';
import SignupMessage from './page/authentication/signupMessage';
import PersonalTraining from './page/personalTraining/PersonalTraining';
import PaymentConfirmationPage from './page/personalTraining/paymentConfirmationPage';
import TrainingSlots from './page/trainingSlots/trainingSlots';
import AddUnavailableSlots from './page/trainingSlots/addUnavailableSlots';
import BookSessions from './page/personalTraining/BookSession';
import SessionHistory from './page/personalTraining/sessionHistory';
import CompanyReport from './page/companyReport/companyReport';
import SignupSuccessCompanyUser from './page/authentication/signupCompanyUserSuccess';
// import ForgotPassword from './page/forgotPassword/forgotPassword';
import ForgotPassword from './page/forgotPassword/Forgot';
import ResetPassword from './page/forgotPassword/resetPassword';
import UserList from './page/userList';
import Coupons from './page/coupons';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" exact element={<Login />} />
        <Route path="/sign-up" exact element={<SignUp />} />
        <Route path="/sign-up/company" exact element={<CompanySignUpLanding />} />
        <Route path="/sign-up/company/:token" exact element={<CompanySignUp />} />
        <Route path="/sign-up/user/:token" exact element={<UserSignUp />} />
        <Route path="/sign-up/success/:name" exact element={<SignupMessage />} />
        <Route path="/confirm/user/:token/:email" exact element={<ConfirmUser />} />
        <Route path="/company/user/signup/success/:name" element={<SignupSuccessCompanyUser />} />
        <Route path="/forgot/password" exact element={<ForgotPassword />} />
        <Route path="/reset/password/:token" element={<ResetPassword />} />
        {/* <Route path="/" element={<Layout />}> */}
        <Route path="/" element={<Layout1 />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/device" element={<Devices />} />
          <Route path="/device/authenticate/:fitbit_user_id" element={<FitbitAuthentication />} />
          <Route path="/healthycontent" element={<HealthyContent />} />
          <Route path="/forums" element={<Forums />} />
          <Route path="/forums/add" element={<ForumAdd />} />
          <Route path="/wellnessprogram/invite-user" element={<UserAddForm />} />
          <Route path="/wellnessprogram" element={<WellnessProgram />} />
          <Route path="/wellnessprogram/company/:companyEmail" element={<CompanyEmployee />} />
          <Route path="/wellnessprogram/invite-company" element={<CustomerAddForm />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/payment-confirm" element={<PaymentConfirm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/summary-goals" element={<SummaryGoals />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/services" element={<PersonalTraining />} />
          <Route path="/services/book/slots" element={<BookSessions />} />
          <Route path="/services/pament/confirm" element={<PaymentConfirmationPage />} />
          <Route path="/training-slots" element={<TrainingSlots />} />
          <Route path="/training-slots/add" element={<AddUnavailableSlots />} />
          <Route path="/booked/sessions" element={<SessionHistory />} />
          <Route path="/company/report" element={<CompanyReport />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/coupons" element={<Coupons />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
