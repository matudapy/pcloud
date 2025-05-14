// DOM Elements - Auth
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const resetForm = document.getElementById('reset-form');
const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const forgotPasswordButton = document.getElementById('forgot-password');
const resetButton = document.getElementById('reset-button');
const backToLoginButton = document.getElementById('back-to-login');
const logoutButton = document.getElementById('logout-button');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const signupConfirmPassword = document.getElementById('signup-confirm-password');
const resetEmail = document.getElementById('reset-email');
const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');
const resetMessage = document.getElementById('reset-message');

// Event Listeners - Auth
document.addEventListener('DOMContentLoaded', initAuth);
loginTab.addEventListener('click', showLoginForm);
signupTab.addEventListener('click', showSignupForm);
loginButton.addEventListener('click', handleLogin);
signupButton.addEventListener('click', handleSignup);
forgotPasswordButton.addEventListener('click', showResetForm);
resetButton.addEventListener('click', handleResetPassword);
backToLoginButton.addEventListener('click', showLoginForm);
logoutButton.addEventListener('click', handleLogout);

/**
 * Initialize authentication UI
 */
function initAuth() {
  console.log('Auth UI initialized');
  
  // Set initial state
  showLoginForm();
  
  // Add enter key event listeners
  loginEmail.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      loginPassword.focus();
    }
  });
  
  loginPassword.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      handleLogin();
    }
  });
  
  signupEmail.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      signupPassword.focus();
    }
  });
  
  signupPassword.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      signupConfirmPassword.focus();
    }
  });
  
  signupConfirmPassword.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      handleSignup();
    }
  });
  
  resetEmail.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      handleResetPassword();
    }
  });
}

/**
 * Show login form
 */
function showLoginForm() {
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
  loginForm.style.display = 'block';
  signupForm.style.display = 'none';
  resetForm.style.display = 'none';
  clearErrors();
}

/**
 * Show signup form
 */
function showSignupForm() {
  loginTab.classList.remove('active');
  signupTab.classList.add('active');
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
  resetForm.style.display = 'none';
  clearErrors();
}

/**
 * Show password reset form
 */
function showResetForm() {
  loginForm.style.display = 'none';
  signupForm.style.display = 'none';
  resetForm.style.display = 'block';
  clearErrors();
}

/**
 * Clear all error messages
 */
function clearErrors() {
  loginError.textContent = '';
  signupError.textContent = '';
  resetMessage.textContent = '';
  resetMessage.classList.remove('success');
}

/**
 * Handle login form submission
 */
function handleLogin() {
  const email = loginEmail.value.trim();
  const password = loginPassword.value;
  
  // Validate inputs
  if (!email || !password) {
    loginError.textContent = 'メールアドレスとパスワードを入力してください。';
    return;
  }
  
  // Disable button and show loading state
  loginButton.disabled = true;
  loginButton.textContent = 'ログイン中...';
  loginError.textContent = '';
  
  // Sign in with Firebase
  window.firebaseAuth.signIn(email, password)
    .catch((error) => {
      // Handle errors
      let errorMessage;
      
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'メールアドレスまたはパスワードが正しくありません。';
          break;
        case 'auth/invalid-email':
          errorMessage = '有効なメールアドレスを入力してください。';
          break;
        case 'auth/user-disabled':
          errorMessage = 'このアカウントは無効になっています。';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'ログイン試行回数が多すぎます。しばらく待ってから再試行してください。';
          break;
        default:
          errorMessage = `エラーが発生しました: ${error.message}`;
      }
      
      loginError.textContent = errorMessage;
    })
    .finally(() => {
      // Reset button state
      loginButton.disabled = false;
      loginButton.textContent = 'ログイン';
    });
}

/**
 * Handle signup form submission
 */
function handleSignup() {
  const email = signupEmail.value.trim();
  const password = signupPassword.value;
  const confirmPassword = signupConfirmPassword.value;
  
  // Validate inputs
  if (!email || !password || !confirmPassword) {
    signupError.textContent = 'すべての項目を入力してください。';
    return;
  }
  
  if (password !== confirmPassword) {
    signupError.textContent = 'パスワードが一致しません。';
    return;
  }
  
  if (password.length < 6) {
    signupError.textContent = 'パスワードは6文字以上である必要があります。';
    return;
  }
  
  // Disable button and show loading state
  signupButton.disabled = true;
  signupButton.textContent = '登録中...';
  signupError.textContent = '';
  
  // Sign up with Firebase
  window.firebaseAuth.signUp(email, password)
    .catch((error) => {
      // Handle errors
      let errorMessage;
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'このメールアドレスは既に使用されています。';
          break;
        case 'auth/invalid-email':
          errorMessage = '有効なメールアドレスを入力してください。';
          break;
        case 'auth/weak-password':
          errorMessage = 'パスワードが弱すぎます。より強力なパスワードを使用してください。';
          break;
        default:
          errorMessage = `エラーが発生しました: ${error.message}`;
      }
      
      signupError.textContent = errorMessage;
    })
    .finally(() => {
      // Reset button state
      signupButton.disabled = false;
      signupButton.textContent = '登録';
    });
}

/**
 * Handle password reset
 */
function handleResetPassword() {
  const email = resetEmail.value.trim();
  
  // Validate input
  if (!email) {
    resetMessage.textContent = 'メールアドレスを入力してください。';
    resetMessage.classList.remove('success');
    return;
  }
  
  // Disable button and show loading state
  resetButton.disabled = true;
  resetButton.textContent = '送信中...';
  resetMessage.textContent = '';
  resetMessage.classList.remove('success');
  
  // Send password reset email
  window.firebaseAuth.resetPassword(email)
    .then(() => {
      resetMessage.textContent = 'パスワードリセットのメールを送信しました。メールをご確認ください。';
      resetMessage.classList.add('success');
      resetEmail.value = '';
    })
    .catch((error) => {
      // Handle errors
      let errorMessage;
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = '有効なメールアドレスを入力してください。';
          break;
        case 'auth/user-not-found':
          errorMessage = 'このメールアドレスに関連するアカウントが見つかりません。';
          break;
        default:
          errorMessage = `エラーが発生しました: ${error.message}`;
      }
      
      resetMessage.textContent = errorMessage;
      resetMessage.classList.remove('success');
    })
    .finally(() => {
      // Reset button state
      resetButton.disabled = false;
      resetButton.textContent = 'パスワードリセット';
    });
}

/**
 * Handle logout
 */
function handleLogout() {
  // Disable button and show loading state
  logoutButton.disabled = true;
  
  // Sign out with Firebase
  window.firebaseAuth.signOut()
    .catch((error) => {
      console.error('Logout error:', error);
      alert('ログアウト中にエラーが発生しました。');
    })
    .finally(() => {
      // Reset button state
      logoutButton.disabled = false;
    });
}
