// PhoneLogin.jsx
import React, { useState } from 'react';
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyAUJ4y6gOekbGyC6BIeYD9ZW4t3rMjynIg',
  authDomain: 'vyavastha-77cca.firebaseapp.com',
  projectId: 'vyavastha-77cca',
  storageBucket: 'vyavastha-77cca.firebasestorage.app',
  messagingSenderId: '222285372160',
  appId: '1:222285372160:web:fb3861becda6486c3fb1e5'
};

initializeApp(firebaseConfig);

const PhoneLogin = () => {
  const [phone, setPhone] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  const sendOTP = async () => {
    const auth = getAuth();

    // Avoid creating multiple reCAPTCHAs
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response) => {
            // CAPTCHA solved - will proceed with sendOTP
          }
        },
        auth
      );
    }

    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        phone,
        window.recaptchaVerifier
      );
      setConfirmationResult(confirmation);
      alert('OTP sent successfully!');
    } catch (error) {
      console.error('OTP Error:', error.message);
      alert('Failed to send OTP. Check the number or try again.');
    }
  };

  return (
    <div>
      <h2>Login with Phone</h2>
      <input
        type="tel"
        placeholder="+91XXXXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={sendOTP}>Send OTP</button>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneLogin;
