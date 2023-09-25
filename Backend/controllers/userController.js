import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prismaConfig.js';


export const createUser = asyncHandler(async(req, res) => {

console.log("creating a user");
let{email} = req.body

const userExists = await prisma.user.findUnique({ where: {email: email} })

if(!userExists){
    const user = await prisma.user.create({ data : req.body });
    res.send({
        message:"User registered successfully",
        user:user,
    })
}
else res.status(201).send({message: "User already registered"})
})

export const bookVisit = asyncHandler(async(req,res) => {
    const{email, date} = req.body
    const {id} = req.params
    try{
       const alreadyBooked = await prisma.user.findUnique({
        where:{email},
        select:{bookedVisits:true}
       })
       if(alreadyBooked.bookedVisits.some((visit) => visit.id===id)){
        res.status(400).json({message:"This residency is already booked by you"})
       }
       else{
        await prisma.user.update({
            where : {email:email},
            data: {
                bookedVisits:{push:{id, date}}
            }
        })
        res.send("your visit is booked successfully")

       }
    }

catch(error){
    throw new Error(error.message)
}
})
//function to get all the bookings of the user
export const getAllBookings = asyncHandler(async(req,res) => {
    const {email} = req.body
    try{
        const bookings = await prisma.user.findUnique({
            where:{email},
            select:{bookedVisits:true}
        })
        res.status(200).send(bookings)
    }
    catch(error){
         throw new Error(error.message)
    }
})

//function to cancel the booking
export const cancelBookings = asyncHandler(async(req,res) => {
    const {email} = req.body;
    const {id} = req.params
    try{
        const user = await prisma.user.findUnique({
            where:{email: email},
            select:{bookedVisits:true}
        })
         const index = user.bookedVisits.findIndex((visit) =>visit.id ===id) 
         if(index === -1 ){
            res.status(404).json({message:"Booking not found"})
         } else
         {
               user.bookedVisits.splice(index, 1)
               await prisma.user.update({
                where:{email},
                data:{
                    bookedVisits: user.bookedVisits
                }
               })
               res.send("Booking cancelled successfully")
         }
    }
    catch(error){
        throw new Error(error.message)
    }
})
//function to add a residency in favourite the booking
export const addToFav = asyncHandler(async(req, res) => {
    const {email} = req.body;
    const {rid} = req.params

    try
    {
         const user = await prisma.user.findUnique({
            where:{email}
         })
    if(user.favResidencesID.includes(rid)){
        const updateUser = await prisma.user.update({
            where:{email},
            data : {
                favResidencesID:{
                    set :user.favResidencesID.filter((id) => id !==rid)
                }
            }
        });
        res.send({message:"Removed from favorites", user:updateUser})
    }else{
        const updateUser = await prisma.user.update({
              where:{email},
              data:{
                  favResidencesID:{
                    push:rid
                  }
              }
        })
        res.send({message:"Updated favorites", user:updateUser})
    }
    }
    catch(error){
        throw new Error(error.message)
    }
})
//function to get all the favourites

export const getAllFavourits = asyncHandler(async(req,res)=>{
 const {email} = req.body;
 try{
    const favResedencies = await prisma.user.findUnique({
    where : {email},
    select: {favResidencesID : true}
    })
    res.status(200).send(favResedencies)
 }
 catch(error){
    throw new Error(error.message)
 }
})