// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get auth instance
const auth = firebase.auth();

// Authentication state observer
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    console.log('User is signed in:', user.email);
    showApp();
    hideAuth();
    updateUIForUser(user);
  } else {
    // User is signed out
    console.log('User is signed out');
    hideApp();
    showAuth();
    updateUIForSignedOut();
  }
});

// Sign up with email and password
function signUp(email, password) {
  return auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed up successfully
      const user = userCredential.user;
      console.log('User signed up:', user.email);
      return user;
    })
    .catch((error) => {
      // Handle errors
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Sign up error:', errorCode, errorMessage);
      throw error;
    });
}

// Sign in with email and password
function signIn(email, password) {
  return auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in successfully
      const user = userCredential.user;
      console.log('User signed in:', user.email);
      return user;
    })
    .catch((error) => {
      // Handle errors
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Sign in error:', errorCode, errorMessage);
      throw error;
    });
}

// Sign out
function signOut() {
  return auth.signOut()
    .then(() => {
      console.log('User signed out');
    })
    .catch((error) => {
      console.error('Sign out error:', error);
      throw error;
    });
}

// UI helper functions
function showApp() {
  document.getElementById('app-container').style.display = 'block';
}

function hideApp() {
  document.getElementById('app-container').style.display = 'none';
}

function showAuth() {
  document.getElementById('auth-container').style.display = 'block';
}

function hideAuth() {
  document.getElementById('auth-container').style.display = 'none';
}

function updateUIForUser(user) {
  const userEmail = document.getElementById('user-email');
  if (userEmail) {
    userEmail.textContent = user.email;
  }
}

function updateUIForSignedOut() {
  const userEmail = document.getElementById('user-email');
  if (userEmail) {
    userEmail.textContent = '';
  }
}

// Reset password
function resetPassword(email) {
  return auth.sendPasswordResetEmail(email)
    .then(() => {
      console.log('Password reset email sent');
    })
    .catch((error) => {
      console.error('Password reset error:', error);
      throw error;
    });
}

// Export auth functions
window.firebaseAuth = {
  signUp,
  signIn,
  signOut,
  resetPassword,
  getCurrentUser: () => auth.currentUser
};
