const express = require('express');

const app = express();

// using our middleware
app.use((req, res, next) => {
    console.log(`I'm In the middleware!`);
    next();
});

app.use((req, res, next) => {
    console.log(`In the middleware again LOL`)
    res.send('<h1>Hello from Express!</h1>')
}); 

app.listen(3000);
