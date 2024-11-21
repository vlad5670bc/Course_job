import mongoose from 'mongoose'

const account = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    lastname: {type:String,required:true},
   password: {type:String,required:true},
   userRole:{type:String,required:true}
},{versionKey:false})

export default mongoose.model('accounts',account)