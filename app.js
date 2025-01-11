const path = require('path');
const express = require("express");
const app = express();
const tasks = require('./routes/tasks')
const authRoutes = require("./routes/auth")
const connectDb = require('./db/connect')
require('dotenv').config();
const authenticateJWT = require('./middleware/authenticateJWT');
const notFound = require('./middleware/Not-found')
const errorHandlerMiddleWare = require('./middleware/errorHandler')

const port =  3000;

//middleware
app.use(express.static('./public'))
app.use(express.json())// if we dont use this data from req.body wont be returned
app.use(errorHandlerMiddleWare)




//routes
app.use('/api/v1/homePage',authenticateJWT)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', tasks)
app.use(notFound)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'loginPage.html')); // Adjust the path as needed
});



const start = async () =>{
  try {
    await connectDb(process.env.MONGO_URI)
    app.listen(port, console.log(`Server is listening on port ${port}....`));
  } catch (error) {
    console.log(error);
}
}
start()