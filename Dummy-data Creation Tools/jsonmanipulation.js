const fs = require('fs');
let dataFile = require("./booknames.json");

var teststring = {books: dataFile};
var testarray = {books: [], students: []};

const namefirst = [
    "Chanda",
    "Jere",
    "Gianna",
    "Darrel",
    "Glory",
    "Florentina",
    "Sallie",
    "Loreta",
    "Marcene",
    "Aurelio",
    "Nicolle",
    "Lyda",
    "Devona",
    "Bridgette",
    "Myra",
    "Marquis",
    "Dewayne",
    "Rodrick",
    "Loura",
    "Annamae"
];

const namelast = [
    "Odom",
    "Guzman",
    "Kane",
    "Strong",
    "Pollard",
    "George",
    "Huynh",
    "Mcgee",
    "Guerra",
    "Cruz",
    "Graves",
    "Figueroa",
    "Miranda",
    "Pham",
    "Livingston",
    "Kirby",
    "Sloan",
    "Dunlap",
    "Freeman",
    "White"
];

var teacherlast = namelast[Math.floor(Math.random() * namelast.length)];

for(var x = 0; x < dataFile.length; x++){

    var stuinfo;
    var issuanceinfo;
    var redempcode;
    var stuid = Math.floor(Math.random() * 899999 + 100000)
    var borrowbookid;
    var timeissued = 990198000 + Math.floor(Math.random() * 3600);
    if(Math.floor(Math.random() * 3) > 0){
        issuanceinfo = {
            studentId: stuid, 
            unixTimestampIssued: timeissued,
            timeIssued: new Date(timeissued * 1000).toLocaleString("en-US"/*, {year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC', hour12: true}*/),
            codeUsed: Math.floor(Math.random() * 899999 + 100000)
        };
        redempcode = null;
        borrowbookid = x;
        stuinfo = {
            name: namefirst[Math.floor(Math.random() * namefirst.length)] + " " + namelast[Math.floor(Math.random() * namelast.length)],
            grade: 9,
            teacher: "Mrs. " + teacherlast,
            studentId: stuid,
            borrowingBookId: borrowbookid
        }
    
        testarray["students"].push(stuinfo);
    }else{
        issuanceinfo = null;
        redempcode = Math.floor(Math.random() * 899999 + 100000);
        borrowbookid = null;
    }

    testarray["books"][x] = {
        id: x, 
        author: namefirst[Math.floor(Math.random() * namefirst.length)] + " " + namelast[Math.floor(Math.random() * namelast.length)], 
        isbn: Math.floor(Math.random() * 899 + 100) + "-" // xxx-x-xxxxx-xxx-x 
            + Math.floor(Math.random() * 9) + "-" 
            + Math.floor(Math.random() * 89999 + 10000) + "-" 
            + Math.floor(Math.random() * 899 + 100) + "-" 
            + Math.floor(Math.random() * 9),
        title: dataFile[x], 
        redemptionCode: redempcode,
        issuanceInformation: issuanceinfo
    };


}

fs.writeFile("booknames.json", JSON.stringify(testarray), (err) => {
    if (err) throw err;
    console.log("wrote json");
});