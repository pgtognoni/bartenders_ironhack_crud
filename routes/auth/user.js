const router = require("express").Router();
const User = require("../../models/user-model")
const bcrypt = require("bcryptjs");

//SigUp Routes for User

router.get("/signup", (req, res) => {
    res.render('user/signup')
})

router.post('/signup', async (req, res) => {
    console.log(req.body)
    const user = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    delete user.password;
    user.password = hashedPassword;
    if (user.image === "") {
        user.image = undefined;
    }

    try {
        const userdata = await User.create(user);
        console.log(userdata)
        res.redirect('/user/login')
    } catch (error) {
        
        if (error.code === 11000) {
            let key = 'username'
            let errorMessage = 'User name already exists'
            res.render('user/signup', {errorMessage, key, user})
        } else {
        const key = Object.keys(error.errors)[0];
        let errorMessage = error.errors[key].message
        console.error(errorMessage);
        res.render('user/signup', {errorMessage, key, user})
        }
    }
})

//Login Routes for User
router.get("/login", (req, res) => {
    res.render('user/login')
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        
        if (user === null) {
            throw new Error('User not found');
        } else {
            if(bcrypt.compareSync(password, user.password)) {
                req.session.user = user.username;
                req.session.userId = user._id;

                res.redirect('/')
            } else {
                throw new Error('Invalid password');
            }
        }
    } catch (error) {
        console.error(error);
        res.render('user/login', { error, username }); 
    }
})

//User Profile Routes

router.get("/profile", async (req, res) => {
    try {
        const user = await User.findById(req.session.userId)
        res.render('user/profile', { user })
    } catch(error) {
        console.error(error);
    }
})

//User Edit Profile Routes

router.get("/edit", async (req, res) => {
    try {
        const user = await User.findById(req.session.userId)
        console.log(user)
        res.render('user/edit', { user })
    } catch(error) {
        console.error(error);
    }
})

router.post('/edit', async (req, res) => {
    console.log(req.body)
    const user = req.body;

    if (user.image === "") {
        user.image = undefined;
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.session.userId, user, { new: true });
        console.log(updatedUser)
        res.redirect('/user/profile')
    } catch (error) {
        
        if (error.code === 11000) {
            let key = 'username'
            let errorMessage = 'User name already exists'
            res.render('user/edit', {errorMessage, key, user})
        } else {
        const key = Object.keys(error.errors)[0];
        let errorMessage = error.errors[key].message
        console.error(errorMessage);
        res.render('user/edit', {errorMessage, key, user})
        }
    }
})
//User delete

router.get("/delete", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.session.userId)
        res.redirect('/')
    } catch(error) {
        console.error(error);
    }
})

//Logout
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect('/')
})

module.exports = router;