const { Schema, model } = require("mongoose");

const checkLength = (value) => { 
  if (value.length === 0) {
    return "This field is required";
  }
  return true;
}

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const cocktailSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    servingGlass: {
      type: String,
      enum: ['Martini' , 'Tumbler' , 'Highball' , 'Coupette' , 'Nick N` Nora' , 'Other'],
      required: true
    },
    garnish: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    shared: {
      type: Boolean,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    image: {
        type: String,
        default: ''
    },


  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);



const Cocktail = model("Cocktail", cocktailSchema);

module.exports = Cocktail;
