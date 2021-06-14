const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');

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
        name:{
          type:String,
          required:true,
          minLength:3,
          unique:true
        },
        number:{
          type:String,
          required:true,
          minLength:8,
          unique:true
        },
        date:{
          type:Date,
          required:true
        }
});

personSchema.set('toJSON',{
  transform:(document,returnedObject)=>{
    returnedObject.id=returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

personSchema.plugin(uniqueValidator);

module.exports=mongoose.model('Person',personSchema);