const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const path = require('path');

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  console.log(req.body.user);
  console.log(req.user.userId);
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

//test
// const getAllProducts = async (req, res) => {
//   const products = await Product.find({});
//   res.status(StatusCodes.OK).json({ products, count: products.length });
// };

const getAllProducts = async (req, res) => {
  const { lang } = req.params;
  console.log(" req.query", req.query);
  console.log(" lang", lang);
  // if (lang == 'en') {
  //   let { featured, company, nameEn, nameAr, sort, fields, numericFilters, category: categoryEn, colors, brand, categoryparent: categoryparentEn } = req.query
  // } else {
  //   let { featured, company, nameEn, nameAr, sort, fields, numericFilters, category: categoryAr, colors, brand, categoryparent: categoryparentAr } = req.query
  // }
  let categoryparentEn, categoryparentAr, categoryEn, categoryAr, nameEn, nameAr;
  let { featured, company, name, sort, fields, numericFilters, category, colors, brand, categoryparent } = req.query;
  (lang == 'en') ? (categoryparentEn = categoryparent) : (categoryparentAr = categoryparent);
  (lang == 'en') ? (categoryEn = category) : (categoryAr = category);
  (lang == 'en') ? (nameEn = name) : (nameAr = name);

  console.log(" categoryparentEn", categoryparentEn);
  console.log(" categoryEn", categoryEn);


  const queryObject = {}
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false
  }
  if (company) {
    queryObject.company = company
  }
  if (categoryEn) {
    queryObject.categoryEn = categoryEn
  }
  if (categoryAr) {
    queryObject.categoryAr = categoryAr
  }
  if (colors) {
    queryObject.colors = colors
  }
  if (brand) {
    queryObject.brand = brand
  }
  if (categoryparentEn) {
    queryObject.categoryparentEn = categoryparentEn
  }
  if (categoryparentAr) {
    queryObject.categoryparentAr = categoryparentAr
  }
  if (nameEn) {
    console.log("nameEn", nameEn);
    queryObject.nameEn = { $regex: nameEn, $options: 'i' }
  }
  if (nameAr) {
    console.log("nameAr", nameAr);
    queryObject.nameAr = { $regex: nameAr, $options: 'i' }
  }
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
      '&lt;': '$lt',
    }
    const regEx = /\b(<|>|>=|=|<|<=|&lt;)\b/g
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    )
    const options = ['price', 'averageRating']
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-')
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) }
      }
    })
  }

  let result =   Product.find(queryObject)
  // console.log(" queryObject", queryObject);

  // sort
  if (sort) {
    const sortList = sort.split(',').join(' ')
    console.log("sortList", sortList);
    result = result.sort(sortList)
  } else {
    result = result.sort('createAt')
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ')
    result = result.select(fieldsList)
  }
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 200
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)
  // 23
  // 4 7 7 7 2
  const products =  await result

  let newProductAr = [];
  let newProductEn = [];

  if (lang == 'en') {
    products.map((product) => {
      newProductEn.push({
        id: product._id, name: product.nameEn, price: product.price, description: product.descriptionEn, image: product.image, category: product.categoryEn, categoryparent: product.categoryparentEn, categoryImage: product.categoryImage, sku: product.sku
        , weight: product.weight, size: product.size, model: product.model, material: product.material,
        quantity: product.quantity, shopType: product.shopType, brand: product.brand, colors: product.colors, featured: product.featured, freeShipping: product.freeShipping, inventory: product.inventory, averageRating: product.averageRating, numOfReviews: product.numOfReviews, user: product.user, company: product.company
      })
    })

  } else {
    products.map((product) => {
      newProductAr.push({
        id: product._id, name: product.nameAr, price: product.price, description: product.descriptionAr, image: product.image, category: product.categoryAr, categoryparent: product.categoryparentAr, categoryImage: product.categoryImage, sku: product.sku, weight: product.weight, size: product.size, model: product.model, material: product.material,
        quantity: product.quantity, shopType: product.shopType, brand: product.brand, colors: product.colors, featured: product.featured, freeShipping: product.freeShipping, inventory: product.inventory, averageRating: product.averageRating, numOfReviews: product.numOfReviews, user: product.user, company: product.company
      })
    })
  }

  if (lang == 'en') {
    res.status(StatusCodes.OK).json({ products: newProductEn, nbHits: products.length });

  } else {
    res.status(StatusCodes.OK).json({ products: newProductAr, nbHits: products.length });
  }

  // res.status(200).json({ products, nbHits: products.length })
}




const getCategories = async (req, res) => {
  const { lang } = req.params;
  console.log(" lang", lang);
  if (lang == 'en') {
    const categoriesEn = await Product.find().distinct('categoryEn');
    res.status(StatusCodes.OK).json({ categories: categoriesEn });
  } else {
    const categoriesAr = await Product.find().distinct('categoryAr');
    res.status(StatusCodes.OK).json({ categories: categoriesAr });
  }
  // res.status(StatusCodes.OK).json({ categories });
};

const getParentCategories = async (req, res) => {
  
  const { lang, categoryparent } = req.params;
  // let categoryparentEn, categoryparentAr;
  // (lang == 'en') ? (categoryparentEn = categoryparent) : (categoryparentAr = categoryparent);
  // console.log(" lang", lang);
  if (lang == 'en') {
    const categoriesparentEn = await Product.find().distinct('categoryparentEn');
    res.status(StatusCodes.OK).json({ categoriesparent: categoriesparentEn });
  } else {
    const categoriesparentAr = await Product.find().distinct('categoryparentAr');
    res.status(StatusCodes.OK).json({ categoriesparent: categoriesparentAr });
  }
  // const categoriesparent = await Product.find().distinct('categoryparent');
  // res.status(StatusCodes.OK).json({ categoriesparent });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const { lang } = req.params;
  console.log("req.params", req.params)
  console.log("lang", lang)

  const product = await Product.findOne({ _id: productId }).populate('reviews');
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }
  let newProductAr = {
    id: product._id, name: product.nameAr, price: product.price, description: product.descriptionAr, image: product.image, category: product.category, categoryparent: product.categoryparent, categoryImage: product.categoryImage, sku: product.sku, weight: product.weight, size: product.size, model: product.model, material: product.material,
    quantity: product.quantity, shopType: product.shopType, brand: product.brand, colors: product.colors, featured: product.featured, freeShipping: product.freeShipping, inventory: product.inventory, averageRating: product.averageRating, numOfReviews: product.numOfReviews, user: product.user, company: product.company
  }
  let newProductEn = {
    id: product._id, name: product.nameEn, price: product.price, description: product.descriptionEn, image: product.image, category: product.category, categoryparent: product.categoryparent, categoryImage: product.categoryImage, sku: product.sku
    , weight: product.weight, size: product.size, model: product.model, material: product.material,
    quantity: product.quantity, shopType: product.shopType, brand: product.brand, colors: product.colors, featured: product.featured, freeShipping: product.freeShipping, inventory: product.inventory, averageRating: product.averageRating, numOfReviews: product.numOfReviews, user: product.user, company: product.company
  }
  if (lang == 'en') {
    res.status(StatusCodes.OK).json({ product: newProductEn });

  } else {
    res.status(StatusCodes.OK).json({ product: newProductAr });
  }
};


const updateProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndDelete({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }
  res.status(StatusCodes.OK).json({ msg: 'Success! Product removed.' });
};



const uploadImage = async (req, res) => {
  const url = req.protocol + '://' + req.get('host');
  console.log(req.files)
  // console.log(req)
  if (!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded');
  }
  const productImage = req.files.image;
  console.log(req.files.image)

  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please Upload Image or pdf');
  }
  const maxSize = 1024 * 1024;

  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      'Please upload image smaller than 1MB'
    );
  }

  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `${url}/public/uploads/${productImage.name}` });
};


// //multer
// var store = multer.diskStorage({
//   destination: function (req, file, cb) {
//     console.log("multerstore");
//     cb(null, '../public/uploads');
//   },
//   filename: function (req, file, cb) {
//     console.log("multerstore");
//     cb(null, Date.now() + '.' + file.originalname);
//   }
// });

// var uploadImageMttlr = multer({ storage: store }).single('file');

// const uploadImageMttlr2 = async (req, res, next) => {
//   console.log("multer");
//   console.log(" req.file", req.file);

//   uploadImageMttlr(req, res, function (err) {
//     if (err) {
//       console.log("multer");
//       return res.status(501).json({ error: err });
//     }
//     //do all database record saving activity
//     return res.json({ originalname: req.file.originalname, uploadname: req.file.filename });
//   });

// };

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getCategories,
  getParentCategories
};













// //////test

// const { router} = require('./controllers/productController')
// app.use('/api/v1/test', router);

// // Multer File upload settings
// const DIR = '../public/uploads';

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, DIR);
//     console.log("entered1");
//   },
//   filename: (req, file, cb) => {
//     const fileName = file.originalname.toLowerCase().split(' ').join('-');
//     cb(null, fileName)
//     console.log("entered2");

//   }
// });

// // Multer Mime Type Validation
// var upload = multer({

//   storage: storage,
//   // limits: {
//   //   fileSize: 1024 * 1024 * 5
//   // },
//   fileFilter: (req, file, cb) => {
//     console.log("entered3");

//     if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//     }
//   }
// });

// // POST Product
// // name
// // price
// // description
// // image
// // category
// // company

// router.post('/create-product', upload.single('image'), (req, res, next) => {
//   const url = req.protocol + '://' + req.get('host')
//   const product = new Product({
//     _id: new mongoose.Types.ObjectId(),
//     name: req.body.name,
//     price: req.body.price,
//     description: req.body.description,
//     image: url + '/public/' + req.files[0].filename,
//     category: req.body.category,
//     company: req.body.company,
//   });
//   product.save().then(result => {
//     console.log(result);
//     res.status(201).json({
//       message: "product uploaded successfully!",
//       productCreated: {
//         name: result.name,
//         price: result.price,
//         description: result.description,
//         image: result.image,
//         category: result.category,
//         company: result.company,
//       }
//     })
//   }).catch(err => {
//     console.log(err),
//       res.status(500).json({
//         error: err
//       });
//   })
// })


//test2


// const createProduct = async (req, res) => {
//   const url = req.protocol + '://' + req.get('host')
//   const product = new Product({
//     _id: new mongoose.Types.ObjectId(),
//     name: req.body.name,
//     price: req.body.price,
//     description: req.body.description,
//     image: url + '/public/' ,
//     category: req.body.category,
//     company: req.body.company,
//   });
//   product.save().then(result => {
//     console.log(result);
//     res.status(201).json({
//       message: "product uploaded successfully!",
//       productCreated: {
//         name: result.name,
//         price: result.price,
//         description: result.description,
//         image: result.image,
//         category: result.category,
//         company: result.company,
//       }
//     })
//   }).catch(err => {
//     console.log(err),
//       res.status(500).json({
//         error: err
//       });
//   })
// };

// const mongoose = require('mongoose');
// const express = require('express');
// const router = express.Router();


// var multer = require('multer');
// //////test
