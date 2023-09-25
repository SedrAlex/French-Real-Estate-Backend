import express from 'express'
import { addToFav, bookVisit, cancelBookings, createUser, getAllBookings, getAllFavourits } from '../controllers/userController.js'
import jwtCheck from '../config/auth0Config.js'
const router = express.Router()
// remember to add the jwt check middlesware for all the endpoints here and also for also to create residency middleware 
router.post("/register",jwtCheck,createUser)
router.post("/bookVisit/:id",jwtCheck,bookVisit)
router.post("/allbookings",jwtCheck,getAllBookings)
router.post("/removeBooking/:id",jwtCheck,cancelBookings)
router.post("/addToFavourite/:rid",jwtCheck,addToFav)
router.post("/allFavourits",jwtCheck,getAllFavourits)

export {router as userRoute}