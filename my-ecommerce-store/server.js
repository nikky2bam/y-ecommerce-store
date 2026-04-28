const http = require('http');
const fs = require('fs');

const products = [
    { id: 1, name: "Laptop", price: 999.99 },
    { id: 2, name: "Mouse", price: 29.99 },
    { id: 3, name: "Keyboard", price: 79.99 },
    { id: 4, name: "Monitor", price: 299.99 },
    { id: 5, name: "Headphones", price: 59.99 },
    { id: 6, name: "USB Cable", price: 9.99 }
];

let cart = [];

const server = http.createServer((req, res) => {
    // Serve images
    if (req.url.startsWith('/images/')) {
        const imagePath = '.' + req.url;
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                res.end(data);
            }
        });
        return;
    }
    
    // Add to cart
    if (req.url.includes('/add')) {
        const id = parseInt(req.url.split('=')[1]);
        const product = products.find(p => p.id === id);
        if (product) {
            cart.push(product);
        }
        res.writeHead(302, { 'Location': '/' });
        res.end();
        return;
    }
    
    // Remove from cart
    if (req.url.includes('/remove')) {
        const id = parseInt(req.url.split('=')[1]);
        const index = cart.findIndex(item => item.id === id);
        if (index !== -1) {
            cart.splice(index, 1);
        }
        res.writeHead(302, { 'Location': '/cart' });
        res.end();
        return;
    }
    
    // Checkout page
    if (req.url === '/checkout') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        
        let total = 0;
        for (let i = 0; i < cart.length; i++) {
            total = total + cart[i].price;
        }
        
        res.write(`
<!DOCTYPE html>
<html>
<head>
    <title>Checkout</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; padding: 30px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        h1 { color: #667eea; }
        button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; cursor: pointer; border: none; border-radius: 25px; font-size: 16px; margin-top: 20px; }
        a { display: inline-block; margin-top: 20px; background: #ccc; color: #333; padding: 10px 20px; text-decoration: none; border-radius: 25px; }
        .total { font-size: 28px; font-weight: bold; color: #667eea; margin: 20px 0; }
        input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 10px; box-sizing: border-box; }
    </style>
</head>
<body>
<div class="container">
    <h1>💳 Checkout</h1>
    <p><strong>Order Summary:</strong></p>
`);
        
        for (let i = 0; i < cart.length; i++) {
            res.write(`
                <p>${cart[i].name} - $${cart[i].price}</p>
            `);
        }
        
        res.write(`
            <div class="total">Total: $${total}</div>
            <form action="/complete" method="get">
                <input type="text" placeholder="Full Name" required>
                <input type="email" placeholder="Email" required>
                <input type="text" placeholder="Address" required>
                <button type="submit">Complete Purchase</button>
            </form>
            <br>
            <a href="/cart">← Back to Cart</a>
</div>
</body>
</html>
`);
        res.end();
        return;
    }
    
    // Complete purchase
    if (req.url === '/complete') {
        cart = [];
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`
<!DOCTYPE html>
<html>
<head>
    <title>Order Complete</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; margin: 0; }
        .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 20px; padding: 40px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        h1 { color: #4CAF50; font-size: 48px; }
        a { display: inline-block; margin-top: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; }
    </style>
</head>
<body>
<div class="container">
    <h1>✅ Order Complete!</h1>
    <p>Thank you for your purchase!</p>
    <a href="/">Continue Shopping</a>
</div>
</body>
</html>
`);
        res.end();
        return;
    }
    
    // Cart page
    if (req.url === '/cart') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        
        let total = 0;
        for (let i = 0; i < cart.length; i++) {
            total = total + cart[i].price;
        }
        
        res.write(`
<!DOCTYPE html>
<html>
<head>
    <title>My Cart</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; margin: 0; }
        .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 20px; padding: 30px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        h1 { color: #667eea; }
        .cart-item { border-bottom: 1px solid #ccc; padding: 15px; margin: 5px; }
        button { background: red; color: white; padding: 5px 15px; cursor: pointer; border: none; border-radius: 20px; }
        a { display: inline-block; margin-top: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 20px; text-decoration: none; border-radius: 25px; }
        .total { font-size: 24px; font-weight: bold; margin-top: 20px; color: #667eea; }
        .checkout-btn { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); }
    </style>
</head>
<body>
<div class="container">
    <h1>🛒 Your Shopping Cart</h1>
`);
        
        if (cart.length === 0) {
            res.write(`<p>Cart is empty!</p>`);
        } else {
            for (let i = 0; i < cart.length; i++) {
                res.write(`
                    <div class="cart-item">
                        ${cart[i].name} - $${cart[i].price}
                        <a href="/remove?id=${cart[i].id}">
                            <button>Remove</button>
                        </a>
                    </div>
                `);
            }
            res.write(`
                <div class="total">
                    Total: $${total}
                </div>
            `);
        }
        
        res.write(`
    <a href="/checkout" class="checkout-btn" style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);">Proceed to Checkout</a>
    <a href="/">Continue Shopping</a>
</div>
</body>
</html>
`);
        res.end();
        return;
    }
    
    // Main page (products)
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`
<!DOCTYPE html>
<html>
<head>
    <title>My Web Store</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 20px; padding: 30px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        h1 { color: #667eea; font-size: 48px; margin-bottom: 10px; }
        .product { border: 1px solid #e0e0e0; border-radius: 15px; margin: 15px; padding: 20px; width: 250px; display: inline-block; vertical-align: top; transition: transform 0.3s; background: white; text-align: center; }
        .product:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
        .product img { width: 150px; height: 150px; border-radius: 15px; margin-bottom: 10px; object-fit: cover; }
        .product h3 { color: #333; margin: 10px 0; }
        .product p { color: #667eea; font-size: 24px; font-weight: bold; margin: 10px 0; }
        button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 20px; cursor: pointer; border: none; border-radius: 25px; font-size: 14px; }
        button:hover { opacity: 0.8; }
        .cart-link { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 12px 24px; text-decoration: none; display: inline-block; margin-bottom: 20px; border-radius: 30px; font-weight: bold; }
        .cart-link:hover { transform: scale(1.05); }
        h2 { color: #555; }
    </style>
</head>
<body>
<div class="container">
    <h1>🛒 My Web Store</h1>
    <a href="/cart" class="cart-link">View Cart (${cart.length} items)</a>
    <h2>Products</h2>
`);
    
    for (let i = 0; i < products.length; i++) {
        const productName = products[i].name.toLowerCase();
        res.write(`
            <div class="product">
                <img src="/images/${productName}.jpg" alt="${products[i].name}">
                <h3>${products[i].name}</h3>
                <p>$${products[i].price}</p>
                <a href="/add?id=${products[i].id}">
                    <button>Add to Cart</button>
                </a>
            </div>
        `);
    }
    
    res.write(`
</div>
</body>
</html>
`);
    res.end();
});

server.listen(3000, () => {
    console.log('✅ Server running at http://localhost:3000');
});