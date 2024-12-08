require("dotenv").config();
const express = require('express');
const errorHandler = require("./middleware/errorHandler");
const app = express();
const PORT = process.env.PORT || 5050;
const cors = require('cors');

app.use(cors());
app.use(express.json());

//custom module
app.use('/api/contacts', require("./routes/contactRoute"));
app.use('/api/users', require("./routes/userRoute"));
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log('Server listening on port:', PORT);
});
