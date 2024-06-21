const mongoose = require("mongoose")
const initData = require("./data.js")
const Listing = require("../models/listing.js")

const db_Url = 'mongodb://127.0.0.1:27017/wonderlustRestart'

main().then(()=>{
    console.log(`connected to DB`);
}).catch((err)=>{
    console.log(`error = ${err}`);
})

async function main(){
    await mongoose.connect(db_Url)
}

const initDB = async ()=>{
    await Listing.deleteMany({})
    initData.data =initData.data.map((obj)=>({...obj, owner : "6670142885afd318ce066dee"}))
    await Listing.insertMany(initData.data)
    console.log(`data was initialized`);
}

initDB()