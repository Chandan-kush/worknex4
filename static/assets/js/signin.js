// ==================== State Management ====================
const state = {
    currentForm: 'signin',
    // generatedOTP: null,
    // signupOTP: null,
    // otpSent: false,
    // signupOtpSent: false,
};

// ==================== DOM Elements ====================
const toggleBtns = document.querySelectorAll('.toggle-btn');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const signinMobileInput = document.getElementById('signin-mobile');
const signinOtpInput = document.getElementById('signin-otp');
const sendOtpBtn = document.getElementById('send-otp-btn');
const verifyLoginBtn = document.getElementById('verify-login-btn');
const otpFieldContainer = document.getElementById('otp-field-container');
const signupRoleSelect = document.getElementById('signup-role');
const userFields = document.getElementById('user-fields');
const workerFields = document.getElementById('worker-fields');
const adminFields = document.getElementById('admin-fields');
const signupOtpContainer = document.getElementById('signup-otp-container');
const signupSendOtpBtn = document.getElementById('signup-send-otp-btn');
const successMessage = document.getElementById('success-message');

// ==================== Toggle Form Functionality ====================
toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const formType = btn.getAttribute('data-form');
        switchForm(formType);
    });
});

function switchForm(formType) {
    state.currentForm = formType;

    // Update toggle buttons
    toggleBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-form') === formType) {
            btn.classList.add('active');
        }
    });

    // Update forms
    if (formType === 'signin') {
        signinForm.classList.add('active');
        signupForm.classList.remove('active');
        clearForm(signinForm);
        state.otpSent = false;
        updateSignInUI();
    } else {
        signupForm.classList.add('active');
        signinForm.classList.remove('active');
        clearForm(signupForm);
        state.signupOtpSent = false;
        updateSignUpUI();
    }

    hideSuccessMessage();
}

// ==================== Sign In Functionality ====================
// function updateSignInUI() {
//     if (state.otpSent) {
//         otpFieldContainer.style.display = 'block';
//         verifyLoginBtn.style.display = 'block';
//         sendOtpBtn.textContent = 'Resend OTP';
//     } else {
//         otpFieldContainer.style.display = 'none';
//         verifyLoginBtn.style.display = 'none';
//         sendOtpBtn.textContent = 'Send OTP';
//     }
// }

// sendOtpBtn.addEventListener('click', (e) => {
//     e.preventDefault();
//     clearErrorMessage('signin-mobile-error');

//     const mobile = signinMobileInput.value.trim();

//     if (!validateMobile(mobile)) {
//         showErrorMessage('signin-mobile-error', 'Enter a valid 10-digit mobile number');
//         return;
//     }

//     // Generate OTP
//     state.generatedOTP = generateOTP();
//     state.otpSent = true;

//     console.log(`Generated OTP for ${mobile}: ${state.generatedOTP}`);
//     showSuccessMessage(`OTP sent to ${mobile}! (Check console for demo OTP: ${state.generatedOTP})`);

//     signinMobileInput.disabled = true;
//     updateSignInUI();
// });

// signinForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     clearErrorMessage('signin-otp-error');

//     if (!state.otpSent) {
//         showErrorMessage('signin-mobile-error', 'Please send OTP first');
//         return;
//     }

//     const otp = signinOtpInput.value.trim();

//     if (!otp) {
//         showErrorMessage('signin-otp-error', 'Enter the OTP');
//         return;
//     }

//     if (otp !== state.generatedOTP) {
//         showErrorMessage('signin-otp-error', 'Invalid OTP. Try again!');
//         return;
//     }

//     const mobile = signinMobileInput.value.trim();
//     showSuccessMessage(`✓ Login successful! Welcome back, ${mobile}`);

//     setTimeout(() => {
//         resetSignInForm();
//     }, 2000);
// });

// function resetSignInForm() {
//     signinForm.reset();
//     signinMobileInput.disabled = false;
//     state.otpSent = false;
//     state.generatedOTP = null;
//     updateSignInUI();
//     hideSuccessMessage();
// }

// ==================== Sign Up Functionality ====================
signupRoleSelect.addEventListener('change', () => {
    const role = signupRoleSelect.value;
    updateSignUpFields(role);
});

function updateSignUpUI() {
    const role = signupRoleSelect.value;
    updateSignUpFields(role);
}
function updateSignUpFields(role) {
    if (userFields) userFields.style.display = 'none';
    if (workerFields) workerFields.style.display = 'none';
    if (adminFields) adminFields.style.display = 'none';
    if (signupOtpContainer) signupOtpContainer.style.display = 'none';
    if (signupSendOtpBtn) signupSendOtpBtn.style.display = 'none';

    clearErrorMessages(signupForm);

    switch (role) {
        case 'user':
            if (userFields) userFields.style.display = 'block';
            if (signupOtpContainer) signupOtpContainer.style.display = 'block';
            if (signupSendOtpBtn) signupSendOtpBtn.style.display = 'block';
            break;
        case 'worker':
            if (workerFields) workerFields.style.display = 'block';
            break;
        case 'admin':
            if (adminFields) adminFields.style.display = 'block';
            break;
    }
}


// signupSendOtpBtn.addEventListener('click', (e) => {
//     e.preventDefault();
//     clearErrorMessage('signup-mobile-error');

//     const name = document.getElementById('signup-name').value.trim();
//     const mobile = document.getElementById('signup-mobile').value.trim();

//     if (!name) {
//         showErrorMessage('signup-name-error', 'Full name is required');
//         return;
//     }

//     if (!validateMobile(mobile)) {
//         showErrorMessage('signup-mobile-error', 'Enter a valid 10-digit mobile number');
//         return;
//     }

//     // Generate OTP
//     state.signupOTP = generateOTP();
//     state.signupOtpSent = true;

//     console.log(`Generated OTP for ${mobile}: ${state.signupOTP}`);
//     showSuccessMessage(`OTP sent to ${mobile}! (Check console for demo OTP: ${state.signupOTP})`);

//     signupSendOtpBtn.textContent = 'Resend OTP';
// });

// signupForm.addEventListener('submit', (e) => {
//     // e.preventDefault();
    
//     clearErrorMessages(signupForm);

//     const role = signupRoleSelect.value;

//     // Validate common fields
//     const name = document.getElementById('signup-name').value.trim();
//     const mobile = document.getElementById('signup-mobile').value.trim();
//     const email = document.getElementById('signup-email').value.trim();

//     if (!name) {
//         showErrorMessage('signup-name-error', 'Full name is required');
//         e.preventDefault();
//         return;
//     }

//     if (!validateMobile(mobile)) {
//         showErrorMessage('signup-mobile-error', 'Enter a valid 10-digit mobile number');
//         e.preventDefault();
//         return;
//     }

//     if (!validateEmail(email)) {
//         showErrorMessage('signup-email-error', 'Enter a valid email address');
//         e.preventDefault();
//         return;
//     }

//     if (!role) {
//         showErrorMessage('signup-role-error', 'Please select a role');
//         e.preventDefault();
//         return;
//     }

//     // Validate role-specific fields
//     if (role === 'user') {
//         if (!state.signupOtpSent) {
//             showErrorMessage('signup-otp-error', 'Please send OTP first');
//             e.preventDefault();
//             return;
//         }

//         const otp = document.getElementById('signup-otp').value.trim();
//         if (!otp) {
//             showErrorMessage('signup-otp-error', 'Enter the OTP');
//             e.preventDefault();
//             return;
//         }

//         if (otp !== state.signupOTP) {
//             showErrorMessage('signup-otp-error', 'Invalid OTP. Try again!');
//             e.preventDefault();
//             return;
//         }

//         // showSuccessMessage(`✓ Sign up successful! Welcome, ${name}`);
//     } else if (role === 'worker') {
//         const experience = document.getElementById('worker-experience').value;
//         const service = document.getElementById('worker-service').value;
//         const location = document.getElementById('worker-location').value.trim();
//         const address = document.getElementById('worker-address').value.trim();
//         const photo = document.getElementById('worker-photo').files.length;
//         const idProof = document.getElementById('worker-id').files.length;

//         if (!experience || experience < 0) {
//             showErrorMessage('worker-experience-error', 'Enter valid experience');
//             e.preventDefault();
//             return;
//         }

//         if (!service) {
//             showErrorMessage('worker-service-error', 'Select a service type');
//             e.preventDefault();
//             return;
//         }

//         if (!location) {
//             showErrorMessage('worker-location-error', 'Enter your location');
//             e.preventDefault();
//             return;
//         }

//         if (!address) {
//             showErrorMessage('worker-address-error', 'Enter your full address');
//             e.preventDefault();
//             return;
//         }

//         if (!photo) {
//             showErrorMessage('worker-photo-error', 'Upload your photo');
//             e.preventDefault();
//             return;
//         }

//         if (!idProof) {
//             showErrorMessage('worker-id-error', 'Upload your ID proof');
//             e.preventDefault();
//             return;
//         }

//         // showSuccessMessage(`✓ Worker registration successful! Welcome, ${name}`);
//     } else if (role === 'admin') {
//         const secretKey = document.getElementById('admin-secret').value;
//         const correctKey = 'WORKNEXADMIN123';

//         if (!secretKey) {
//             showErrorMessage('admin-secret-error', 'Enter admin secret key');
//             e.preventDefault();
//             return;
//         }

//         if (secretKey !== correctKey) {
//             showErrorMessage('admin-secret-error', 'Invalid admin secret key');
//             e.preventDefault();
//             return;
//         }

//         // showSuccessMessage(`✓ Admin access granted! Welcome, ${name}`);
//     }

//     // setTimeout(() => {
//     //     resetSignUpForm();
//     // }, 2000);
// });

function resetSignUpForm() {
    signupForm.reset();
    signupRoleSelect.value = '';
    // state.signupOtpSent = false;
    // state.signupOTP = null;
    updateSignUpFields('');
    hideSuccessMessage();
}

// ==================== Validation Functions ====================
function validateMobile(mobile) {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// function generateOTP() {
//     return Math.floor(1000 + Math.random() * 9000).toString();
// }

// ==================== Error Message Management ====================
function showErrorMessage(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearErrorMessage(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function clearErrorMessages(form) {
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}

function clearForm(form) {
    form.reset();
    clearErrorMessages(form);
}

// ==================== Success Message Management ====================
function showSuccessMessage(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
}

function hideSuccessMessage() {
    successMessage.style.display = 'none';
    successMessage.textContent = '';
}

// ==================== Input Event Listeners ====================
// Clear error on input
signinMobileInput.addEventListener('input', () => {
    clearErrorMessage('signin-mobile-error');
    // Only allow numbers
    signinMobileInput.value = signinMobileInput.value.replace(/[^0-9]/g, '');
});

// signinOtpInput.addEventListener('input', () => {
//     clearErrorMessage('signin-otp-error');
//     // Only allow numbers
//     signinOtpInput.value = signinOtpInput.value.replace(/[^0-9]/g, '');
// });

document.getElementById('signup-name').addEventListener('input', () => {
    clearErrorMessage('signup-name-error');
});

document.getElementById('signup-mobile').addEventListener('input', (e) => {
    clearErrorMessage('signup-mobile-error');
    // Only allow numbers
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

document.getElementById('signup-email').addEventListener('input', () => {
    clearErrorMessage('signup-email-error');
});

// document.getElementById('signup-otp').addEventListener('input', (e) => {
//     clearErrorMessage('signup-otp-error');
//     // Only allow numbers
//     e.target.value = e.target.value.replace(/[^0-9]/g, '');
// });

document.getElementById('worker-experience').addEventListener('input', () => {
    clearErrorMessage('worker-experience-error');
});

document.getElementById('worker-service').addEventListener('change', () => {
    clearErrorMessage('worker-service-error');
});

document.getElementById('worker-location').addEventListener('input', () => {
    clearErrorMessage('worker-location-error');
});

document.getElementById('worker-address').addEventListener('input', () => {
    clearErrorMessage('worker-address-error');
});

document.getElementById('worker-photo').addEventListener('change', () => {
    clearErrorMessage('worker-photo-error');
});

document.getElementById('worker-id').addEventListener('change', () => {
    clearErrorMessage('worker-id-error');
});

document.getElementById('admin-secret').addEventListener('input', () => {
    clearErrorMessage('admin-secret-error');
});

// ==================== Initialization ====================
window.addEventListener('DOMContentLoaded', () => {
    console.log('Worknex Sign In / Sign Up Page Loaded');
});
