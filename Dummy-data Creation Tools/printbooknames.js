const fs = require('fs');

const articles = ["The", "a/an"];
const adjectives = ["Flawless",
                    "Glib",
                    "Unbiased",
                    "Cut",
                    "Bawdy",
                    "Unadvised",
                    "General",
                    "Great",
                    "Abandoned",
                    "Jolly",
                    "Warm",
                    "Rare"];
const nouns = ["Reaction",
            "Lunch",
            "Question",
            "Street",
            "Company",
            "Stretch",
            "Memory",
            "Team",
            "Chicken",
            "Yarn",
            "Soap",
            "Skirt"];

// Print random book names to text file
for(var x = 0; x < 50; x++){
    var adjec = adjectives[Math.floor(Math.random() * adjectives.length)];
    var booknamestring = (startsWithVowel(adjec) ? "An" : "A") + " " + adjec + " " + nouns[Math.floor(Math.random() * nouns.length)];
    fs.appendFile("booknames.txt", booknamestring + ",", (err) => {
        if (err) throw err;
        console.log("Appended book name: " + booknamestring);
    });
}

function startsWithVowel(word){
    var vowels = ["a", "e", "i", "o", "u"];
    for(var x = 0; x < vowels.length; x++){
        if(word.toLowerCase().startsWith(vowels[x])){
            return true;
        }
    }
    return false;
}