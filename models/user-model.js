const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
}; 

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validateEmail, 'Please fill a valid email address'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    age: {
      type: Number,
      min: [18, 'You must be at least 18 years old'],
      max: [100, 'You must be at most 100 years old'],
      required: true
    },
    occupation: {
      type: String,
      enum: ['bartender', 'barmanager', 'barback', 'owner','client', 'student', 'other']
    },
    image: {
      type: String,
      default: 'https://lh3.googleusercontent.com/pw/AMWts8Bjl2I6k3z09wKRYTRAQebxdcAqwkIl_iIKhLisSH7eiSejcDhipzS6klL6TXS-n1O0VGuTK4no0b9hVMpQ4blP6AJIfhHamIlEuAXNlvb8Zy4J9TuTPKvuQN2Jjv9EY8SWP5JJ50nOY_z3oEI6YDf-=w260-h230-no?authuser=0'
    },
    city: {
      type: String,
    },
    bio: {
      type: String
    },
    password: {
      type: String,
      required: true
    },
    favorites: [{
      type: Schema.Types.ObjectId,
      ref: "Cocktail"
    }]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
