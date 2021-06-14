const mongoose=require('mongoose');

const url=process.env.MONGODB_URI;
console.log('connecting to Mongo DB ',url);
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false,useCreateIndex:true})
.then(()=>{
    console.log('connected to Mongo DB');
})
.catch(error=>{
    console.log('error connecting mongo DB: ',error.message);
})

const personSchema=new mongoose.Schema({
        name:String,
        number:String,
        date:Date,
});

personSchema.set('toJSON',{
  transform:(document,returnedObject)=>{
    returnedObject.id=returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

module.exports=mongoose.model('Person',personSchema);