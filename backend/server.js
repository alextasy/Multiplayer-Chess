const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors()); // Take care of cors issues

app.listen(process.env.PORT || 4000);
