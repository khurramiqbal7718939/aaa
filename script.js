document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cart-items')) {
        updateCart();
    }

    if (document.getElementById('order-summary')) {
        populateOrderSummary();
    }

    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const nameOnCard = document.getElementById('name-on-card').value;
            const cardNumber = document.getElementById('card-number').value;
            const expiryDate = document.getElementById('expiry-date').value;
            const cvv = document.getElementById('cvv').value;
            const houseAddress = document.getElementById('house-address').value;

            if (!/^\d{16}$/.test(cardNumber)) {
                alert('Card number must be 16 digits.');
                return;
            }

            if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
                alert('Expiry date must be in MM/YY format.');
                return;
            }

            if (!/^\d{3}$/.test(cvv)) {
                alert('CVV must be 3 digits.');
                return;
            }

            if (nameOnCard && cardNumber && expiryDate && cvv && houseAddress) {
                localStorage.removeItem('cart');
                window.location.href = 'confirmation.html';
            } else {
                alert('Please fill out all fields');
            }
        });
    }
});

function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(name + " added to cart");
    updateCart();
}

function updateCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');

    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        cartItems.innerHTML += `<div>${item.name} x ${item.quantity} = $${item.price * item.quantity} <button onclick="removeFromCart(${index})">X</button></div>`;
    });

    totalPrice.innerText = `Total: $${total}`;
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function populateOrderSummary() {
    const orderSummary = document.getElementById('order-summary');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            total += item.price * item.quantity;
            orderSummary.innerHTML += `<p>${item.name} x ${item.quantity} = $${item.price * item.quantity}</p>`;
        });
        orderSummary.innerHTML += `<p>Total: $${total}</p>`;
    } else {
        orderSummary.innerHTML = '<p>No items in cart</p>';
    }
}

function proceedToPayment() {
    window.location.href = 'payment.html';
}
