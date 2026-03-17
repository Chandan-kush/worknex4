
        // Payment method selection
        const paymentOptions = document.querySelectorAll('input[name="payment_method"]');
        const cardDetails = document.getElementById('cardDetails');

        paymentOptions.forEach(option => {
            option.addEventListener('change', function() {
                // Update active class
                document.querySelectorAll('.payment-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                this.closest('.payment-option').classList.add('active');

                // Show/hide card details
                if (this.value === 'card') {
                    cardDetails.style.display = 'block';
                } else {
                    cardDetails.style.display = 'none';
                }
            });
        });

        // Apply discount code
        const applyBtn = document.querySelector('.discount-section button');
        applyBtn.addEventListener('click', function() {
            const discountInput = document.querySelector('.discount-section input');
            const code = discountInput.value.toUpperCase();
            
            if (code === 'SAVE20') {
                const discountRow = document.querySelector('.price-row.discount');
                discountRow.style.display = 'flex';
                alert('Discount code applied! You saved $24.99');
                discountInput.value = '';
            } else if (code === '') {
                alert('Please enter a discount code');
            } else {
                alert('Invalid discount code');
            }
        });

        // Format card number input
        const cardNumberInput = document.querySelector('input[placeholder="1234 5678 9012 3456"]');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\s/g, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
            });
        }
    