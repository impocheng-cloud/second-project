// Form handling script
const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const successMessage = document.createElement('div');
successMessage.style.marginTop = '20px;';

form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Basic validation
    if (!nameInput.value.trim()) {
        alert('請輸入姓名');
        return;
    }
    if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
        alert('請輸入有效的Gmail');
        return;
    }
    if (!phoneInput.value.trim()) {
        alert('請輸入電話號碼');
        return;
    }

    // Display success message
    successMessage.textContent = '訊息已送出！我們會尽快與您聯繫。';
    document.body.appendChild(successMessage);

    // 清空表單 (optional)
    form.reset();
});

// Email validation function
function validateEmail(email) {
    const re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return re.test(email);
}

// Profile photo enlargement functionality
const profilePhoto = document.getElementById('profilePhoto');
const photoOverlay = document.querySelector('.photo-overlay');

profilePhoto.addEventListener('click', function() {
    // Toggle enlarged class
    this.classList.toggle('enlarged');
    photoOverlay.classList.toggle('show');
});