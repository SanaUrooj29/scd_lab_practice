const express = require('express')
const  connectDB = require('../Shared/config/db')
const User = require("../Shared/model/User");
connectDB();
const app = express();

app.use(express.json());

app.post('/users', function(req, res){
    const { name, email, maxBookings, activeBookings} = req.body;

    //check is the email exists
    const existingUser = User.findOne({email : email})

    if(existingUser)
    {
        return res.status(403);
    }

    //create a new customer
    const user = User.create({ name, email, maxBookings, activeBookings });

    //save the customer
    customer.save();

    res.status(200);
    res.json({
        message : 'User successfully registed',
        id: user.id,
        name: user.name,
        maxBookings: user.maxBookings,
        activeBookings: user.activeBookings
    })

})

app.get("/users/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.json(user);
});
app.put("/users/:userId", async (req, res) => {
    const user = await User.findById(req.params.userId);
    if(!user)
    {
        return res.status(404);
    }
    user.name = req.body.name
    user.email = req.body.email
    user.maxBookings = req.body.maxBookings
    user.activeBookings = req.body.activeBookings
});


const PORT = 5001

app.listen(PORT, ()=>{
    console.log('server running on port 5001')
})