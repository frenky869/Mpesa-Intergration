// script.js
document.addEventListener('DOMContentLoaded', function() {
    const mpesaForm = document.getElementById('mpesaForm');
    const phoneInput = document.getElementById('phoneNumber');
    const payButton = document.getElementById('payButton');
    const statusModal = document.getElementById('statusModal');
    const statusMessage = document.getElementById('statusMessage');
    const closeModal = document.querySelector('.close');

    // Format phone number input
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            value = value.match(/.{1,3}/g).join(' ');
        }
        
        e.target.value = value;
    });

    // Form submission
    mpesaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const phoneNumber = formatPhoneNumber(phoneInput.value);
        
        if (validatePhoneNumber(phoneNumber)) {
            processPayment(phoneNumber);
        } else {
            alert('Please enter a valid M-Pesa number (e.g., 712345678)');
        }
    });

    // Close modal
    closeModal.addEventListener('click', function() {
        statusModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === statusModal) {
            statusModal.style.display = 'none';
        }
    });

    function formatPhoneNumber(phone) {
        return '254' + phone.replace(/\s/g, '');
    }

    function validatePhoneNumber(phone) {
        const phoneRegex = /^254[17]\d{8}$/;
        return phoneRegex.test(phone);
    }

    function processPayment(phoneNumber) {
        // Disable pay button
        payButton.disabled = true;
        payButton.textContent = 'Processing...';

        // Show processing modal
        showProcessingModal();

        // Simulate API call to payment gateway
        simulatePaymentAPI(phoneNumber)
            .then(result => {
                showSuccessModal(result);
            })
            .catch(error => {
                showErrorModal(error);
            })
            .finally(() => {
                payButton.disabled = false;
                payButton.textContent = 'Pay with M-Pesa';
            });
    }

    function showProcessingModal() {
        statusMessage.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Waiting for M-Pesa prompt...</p>
            <p><small>Check your phone for STK push</small></p>
        `;
        statusModal.style.display = 'block';
    }

    function showSuccessModal(result) {
        statusMessage.innerHTML = `
            <div class="success">✓</div>
            <h3>Payment Successful!</h3>
            <p>Transaction ID: ${result.transactionId}</p>
            <p>Amount: KES ${result.amount}</p>
            <p><small>You will receive an SMS confirmation shortly</small></p>
        `;
    }

    function showErrorModal(error) {
        statusMessage.innerHTML = `
            <div class="error">✗</div>
            <h3>Payment Failed</h3>
            <p>${error.message}</p>
            <p><small>Please try again or use a different payment method</small></p>
        `;
    }

    function simulatePaymentAPI(phoneNumber) {
        return new Promise((resolve, reject) => {
            // Simulate API delay
            setTimeout(() => {
                // Simulate random success/failure (90% success rate)
                const isSuccess = Math.random() > 0.1;

                if (isSuccess) {
                    resolve({
                        success: true,
                        transactionId: 'MP' + Date.now(),
                        amount: '1,500.00',
                        phoneNumber: phoneNumber,
                        timestamp: new Date().toISOString()
                    });
                } else {
                    reject({
                        success: false,
                        message: 'Payment request was cancelled by user',
                        code: 'USER_CANCELLED'
                    });
                }
            }, 3000);
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            statusModal.style.display = 'none';
        }
    });
});
