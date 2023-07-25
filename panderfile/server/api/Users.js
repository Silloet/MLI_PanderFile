import { Schema, model } from 'mongoose';
import { hash, compare } from 'bcrypt';
//const jwt = require('jsonwebtoken');


const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(v);
            },
            message: props => `${props.value} Please enter a valid email address!` 
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 5
      },

    comments:[{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }], 
     savedBooks: [{
        bookId: String,
        authors: [String],
        description: String,
        title: String,
        image: String,

     }],
},
{
    toJSON: {
     virtuals: true,
    getters: true
    },
  
}
);

//hash user password for security
userSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('password')) {
      const saltRounds = 10;
      this.password = hash(this.password, saltRounds);
    }
  
    next();
  });

 //validate password for logging in
 userSchema.methods.isCorrectPassword = async function (password) {
   return compare(password, this.password);
 };

userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
})

const User = model('User', userSchema);

export default User;