const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

// database connection
const dbURI = process.env.MONGODB_CONN
mongoose.connect(dbURI)
    .then(() => console.log('connected to mongodb'))
    // .then((result) => app.listen(port, () => {
    //     console.log(`App listening on port ${port}`);
    // }))
    .catch(err => console.log(err)
);