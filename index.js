const Joi =require('joi');
// app setup
const express= require('express')
const app= express();
// import json
app.use(express.json());

const courses= [
    {id:1, name: 'course1'},
    {id:2, name: 'course2'},
    {id:3, name: 'course3'},
];

app.get('/', (request,response)=>{
    response.send("Hello World!!!");
});

app.get('/api/courses',(req,res)=>{
    // res.send returns parameter to browser
    res.send(courses);
})
app.get('/api/courses/:id',(req,res)=>{
    
    const course= courses.find(c=> c.id=== parseInt(req.params.id));
    if(!course) return res.status(400).send("THe course with the given ID was not found")
    res.send(course);
})

app.post('/api/courses', (req,res)=>{

    const result= validateCourse(req.body);

    if(result.error){
        // 400 Bad Request
        res.status(400).send(result.error.details[0].message);
        return;// bcs we do not want rest  of function to execute
    }

    const course= {
        id: courses.length+1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req,res)=>{
    // Look up the course
    // If not existing return 404
    const course= courses.find(c=> c.id=== parseInt(req.params.id));
    if(!course) return res.status(400).send("THe course with the given ID was not found");

    // If invalid, return 400- Bad Request
    const result= validateCourse(req.body);
    if(result.error) return res.status(400).send(result.error.details[0].message);

    // Update course
    course.name=req.body.name;
    res.send(course);
})

 app.delete('/api/courses/:id', (req,res)=>{
    
    const course= courses.find(c=> c.id=== parseInt(req.params.id));
    // if course don't exist, return 404
    if(!course) res.status(400).send("THe course with the given ID was not found");

    const index= courses.indexOf(course);
    courses.splice(index,1);

    res.send(course);

    //Return the same course
 });

// set env varaiable PORT
const port= process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on port ${port}...`));

function validateCourse(course){
    const schema= Joi.object({
        name: Joi.string().min(3).required()
    })
   return schema.validate(course);
}