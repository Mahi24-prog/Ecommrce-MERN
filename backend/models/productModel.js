const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
  name: {
    type:String,
    required: [true, "Please enter product name"]
  },
  description:{
    type: String,
    required: [true, "Please enter product description"]
  },
  price:{
    type: String,
    required: [true, "Plaese enter product price"],
    maxLength: [8, "Price cannot exceed 8 characters"]
  },
  discount: {
    type: Number,
    default: 0,
  },
  rating:{
    type: Number,
    default: 0
  },
  image:[
  {
    public_id:{
      type: String,
      required: true,
    },
    url:{
      type:String,
      required: true
    }
  }],
  category:{
    type: String,
    required: true
  },
  stock:{
    type: Number,
    required:[true,"Please Enter Product Stock"],
    maxLength:[4, "Stock Cannot exceed 4 charactor"],
    default: 1
  },
  numOfReviews:{
    type: Number,
    default: 0
  },
  reviews:[
    {
      name:{
        type: String,
        required: true
      },
      rating:{
        type: String,
        required: true,
      },
      comment:{
        type: String,
        required: true
      }
    }
  ],
  createdAt:{
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Product", productSchema)