const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/product-listing',
                {
                    prods: products,
                    docTitle: 'All Products',
                    path: '/products',

                });
        })
        .catch(err => {
            console.log(err);
        });
    //Code for SQL query execution methodology
    /*     Product.fetchAll()
            .then(([rows, fieldData]) => {
                res.render('shop/product-listing',
                    {
                        prods: rows,
                        docTitle: 'All Products',
                        path: '/products',
    
                    });
            })
            .catch(err => {
                console.log(err);
            }); */
    //Used while working with a file in the file system      
    //console.log(adminData.products);
    //res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    //const products = adminData.products;
    /*     const products = Product.fetchAll(products => {
            res.render('shop/product-listing',
                {
                    prods: products,
                    docTitle: 'All Products',
                    path: '/products',
                    //Handlebars code
                    //hasProducts: products.length > 0,
                    //activeShop: true,
                    //productCSS: true
                });
        }); */
};


exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        // Alternative
        //Product.findAll({where: {id: prodId}})
        //.then(products => {
        //    res.render('shop/product-details',
        //        {
        //            product: product[0],
        //            docTitle: 'Product Details',
        //            path: '/products'
        //        }        
        //})
        //.catch();
        .then((product) =>
            res.render('shop/product-details',
                {
                    product: product,
                    docTitle: product.title,
                    path: '/products'
                }
            ))
        .catch(err => {
            console.log(err);
        });
};

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index',
                {
                    prods: products,
                    docTitle: 'Shop',
                    path: '/',
                });
        })
        .catch(err => {
            console.log(err);
        });

    /*     Product.fetchAll()
            .then(([rows, fieldData]) => {
                res.render('shop/index',
                    {
                        prods: rows,
                        docTitle: 'Shop',
                        path: '/',
                    });
            })
            .catch(err => {
                console.log(err);
            }); */
    //Used while working with a file in the file system    
    /*     const products = Product.fetchAll(products => {
            res.render('shop/index',
                {
                    prods: products,
                    docTitle: 'Shop',
                    path: '/',
                    //Handlebars code
                    //hasProducts: products.length > 0,
                    //activeShop: true,
                    //productCSS: true
                });
        }); */
};

exports.getCart = (req, res, next) => {
    /*     Cart.getCart(cart => {
            const cartProducts = [];
            Product.fetchAll(products => {
                for (product of products) {
                    const cartProductData = cart.products.find(prod => prod.id === product.id);
                    if (cartProductData) {
                        cartProducts.push({ productData: product, qty: cartProductData.qty });
                    }
                }
                res.render('shop/cart', {
                    path: '/cart',
                    docTitle: 'Your Cart',
                    products: cartProducts
                });
    
            });
        }); */
    //Alternative way using sequalize
    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        path: '/cart',
                        docTitle: 'Your Cart',
                        products: products
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        });

};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    /*     Product.findById(prodId, (product) => {
            Cart.addProduct(prodId, product.price);
        });
        res.redirect('/cart'); */

    //Alternative way using sequalize
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } })
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(prodId)
        })
        .then(product => {
            return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    /*     Product.findById(prodId, product => {
            Cart.deleteProduct(prodId);
        })
        res.redirect('/cart'); */
    //Alternative way using sequalize
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getOrders = (req, res, next) => {
    /*     const products = Product.fetchAll(products => {
            res.render('shop/cart',
                {
                    prods: products,
                    docTitle: 'Your Cart',
                    path: '/cart',
                });
        }); */

    req.user.getOrders({include: ['products']})
        .then(orders => {
            res.render('shop/orders',
                {
                    orders: orders,
                    docTitle: 'Your Order',
                    path: '/orders',
                });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            cart.getProducts()
                .then(products => {
                    return req.user.createOrder()
                        .then(order => {
                            return order.addProducts(products.map(product => {
                                product.orderItem = {
                                    quantity: product.cartItem.quantity
                                };
                                return product;
                            }));
                        })
                        .then(result => {
                            return fetchedCart.setProducts(null);
                        })
                        .then(() => {
                            res.redirect('/orders');
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        })
};

exports.getCheckout = (req, res, next) => {
    const products = Product.fetchAll(products => {
        res.render('shop/checkout',
            {
                prods: products,
                docTitle: 'Checkout',
                path: '/checkout',
            });
    });
};



