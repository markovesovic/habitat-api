const express = require('express');

const app = express();

app.set('PORT', 3000);

app.listen(app.get('PORT'), () => {
    console.log(`Running on ${app.get('PORT')} port`);
});

module.exports = {};