const mongoose=require('mongoose')
bcrypt = require('bcryptjs'),
SALT_WORK_FACTOR = 10;

const newUser=new mongoose.Schema({
    username:{
        require:true,
        type: String,
        unique: true
    },
    password:{
        require:true,
        type: String,
       
    },
    email:{
        require:true,
        type: String,
       
    },
})

newUser.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
     

module.exports=mongoose.model("users",newUser) 