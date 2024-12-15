import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQI990BUhP2jFta1BrSyybJSf1Znmcetg",
  authDomain: "login-5ead9.firebaseapp.com",
  projectId: "login-5ead9",
  storageBucket: "login-5ead9.appspot.com",
  messagingSenderId: "278340389022",
  appId: "1:278340389022:web:03e092b5ff26e9560d138f",
  measurementId: "G-3655B6TND2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Form Submission
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("error-message");
const forgotPasswordLink = document.getElementById("forgot-password");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    document.getElementById('submit').addEventListener('click', () => {
      window.location.href = '../admin.html';
  });
    console.log("User logged in:", userCredential.user);
  } catch (error) {
    let errorMessageText;
    switch (error.code) {
        case "auth/invalid-credential":
            errorMessageText = "Invalid Email or Password. Please try again.";
            break;
        case "auth/too-many-requests":
            errorMessageText = "Too many attempts. Please wait and try again later.";
            break;
        default:
            errorMessageText = "An error occurred. Please try again.";
    }
    errorMessage.textContent = errorMessageText;
  }
});

forgotPasswordLink.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  if (!email) {
    errorMessage.textContent = "Please enter your email to reset the password.";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    errorMessage.textContent = "Password reset email sent. Check your inbox 🎉";
    errorMessage.style.color = "green";
  } catch (error) {
    errorMessage.textContent = "Failed to send password reset email. Please try again.";
    errorMessage.style.color = "red";
  }
});
