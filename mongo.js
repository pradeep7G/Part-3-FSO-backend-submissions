const mongoose=require('mongoose');

if(process.argv.length !== 5 && process.argv.length!==3)
{
    console.log('If you want to add an entry then please provide the password,name,phone number as command line argument i.e node mongo.js <password> <name> <number>');
    console.log('else if you want to see all entries enter password as cmd line arg i.e node mongo.js <password>')
    console.log('Note : every arugment mustn\'t have space in it,if it has enclose it in quotes and make sure that your commands are in the format specified above');
    process.exit(1);
}

const args=process.argv.length;
const password=process.argv[2];


const url=`mongodb+srv://fso_app:${password}@cluster0.dnnfs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:true,useCreateIndex:true});

const personSchema=new mongoose.Schema({
        name:String,
        number:String,
        date:Date,
});

const Person=mongoose.model('Person',personSchema);

if(args==5)
{
    const personName=process.argv[3];
    const personNumber=process.argv[4];
    const person=new Person({   
          name:personName,
          number:personNumber,
          date:new Date()
    })
    person.save().then(result => {
        console.log(`added ${result.name} ${result.number} to phonebook`);
        mongoose.connection.close();
    })
}
else if(args==3)
{
    console.log('Phonebook:')
    Person.find({name:"pradeep"}).then((person)=>{
        result.forEach(person =>{
            console.log(person.name,person.number);
        });

        mongoose.connection.close();
    })
}

