const router = require("express").Router();
const User = require("../../models/user-model")
const bcrypt = require("bcryptjs");
const { isLoggedIn } = require('../../middlewares/islogged');

//SigUp Routes for User


router.get("/signup", (req, res) => {
    res.render('user/signup', { session: req.session.user || undefined})
})

router.post('/signup', async (req, res) => {
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
        res.redirect('/user/login')
    } catch (error) {
        console.log(req.session.user)
        if (error.code === 11000) {
            let key = 'username'
            let errorMessage = 'User name already exists'
            res.render('user/signup', {errorMessage, key, user, session: req.session.user || undefined})
        } else {
        const key = Object.keys(error.errors)[0];
        let errorMessage = error.errors[key].message
        console.error(errorMessage);
        res.render('user/signup', {errorMessage, key, user, session: req.session.user || undefined})
        }
    }
})

//Login Routes for User
router.get("/login", (req, res) => {
    res.render('user/login', { session: req.session.user || undefined})
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
        res.render('user/login', { error, username, session: req.session.user || undefined }); 
    }
})

//User Profile Routes

router.get("/profile", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId)
        res.render('user/profile', { user, session: req.session.user || undefined })
    } catch(error) {
        console.error(error);
    }
})

//User Edit Profile Routes

router.get("/editUser", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId)
        res.render('user/editUser', { user, session: req.session.user || undefined })
    } catch(error) {
        console.error(error);
    }
})

router.post('/editUser', isLoggedIn, async (req, res) => {
    const user = req.body;

    if (user.image === "") {
        user.image = undefined;
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.session.userId, user, { new: true });
        res.redirect('/user/profile')
    } catch (error) {
        if (error.code === 11000) {
            let key = 'username'
            let errorMessage = 'User name already exists'
            res.render('user/editUser', {errorMessage, key, user, session: req.session.user || undefined})
        } else {
            const key = Object.keys(error.errors)[0];
            let errorMessage = error.errors[key].message
            console.error(errorMessage);
            res.render('user/editUser', {errorMessage, key, user, session: req.session.user || undefined})
        }
    }
})
//User delete

router.get("/delete", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.session.userId)
        res.redirect('/')
    } catch(error) {
        console.error(error);
    }
})

//Logout
router.get("/logout", isLoggedIn, (req, res) => {
    req.session.destroy();
    res.redirect('/')
})

module.exports = router;