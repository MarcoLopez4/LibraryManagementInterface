// Client-side javascript for the management interface.

var libraryDatabase; // Defining the database object right now so that we're able to access it globally
var libraryDatabaseEditable;
var showingBookInformation = true; // Used to toggle between student and book information (defaults to book)

var changesMade = false; // Used to check if changes have been made (of course)

// Connect to the socket.io server
var socket = io.connect();
socket.on('connect', function(data){
    console.log("Connected to socket.io server"); // Logged for debugging purposes, the user shouldn't be able to see this (unless, of course, they open the console)

    socket.emit('requestDatabase'); // Now that we're connected, let's ask for the database.

    // Got a response!
    socket.on('databaseResponse', (data) => { // The "data" parameter should (hopefully) be the database as an object. If our request was denied, this will be null.
        if (data != null){
            // Our request was accepted and we got the database! 
            libraryDatabase = data; // Set the value for the libraryDatabase variable to the database we just got. 
            libraryDatabaseEditable = data; // Do that for the editable one too.
            $('#table').bootstrapTable({ // Set up the table to display book information again
                columns: [{
                    field: 'id',
                    title: 'Book ID'
                }, {
                    field: 'title',
                    title: 'Book Title'
                }, {
                    field: 'author',
                    title: 'Book Author'
                }, {
                    field: 'isbn',
                    title: 'ISBN'
                }, {
                    field: 'redemptionCode',
                    title: 'Code for Redemption'
                }, {
                    field: 'issuanceInformation.studentId',
                    title: 'Borrower\'s Student ID<br />(Click for student\'s information)'
                }, {
                    field: 'issuanceInformation.timeIssued',
                    title: 'Time Borrowed'
                }],
                data: libraryDatabaseEditable.books,
                onClickCell: function(field, value, row, $element){
                    if(field == 'issuanceInformation.studentId'){
                        var student = libraryDatabaseEditable.students.filter(student => student.studentId.toString() == value)[0];
                        displayInformationModal("student", student, row);
                    }
                }, 
                onDblClickCell: function(field, value, row, $element){
                    if(confirm("Are you sure you want to edit this?")){
                        var newValue = prompt("What would you like to change this to?", value);
                        if(newValue != "" && !field.includes(".")){
                            libraryDatabaseEditable.books[row.id][field] = newValue;
                            changeMade();
                            showingBookInformation = !showingBookInformation;
                            toggleTable(document.getElementById("toggleTable"));
                        } else if (field.includes(".")) {
                            libraryDatabaseEditable.books[row.id][field.split(".")[0]][field.split(".")[1]] = newValue;
                            changeMade();
                            showingBookInformation = !showingBookInformation;
                            toggleTable(document.getElementById("toggleTable"));
                        } else {
                            alert("You did not put anything; it has been left untouched.");
                        }
                    }
                }
            });
        }else{
            alert("Unable to get the library database. Please try again later."); // We didn't get the database...? Something must've went wrong, let's just tell the user that cliche "try again later."
        }
    });

    socket.on('saveChangesResponse', (successfullySaved) => {
        if(successfullySaved){
            location.reload();
        }else{
            alert("Your changes failed to save. You may have to reload and start over.");
        }
    });
});

function displayInformationModal(infoType, object, row){
    switch(infoType.toLowerCase()){
        case "student":
            document.getElementById("modal-body").innerHTML = `${((changesMade) ? "<p>Note: You have not saved your changes; this data may be inaccurate.</p>" : "")}<p><b>Name:</b> ${object.name}</p><p><b>Grade:</b> ${object.grade}</p><p><b>Teacher:</b> ${object.teacher}</p><p><b>Student ID:</b> ${object.studentId}</p><p><b>Code used for redemption:</b> ${libraryDatabase.books[row.id].issuanceInformation.codeUsed}</p>`;
            $("#myModal").modal();
            break;
        case "book":
            document.getElementById("modal-body").innerHTML = `${((changesMade) ? "<p>Note: You have not saved your changes; this data may be inaccurate.</p>" : "")}<p><b>Title:</b> ${object.title}</p><p><b>Author:</b> ${object.author}</p><p><b>ISBN:</b> ${object.isbn}</p><p><b>Time Borrowed:</b> ${object.issuanceInformation.timeIssued}</p><p><b>Code used for redemption:</b> ${object.issuanceInformation.codeUsed}</p>`;
            $("#myModal").modal();
            break;
    }
}

function toggleTable(button){
    var tableDiv = document.getElementById("tableDiv");
    tableDiv.innerHTML = '<table id="table" data-search="true" data-pagination="true" data-show-columns="true"></table>'; //  Completely reset the table
    if(showingBookInformation){
        button.innerHTML = "View Books";
        $('#table').bootstrapTable({ // Set up table to display student information
            columns: [{
                field: 'name',
                title: 'Student Name'
            }, {
                field: 'grade',
                title: 'Grade Level'
            }, {
                field: 'teacher',
                title: 'Teacher'
            }, {
                field: 'studentId',
                title: 'Student ID'
            }, {
                field: 'borrowingBookId',
                title: 'ID of Currently Borrowed Book<br />(Click for book\'s information)'
            }],
            data: libraryDatabaseEditable.students,
            onClickCell: function(field, value, row, $element){
                if(field == 'borrowingBookId'){
                    var book = libraryDatabaseEditable.books.filter(book => book.id.toString() == value)[0];
                    displayInformationModal("book", book, row);
                }
            },
            onDblClickCell: function(field, value, row, $element){
                if(confirm("Are you sure you want to edit this?")){
                    var newValue = prompt("What would you like to change this to?", value);
                    if(newValue != ""){
                        console.log(row);
                        var student = libraryDatabaseEditable.students.filter(student => student[field].toString() == value)[0];
                        student[field] = newValue;
                        showingBookInformation = !showingBookInformation;
                        toggleTable(document.getElementById("toggleTable"));
                        changeMade();
                    } else {
                        alert("You did not put anything; it has been left untouched.");
                    }
                }
                $("#table").bootstrapTable('refresh');
            }
        });
        showingBookInformation = false;
    } else {
        button.innerHTML = "View Students";
        $('#table').bootstrapTable({ // Set up the table to display book information again
            columns: [{
                field: 'id',
                title: 'Book ID'
            }, {
                field: 'title',
                title: 'Book Title'
            }, {
                field: 'author',
                title: 'Book Author'
            }, {
                field: 'isbn',
                title: 'ISBN'
            }, {
                field: 'redemptionCode',
                title: 'Code for Redemption'
            }, {
                field: 'issuanceInformation.studentId',
                title: 'Borrower\'s Student ID<br />(Click for student\'s information)'
            }, {
                field: 'issuanceInformation.timeIssued',
                title: 'Time Borrowed'
            }],
            data: libraryDatabaseEditable.books,
            onClickCell: function(field, value, row, $element){
                if(field == 'issuanceInformation.studentId'){
                    var student = libraryDatabaseEditable.students.filter(student => student.studentId.toString() == value)[0];
                    displayInformationModal("student", student, row);
                }
            }, 
            onDblClickCell: function(field, value, row, $element){
                if(confirm("Are you sure you want to edit this?")){
                    var newValue = prompt("What would you like to change this to?", value);
                    if(newValue != "" && !field.includes(".")){
                        libraryDatabaseEditable.books[row.id][field] = newValue;
                        changeMade();
                        showingBookInformation = !showingBookInformation;
                        toggleTable(document.getElementById("toggleTable"));
                    } else if (field.includes(".")) {
                        libraryDatabaseEditable.books[row.id][field.split(".")[0]][field.split(".")[1]] = newValue;
                        changeMade();
                        showingBookInformation = !showingBookInformation;
                        toggleTable(document.getElementById("toggleTable"));
                    } else {
                        alert("You did not put anything; it has been left untouched.");
                    }
                    $("#table").bootstrapTable('refresh');
                }
            }
        });
        showingBookInformation = true;
    }
}

function changeMade(){
    changesMade = true;
    document.getElementById("saveChanges").disabled = false;
}

function clearChanges(){
    if(confirm("Are you sure you want to clear your changes?")){
        location.reload();
    }
}

function saveChanges(){
    if(confirm("Are you sure you want to IRREVERSIBLY save your changes and replace the data you edited in the database?")){
        socket.emit('requestSaveChanges', libraryDatabaseEditable);
    }
}