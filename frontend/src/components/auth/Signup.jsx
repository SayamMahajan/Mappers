import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import '../../styles/Signup.css';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    state: '',
    country: 'India'
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.signup(formData);
      if (response.success) {
        navigate('/verify-email');
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      setMessage('An error occurred during signup');
    }
  };

  return (
    <div className="signup-wrapper">
      <input className="c-checkbox" type="checkbox" id="start" />
      <input className="c-checkbox" type="checkbox" id="progress2" />
      <input className="c-checkbox" type="checkbox" id="progress3" />
      <input className="c-checkbox" type="checkbox" id="progress4" />
      <input className="c-checkbox" type="checkbox" id="progress5" />
      <input className="c-checkbox" type="checkbox" id="progress6" />
      <input className="c-checkbox" type="checkbox" id="progress7" />
      <input className="c-checkbox" type="checkbox" id="finish" />
      <div className="c-form__progress"></div>

      <div className="c-formContainer">
        <div className="c-welcome">Welcome aboard!</div>
        <form className="c-form" onSubmit={handleSubmit}>
          {/* Step 1 - First Name */}
          <div className="c-form__group">
            <label className="c-form__label" htmlFor="firstName">
              <input
                type="text"
                id="firstName"
                className="c-form__input"
                placeholder=" "
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                pattern="[^\s]+"
                required
              />
              <label className="c-form__next" htmlFor="progress2" role="button">
                <span className="c-form__nextIcon"></span>
              </label>
              <span className="c-form__groupLabel">First Name</span>
              <b className="c-form__border"></b>
            </label>
          </div>

          {/* Step 2 - Last Name */}
          <div className="c-form__group">
            <label className="c-form__label" htmlFor="lastName">
              <input
                type="text"
                id="lastName"
                className="c-form__input"
                placeholder=" "
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                pattern="[^\s]+"
                required
              />
              <label className="c-form__next" htmlFor="progress3" role="button">
                <span className="c-form__nextIcon"></span>
              </label>
              <span className="c-form__groupLabel">Last Name</span>
              <b className="c-form__border"></b>
            </label>
          </div>

          {/* Step 3 - Email */}
          <div className="c-form__group">
            <label className="c-form__label" htmlFor="email">
              <input
                type="email"
                id="email"
                className="c-form__input"
                placeholder=" "
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$"
                required
              />
              <label className="c-form__next" htmlFor="progress4" role="button">
                <span className="c-form__nextIcon"></span>
              </label>
              <span className="c-form__groupLabel">What's your email?</span>
              <b className="c-form__border"></b>
            </label>
          </div>

          {/* Step 4 - Password */}
          <div className="c-form__group">
            <label className="c-form__label" htmlFor="password">
              <input
                type="password"
                id="password"
                className="c-form__input"
                placeholder=" "
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <label className="c-form__next" htmlFor="progress5" role="button">
                <span className="c-form__nextIcon"></span>
              </label>
              <span className="c-form__groupLabel">Create your password</span>
              <b className="c-form__border"></b>
            </label>
          </div>
          
          {/* Step 5 - Phone Number */}
          <div className="c-form__group">
            <label className="c-form__label" htmlFor="phoneNumber">
              <input
                type="tel"
                id="phoneNumber"
                className="c-form__input"
                placeholder=" "
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
              />
              <label className="c-form__next" htmlFor="progress6" role="button">
                <span className="c-form__nextIcon"></span>
              </label>
              <span className="c-form__groupLabel">Phone Number</span>
              <b className="c-form__border"></b>
            </label>
          </div>
          
          {/* Step 6 - State */}
          <div className="c-form__group">
            <label className="c-form__label" htmlFor="state">
              <input
                type="text"
                id="state"
                className="c-form__input"
                placeholder=" "
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
              <label className="c-form__next" htmlFor="progress7" role="button">
                <span className="c-form__nextIcon"></span>
              </label>
              <span className="c-form__groupLabel">Your State</span>
              <b className="c-form__border"></b>
            </label>
          </div>
          
          {/* Step 7 - Country */}
          <div className="c-form__group">
            <label className="c-form__label" htmlFor="country">
              <input
                type="text"
                id="country"
                className="c-form__input"
                placeholder=" "
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
              <label className="c-form__next" htmlFor="finish" role="button">
                <span className="c-form__nextIcon"></span>
              </label>
              <span className="c-form__groupLabel">Your Country</span>
              <b className="c-form__border"></b>
            </label>
          </div>

          <label className="c-form__toggle" htmlFor="start">Register<span className="c-form__toggleIcon"></span></label>
        </form>
      </div>
    </div>
  );
}