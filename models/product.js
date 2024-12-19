const Sequalize = require('sequelize');
const sequelize = require('../util/database');

const Product = sequelize.define('product', {
    id: {
        type: Sequalize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: Sequalize.STRING,
    price: {
        type: Sequalize.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: Sequalize.STRING,
        allowNull: false
    },
    description: {
        type: Sequalize.STRING,
        allowNull: false
    }
});

module.exports = Product;




//  *************** Below part of the code is used for 
// file system access or running sql statements to access data
/* //Used while working with a file in the file system
//const fs = require('fs');
//const path = require('path');

const db = require('../util/database');
const Cart = require('./cart')

//Used while working with a file in the file system

//const p = path.join(
//    path.dirname(process.mainModule.filename),
//    'data',
//    'products.json'
//);

/* const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
}; */

/* module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        return db.execute('INSERT INTO products(title, price, imageUrl, description) VALUES(?, ?, ?, ?)',
            [this.title, this.price, this.imageUrl, this.description]
        );
    }

    static fetchAll() {
        return db.execute('select * from products');
    }

    static findById(id) {
        return db.execute('select * from products where products.id = ?', [id]);
    }

    static deleteById(id) {

    } */
    //Used while working with a file in the file system
    /*     save() {
            getProductsFromFile(products => {
                if (this.id) {
                    const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                    const updatedProducts = [...products];
                    updatedProducts[existingProductIndex] = this;
                    fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                        console.log(err);
                    });
                }
                else {
                    this.id = Math.random().toString();
                    products.push(this);
                    fs.writeFile(p, JSON.stringify(products), err => {
                        console.log(err);
                    });
                }
    
            });
        }
    
        static deleteById(id, cb){
            getProductsFromFile(products => {
                const product = products.find(prod => prod.id === id);
                const updatedProducts = products.filter(prod => prod.id != id);
                console.log(updatedProducts);
                fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                    if(!err){
                        Cart.deleteProduct(id, product.price);
                    }
    
                });
            });        
        }
    
        static fetchAll(cb) {
            getProductsFromFile(cb);
        }
    
        static findById(id, cb) {
            getProductsFromFile(products => {
                const product = products.find(p => p.id === id);
                cb(product);
            });
        } */
//};
 