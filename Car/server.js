const express = require('express')
const  connectDB = require('../Shared/config/db')
const Car = require("../Shared/model/Car");

connectDB();

const app = express();

app.use(express.json());

app.post("/users", async (req, res) => {
    const { carId, model, location, isAvailable } = req.body;
    const existingCar = await Customer.findOne({carId : carId})

    if(existingCar)
    {
        return res.status(403);
    }

    //create a new customer
    const car = Car.create({ carId, model, location, isAvailable });
    //save the customer
    await car.save();

    res.status(200);
    res.json({
        message : 'Car successfully registed',
        id: car.id,
        number: car.carId,
        model: car.model,
        location : car.location,
        isAvailable : car.isAvailable
    })
});

app.get(' /cars/:carId:', async (req, res) => {
    const car = await Car.findById(req.params.carId);
    res.json(car);
})

app.put('/cars/:carId', async(req, res)=>{
    const car = await Car.findById(req.params.carId);
    if(!car)
    {
        return res.status(404);
    }
    //if car exists then update
    car.model = req.body.model;
    car.location = req.body.location;
    car.isAvailable = req.body.isAvailable
})

const PORT = 5002

app.listen(PORT, ()=>{
    console.log('server running on port 5002')
})


