const express = require('express');
const app = express();

// Parse requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Allow access
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});
app.listen(process.env.PORT || 4000);
