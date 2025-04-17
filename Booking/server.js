const express = require('express')
const  connectDB = require('../Shared/config/db')
const Booking = require("../Shared/model/Booking");

connectDB();

const app = express();

app.use(express.json());

const USER_SERVICE_URL = 'http://localhost:5001/users';
const CAR_SERVICE_URL = 'http://localhost:5002/cars';

app.post('/bookings', function (req, res) {
    const {userId, carId, startDate, endDate} = req.body
    //for user
    const userResponse = axios.get('${USER_SERVICE_URL}/${userId}')
    const user = userResponse.data;

    if(user.activeBookings >= user.maxBookings)
    {
        return res.status(400).json({ message: 'User has reached the booking limit' });
    }
    //for car
    const carResponse = axios.get('${CAR_SERVICE_URL}/${carId}')
    const car = carResponse.date;
    if(!car.isAvailable)
    {
        return res.status(400).json({ message: 'Car is not available' });
    }

    const booking = new Booking({userId, carId, startDate, endDate, status: 'active'});
    booking.save();

    axios.put(`${USER_SERVICE_URL}/${userId}`, { activeBookings: user.activeBookings + 1 });
    axios.put(`${CAR_SERVICE_URL}/${carId}`, { isAvailable: false });

    res.status(201).json(
        {
            message: 'Booking successful',
            bookingId: booking.id,
            userId: booking.userId,
            carId: booking.carId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            status: booking.status,
            car: car,
            user: user,
            userResponse: userResponse.data,
            carResponse: carResponse.data,    
        }
    );
    
})
app.get('/bookings/:userId', function(req, res)
{
    const { userId }  = req.params
    const booking = Booking.find({userId})
    res.json(booking);
});
app.delete('/bookings/:bookingId', (req, res) => {
    const {bookingId} = req.params
    const booking = Booking.findById(bookingId);
    if(!booking)
    {
        return res.status(404).json({ message: 'Booking not found' });
    }
    booking.status = 'cancelled';
    booking.save();

    const userResponse = axios.get(`${USER_SERVICE_URL}/${booking.userId}`);
    const user = userResponse.data;
    axios.put(`${USER_SERVICE_URL}/${booking.userId}`, { activeBookings: user.activeBookings - 1 });
    //make the car available
    axios.put(`${CAR_SERVICE_URL}/${booking.carId}`, { isAvailable: true });

    res.json({ message: 'Booking canceled' });       
})

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

