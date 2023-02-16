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
      lowercase: true,
      unique: true,
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
      default: '/images/camera.png'
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
    creations: [{
      type: Schema.Types.ObjectId,
      ref: "Cocktail"
    }],
    favourites: [String],
    searchHistory: {type: [String] , default: ['martini', 'negroni', 'margarita', 'whiskey']}
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
