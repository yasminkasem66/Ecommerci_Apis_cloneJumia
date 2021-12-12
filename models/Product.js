// const mongoose = require('mongoose');
// const ProductSchema = new mongoose.Schema(
//   {
//     nameAr: {
//       type: String,
//       trim: true,
//       required: [true, 'Please provide product name'],
//       maxlength: [100, 'Name can not be more than 100 characters'],
//     },
//     nameEn: {
//       type: String,
//       trim: true,
//       required: [true, 'Please provide product name'],
//       maxlength: [100, 'Name can not be more than 100 characters'],
//     },
//     price:{
//       type: Number,
//       required: [true, 'Please provide product price'],
//       default: 0,
//     },
//     descriptionAr: {
//       type: String,
//       required: [true, 'Please provide product description'],
//       maxlength: [1000, 'Description can not be more than 1000 characters'],
//     },
//     descriptionEn: {
//       type: String,
//       required: [true, 'Please provide product description'],
//       maxlength: [1000, 'Description can not be more than 1000 characters'],
//     },
//     image: {
//       type: String,
//       default: '/uploads/example.jpeg',
//     },
//     category: {
//       type: String,
//     },
//     categoryImage: { type: String },
//     categoryparent: {
//       type: String
//     },
//     //1
//     // category: {
//     //   type: String,
//     //   categoryImage: { type: String },
//     //   parent: {
//     //     type: String
//     //   }
//     // },
//       ////////////////////2
//     // category: {
//     //   name: {
//     //     type: String
//     //   },
//     //   subCategories: [{
//     //     name: { type: String },
//     //     image: { type: String }
//     //   }]
//     // },

//     sku: {
//       type: String,
//     },
//     weight: {
//       type: Number,
//     },
//     size: {
//       type: Number,
//     },
//     model: {
//       type: String,
//     },
//     // sku: string,
//     material: {
//       type: String
//     },
//     quantity: {
//       type: Number
//     },
//     shopType: {
//       type: String
//     },

//     company: {
//         type: String
//     },
//     brand: {
//       type: String
//     },
//       // type: String,
//       // // required: [true, 'Please provide company'],
//       // enum: {
//       //   values: ['ikea', 'liddy', 'marcos'],
//       //   message: '{VALUE} is not supported',
//       // },
//     // colors: {
//     //   type: [String],
//     //   default: ['white'],
//     //   required: true,
//     // },
//     colors: {
//       type: String,
//       default: 'white',
//       required: true,
//     },
//     featured: {
//       type: Boolean,
//       default: false,
//     },
//     freeShipping: {
//       type: Boolean,
//       default: false,
//     },
//     inventory: {
//       type: Number,
//       required: true,
//       default: 15,
//     },
//     averageRating: {
//       type: Number,
//       default: 0,
//     },
//     numOfReviews: {
//       type: Number,
//       default: 0,
//     },
//     user: {
//       type: mongoose.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//   },
//   { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
// );
// ProductSchema.virtual('reviews', {
//   ref: 'Review',
//   localField: '_id',
//   foreignField: 'product',
//   justOne: false,//to return all reviews 
// });

// ProductSchema.pre('remove', async function (next) {
//   await this.model('Review').deleteMany({ product: this._id });
// });

// module.exports = mongoose.model('Product', ProductSchema);

const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema(
  {
    nameAr: {
      type: String,
      trim: true,
      required: [true, 'Please provide product name'],
      maxlength: [100, 'Name can not be more than 100 characters'],
    },
    nameEn: {
      type: String,
      trim: true,
      required: [true, 'Please provide product name'],
      maxlength: [100, 'Name can not be more than 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      default: 0,
    },
    descriptionAr: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [1000, 'Description can not be more than 1000 characters'],
    },
    descriptionEn: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [1000, 'Description can not be more than 1000 characters'],
    },
    image: {
      type: String,
      default: '/uploads/example.jpeg',
    },
    categoryAr: {
      type: String,
    },
    categoryEn: {
      type: String,
    },
    categoryImage: { type: String },
    categoryparentAr: {
      type: String
    },
    categoryparentEn: {
      type: String
    },
    //1
    // category: {
    //   type: String,
    //   categoryImage: { type: String },
    //   parent: {
    //     type: String
    //   }
    // },
    ////////////////////2
    // category: {
    //   name: {
    //     type: String
    //   },
    //   subCategories: [{
    //     name: { type: String },
    //     image: { type: String }
    //   }]
    // },

    sku: {
      type: String,
    },
    weight: {
      type: Number,
    },
    size: {
      type: String
    },
    model: {
      type: String,
    },
    // sku: string,
    material: {
      type: String
    },
    quantity: {
      type: Number
    },
    shopType: {
      type: String
    },

    company: {
      type: String
    },
    brand: {
      type: String
    },
    // type: String,
    // // required: [true, 'Please provide company'],
    // enum: {
    //   values: ['ikea', 'liddy', 'marcos'],
    //   message: '{VALUE} is not supported',
    // },
    // colors: {
    //   type: [String],
    //   default: ['white'],
    //   required: true,
    // },
    colors: {
      type: String,
      default: 'white',
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,//to return all reviews 
});

ProductSchema.pre('remove', async function (next) {
  await this.model('Review').deleteMany({ product: this._id });
});

module.exports = mongoose.model('Product', ProductSchema);
