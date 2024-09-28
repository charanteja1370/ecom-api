import { ApplicationError } from "../../error-handler/applicationError.js";
import UserModel from "../user/user.model.js";
console.log(UserModel.getAll());
export default class ProductModel{
    constructor(name, desc, price, imageUrl, category, sizes, id){
        this._id = id;
        this.name = name;
        this.desc = desc;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
        this.sizes = sizes;
    }

    static getAll(){
        return products;
    }

    static add(product){
        product.id = products.length+1;
        products.push(product);
        return product;
    }

    static get(id){
        const product = products.find((p) => p.id == id);
        return product;
    }

    // static filterProducts(minPrice, maxPrice, category){
    //     const result = products.filter((product) => {
    //         product.price >= minPrice && 
    //         product.price <= maxPrice && 
    //         product.category == category
    //         // (!minPrice || product.minPrice >= minPrice) && (!maxPrice || product.maxPrice >= maxPrice) && (!category || product.category === category)
    //     })
    //     console.log(result);
        
    //     return result;
    // }

    static filterProducts(minPrice, maxPrice, category) {
        const result = products.filter((product) => {
          const priceCondition =
            (!minPrice || product.price >= parseFloat(minPrice)) &&
            (!maxPrice || product.price <= parseFloat(maxPrice));
    
          const categoryCondition = !category || product.category === category;
    
          return priceCondition && categoryCondition;
        });
        return result;
    }

    static rateProduct(userID, productID, rating){

        //1. Validate user and product
        // const user = UserModel.getAll().find(u => u.id === userID);
        // console.log(userID);
        console.log( "USER ID GETTING FROM CONTROLLER: ", userID);
        const user = UserModel.getAll().find((u) => u.id == userID);
        console.log("USER FOUND FROM USER MODEL", user);
        
        if(!user){
            // return 'User not found';
            // user-defined error.
            // throw new Error('User not found');
            throw new ApplicationError('User not found', 404);
        }

        //Validate Product
        const product = products.find(p => p.id == productID);
        if(!product){
            // return 'Product not found';
            // throw new Error('Product not found');
            throw new ApplicationError('Product not found', 400);
        }

        //2. Check if there are any ratings and if not then add ratings array.
        if(!product.ratings){
            product.ratings = [];
            product.ratings.push({userID: userID, rating: rating});
        }else{
            //3. check if user rating is already available.
            // const existingRatingIndex = products.ratings.findIndex(r => r.userID === userID);
            const existingRatingIndex = product.ratings.findIndex((r) => r.userID == userID);

            if(existingRatingIndex >= 0){
                product.ratings[existingRatingIndex] = {userID: userID, rating: rating};
            }else{
                // if no existing rating, then add new rating
                product.ratings.push({userID: userID, rating: rating});
            }
        }
    }
    
}


var products = [
    new ProductModel(
        1,
        'Product 1',
        'Description for Product 1',
        19.99,
        'https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg',
        'Category1'
    ),
    new ProductModel(
        2,
        'Product 2',
        'Description for Product 2',
        29.99,
        'https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg',
        'Category2',
        ['M', 'XL']
    ),
    new ProductModel(
        3,
        'Product 3',
        'Description for Product 3',
        39.99,
        'https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg',
        'Category3',
        ['M', 'XL', 'S']
    ),
]