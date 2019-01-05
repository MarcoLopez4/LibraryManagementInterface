const fs = require('fs');
const path = require('path');

var booknamesarray;

var contents = fs.readFileSync(path.join(__dirname, 'booknames.txt'), {encoding: 'utf-8'});
var jsoncontents = JSON.stringify(contents.split(","));


fs.writeFile("booknames.txt", jsoncontents, (err) => {
    if (err) throw err;
    console.log("wrote json");
});