document.addEventListener('DOMContentLoaded', function() {
    const productList = document.getElementById('product-list');
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Fetch products from JSON file
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            displayProducts(products);
        });

    // Display products dynamically
    function displayProducts(products) {
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';

            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
            `;

            productList.appendChild(productDiv);
        });
    }

    // Add product to cart
    window.addToCart = function(id, name, price) {
        const product = { id, name, price, quantity: 1 };

        const existingProduct = cart.find(item => item.id === id);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    };

    // Display cart items
    function displayCart() {
        cartItems.innerHTML = '';
        let totalPrice = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';

            cartItem.innerHTML = `
                <p>${item.name}</p>
                <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
                <button onclick="removeFromCart(${item.id})">Remove</button>
            `;

            cartItems.appendChild(cartItem);
            totalPrice += item.price * item.quantity;
        });

        totalPriceElement.innerHTML = `Total: $${totalPrice.toFixed(2)}`;
    }

    // Update quantity
    window.updateQuantity = function(id, quantity) {
        const product = cart.find(item => item.id === id);
        if (product) {
            product.quantity = parseInt(quantity, 10);
            if (product.quantity <= 0) {
                cart = cart.filter(item => item.id !== id);
            }
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    };

    // Remove product from cart
    window.removeFromCart = function(id) {
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
    };

    // Initial cart display
    displayCart();
});
