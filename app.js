
/*
    # Citation for the following file:
    # Date: 8/12/2023
    # Copied from and adapted from the node.js starter code:
    # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

/*
    SETUP
*/
var express = require('express');       // We are using the express library for the web server
var app     = express();                // We need to instantiate an express object to interact with the server in our code
PORT        = 44299;                    // Set a port number at the top so it's easy to change in the future
// Database
var db = require('./database/db-connector')

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// JSON 
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

/*
    ROUTES
*/
/////////////////////INDEX
app.get('/', function(req, res)
    {
        res.render('index');                    
    });         


////////////////////////////TOURISTS
// Read Tourists
app.get('/tourists', function (req, res) {
    let query = "SELECT * FROM Tourists;"; 
    db.pool.query(query, function (error, rows, fields) {
        if (error) {
            console.error('Error fetching tour data:', error);
            res.sendStatus(500); 
        } else {
            res.render('tourists', { data: rows }); 
        }
    });

});

// Create Tourist
app.post('/add-tourist-ajax', function(req, res) 
{
    let data = req.body;

    // Check for null inputs
    let toursAttended = parseInt(data.toursAttended);
    if (isNaN(toursAttended))
    {
        toursAttended = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Tourists (firstName, middleName, lastName, toursAttended, email, phoneNumber) VALUES ('${data.firstName}', '${data.middleName}', '${data.lastName}', ${toursAttended}, '${data.email}', '${data.phoneNumber}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check error
        if (error) {
            // Log the error 
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // Query the Tourists table
            query2 = `SELECT * FROM Tourists;`;
            db.pool.query(query2, function(error, rows, fields){
                // Check for error with second query
                if (error) {
                    // Log the error
                    console.log(error);
                    res.sendStatus(400);
                }
                // Send results of query back
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// Delete Tourist
app.delete('/delete-tourist-ajax/', function(req,res,next){
    let data = req.body;
    let idTourist = parseInt(data.idTourist);
    let deleteTourist = `DELETE FROM Tourists WHERE idTourist = ?`;
          // Run delete query
        db.pool.query(deleteTourist, [idTourist], function(error, rows, fields){
            if (error) {
            console.log(error);
            res.sendStatus(400);
            }  
            else
            {
                res.sendStatus(204);
            }
        })       
    }
  );

// Update tourist
app.put('/put-tourist-ajax', function(req,res,next){
let data = req.body;
let toursAttended = parseInt(data.toursAttended);
let email = data.email;
let phoneNumber = data.phoneNumber;
let tourist = parseInt(data.fullname);

let queryUpdateTourist = `UPDATE Tourists SET Tourists.toursAttended = ?, Tourists.email = ?, Tourists.phoneNumber = ? WHERE Tourists.idTourist = ?`;
let selectTourist = `SELECT * FROM Tourists WHERE idTourist = ?`;

        // Run the update query
        db.pool.query(queryUpdateTourist, [toursAttended, email, phoneNumber, tourist], function(error, rows, fields){
            if (error) {
            // Log the error
            console.log(error);
            res.sendStatus(400);
            }
            // Run query to show updated tourist
            else
            {
                db.pool.query(selectTourist, [tourist], function(error, rows, fields) {
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

/////////////////////////////TOURS
/*
    # Citation for the following function:
    # Date: 8/12/2023
    # Copied from and adapted from ed Discusion about how to format a date for the front end:
    # Source URL: https://edstem.org/us/courses/40261/discussion/3318397
*/
// Read Tours
app.get('/tours', function (req, res) {
    let queryTours = 'SELECT Tours.idTour, Tours.numberOfTourist, DATE_FORMAT(Tours.date, "%Y-%m-%d") AS "date", Tours.idLocation, Locations.idLocation, Locations.address, Locations.idLocationType FROM Tours JOIN Locations ON Tours.idLocation = Locations.idLocation ORDER BY Tours.idTour ASC;'; // Define our query
    let queryLocations = "SELECT * FROM Locations;"
    db.pool.query(queryTours, function (error, rows, fields) {
        if (error) {
            console.error('Error fetching tours data:', error);
            res.sendStatus(500); 
        } else {
            let tours = rows;
            db.pool.query(queryLocations, function (error, rows, fields) {
                if (error) {
                    console.error('Error fetching location data:', error);
                    res.sendStatus(500);
                }
                else {
                    let locations = rows;
                    res.render('tours', { data: tours, locations: locations });
                }
        }); 
        }
    });

});

// Add Tour
app.post('/add-tour-ajax', function(req, res) 
{
    let data = req.body;

    // Check null values
    let numberOfTourists = parseInt(data.numberOfTourists);
    if (isNaN(numberOfTourists))
    {
        numberOfTourists = 'NULL'
    }

    let idLocation = parseInt(data.idLocation);
    if (isNaN(numberOfTourists))
    {
        idLocation = 'NULL'
    }

    // Create add tour query
    query1 = `INSERT INTO Tours (numberOfTourist, date, idLocation) VALUES ('${numberOfTourists}', '${data.date}', '${idLocation}')`;
    db.pool.query(query1, function(error, rows, fields){
        if (error) {
            // Log the error
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // Select Tours table and format the date value for the date
            /*
                # Citation for the following function:
                # Date: 8/12/2023
                # Copied from and adapted from ed Discusion about how to format a date for the front end:
                # Source URL: https://edstem.org/us/courses/40261/discussion/3318397
            */
            query2 = 'SELECT Tours.idTour, Tours.numberOfTourist, DATE_FORMAT(Tours.date, "%Y-%m-%d") AS "date", Tours.idLocation, Locations.idLocation, Locations.address, Locations.idLocationType FROM Tours JOIN Locations ON Tours.idLocation = Locations.idLocation ORDER BY Tours.idTour ASC;';
            db.pool.query(query2, function(error, rows, fields){

                if (error) {                   
                    // Log the error
                    console.log(error);
                    res.sendStatus(400);
                }
                else{
                   res.send(rows);
                }
            })
        }
    })
});

// Delete Tour
app.delete('/delete-tour-ajax/', function(req,res,next){
    let data        = req.body;
    let idTour      = parseInt(data.idTour);
    let deleteTour  = `DELETE FROM Tours WHERE idTour = ?`;
    
          // Delete tour
        db.pool.query(deleteTour, [idTour], function(error, rows, fields){
            if (error) {
              // Log the error
            console.log(error);
            res.sendStatus(400);
            }  
            else
            {
                res.sendStatus(204);
            }
        })       
    }
  );

// Update tour
app.put('/put-tour-ajax', function(req,res,next){
    let data            = req.body;
    let idTour          = parseInt(data.idTour);
    let numberOfTourist = parseInt(data.numberOfTourist);
    let date            = data.date;
    
    let queryUpdateTour = `UPDATE Tours SET Tours.numberOfTourist = ?, Tours.date = ? WHERE Tours.idTour = ?`;
    let selectTour = `SELECT * FROM Tours WHERE idTour = ?`;
    
            // Run update tour query
            db.pool.query(queryUpdateTour, [numberOfTourist, date, idTour], function(error, rows, fields){
                if (error) {
                // Log the error
                console.log(error);
                res.sendStatus(400);
                }
                // Run update for table in front end
                else
                {
                    db.pool.query(selectTour, [idTour], function(error, rows, fields) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
    })});


/////////////////// TourGuides_have_Tours
// Read Tour Guide Assignments
/*
    # Citation for the following function:
    # Date: 8/12/2023
    # Copied from and adapted from ed Discusion about how to format a date for the front end:
    # Source URL: https://edstem.org/us/courses/40261/discussion/3318397
*/
app.get('/tourGuides_have_Tours', function (req, res) {
    let queryTourGuides_have_Tours  = 'SELECT TourGuides_have_Tours.idTourGuides_have_Tours, Tours.idTour, DATE_FORMAT(Tours.date, "%Y-%m-%d") AS "date", TourGuides.firstName, TourGuides.middleName, TourGuides.lastName FROM TourGuides_have_Tours LEFT JOIN Tours ON TourGuides_have_Tours.idTour = Tours.idTour LEFT JOIN TourGuides ON TourGuides_have_Tours.idTourGuide = TourGuides.idTourGuide';  
    let queryTourGuides             = "SELECT * FROM TourGuides;"
    let queryTours                  = 'SELECT * FROM Tours;'
    db.pool.query(queryTourGuides_have_Tours, function (error, rows, fields) {
        if (error) {
            console.error('Error fetching Tour Guide Assignments:', error);
            res.sendStatus(500); 
        } else {
            let tourGuideAssignments = rows;
            db.pool.query(queryTourGuides, function (error, rows, fields) {
                if (error) {
                    console.error('Error fetching tour guide data:', error);
                    res.sendStatus(500);
                }
                else {
                    let tourGuides = rows;
                    db.pool.query(queryTours, function (error, rows, fields) {
                    if (error) {
                        console.error('Error fetching tour data:', error);
                        res.sendStatus(500);
                    }
                    else {
                        let tours = rows;
                        res.render('tourGuides_have_Tours', { tourGuideAssignments: tourGuideAssignments, tourGuides: tourGuides, tours: tours});
                    }
                });
                }
        }); 
        }
    });

});

// Create Tour Guide Assignments
app.post('/add-tourGuides_have_Tours-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let idTour = parseInt(data.idTour);
    console.log(idTour);
    if (isNaN(idTour))
    {
        idTour = 'NULL'
    }

    let idTourGuide = parseInt(data.idTourGuide);
    if (isNaN(idTourGuide))
    {
        idTourGuide = 'NULL'
    }

    // Create new record
    query1 = `INSERT INTO TourGuides_have_Tours (idTour, idTourGuide) VALUES ('${idTour}', '${idTourGuide}')`;
    db.pool.query(query1, function(error, rows, fields){

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            /*
                # Citation for the following function:
                # Date: 8/12/2023
                # Copied from and adapted from ed Discusion about how to format a date for the front end:
                # Source URL: https://edstem.org/us/courses/40261/discussion/3318397
            */
            let queryTourGuides_have_Tours = 'SELECT TourGuides_have_Tours.idTourGuides_have_Tours, Tours.idTour, DATE_FORMAT(Tours.date, "%Y-%m-%d") AS "date", TourGuides.firstName, TourGuides.middleName, TourGuides.lastName FROM TourGuides_have_Tours LEFT JOIN Tours ON TourGuides_have_Tours.idTour = Tours.idTour LEFT JOIN TourGuides ON TourGuides_have_Tours.idTourGuide = TourGuides.idTourGuide';  
            db.pool.query(queryTourGuides_have_Tours, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else{
                   res.send(rows);
                }
            })
        }
    })
});

// Delete Tour Guide Assignments
// Delete Tour
app.delete('/delete-tourGuides_have_Tours-ajax/', function(req,res,next){
    let data = req.body;
    let idTourGuides_have_Tours = parseInt(data.idTourGuides_have_Tours);
    let deleteTourGuides_have_Tours = `DELETE FROM TourGuides_have_Tours WHERE idTourGuides_have_Tours = ?`;
    
          // Delete tour guide assignment
        db.pool.query(deleteTourGuides_have_Tours, [idTourGuides_have_Tours], function(error, rows, fields){
            if (error) {
            console.log(error);
            res.sendStatus(400);
            }  
            else
            {
                res.sendStatus(204);
            }
        })       
    }
  );

// Update Tour Guide Assignments
app.put('/put-tourGuides_have_Tours-ajax', function(req,res,next){
    let data                            = req.body;
    let idTourGuides_have_Tours         = parseInt(data.idTourGuides_have_Tours);
    let idTourGuide                     = parseInt(data.idTourGuide);
    let queryUpdateTourGuideAssignments = `UPDATE TourGuides_have_Tours SET TourGuides_have_Tours.idTourGuide = ? WHERE TourGuides_have_Tours.idTourGuides_have_Tours = ?`;
    let selectTourGuideAssignments      = 'SELECT * FROM TourGuides_have_Tours JOIN TourGuides ON TourGuides_have_Tours.idTourGuide = TourGuides.idTourGuide WHERE idTourGuides_have_Tours = ? ';
    
            // Update tour guide assignment
            db.pool.query(queryUpdateTourGuideAssignments, [idTourGuide, idTourGuides_have_Tours], function(error, rows, fields){
                if (error) {
                console.log(error);
                res.sendStatus(400);
                }
                // Update table in front end
                else
                {
                    db.pool.query(selectTourGuideAssignments, [idTourGuides_have_Tours], function(error, rows, fields) {
                        console.log('SECOND QUERY RUN FOR THE TABLE');
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
    })});

////////////////// Tourists_have_Tours
// Read Tourist Assignments
/*
    # Citation for the following function:
    # Date: 8/12/2023
    # Copied from and adapted from ed Discusion about how to format a date for the front end:
    # Source URL: https://edstem.org/us/courses/40261/discussion/3318397
*/
app.get('/tourists_have_Tours', function (req, res) {
    let queryTourist_have_Tours  = 'SELECT Tourists_have_Tours.idTourists_have_Tours, Tours.idTour, DATE_FORMAT(Tours.date, "%Y-%m-%d") AS "date", Tourists.firstName, Tourists.middleName, Tourists.lastName FROM Tourists_have_Tours LEFT JOIN Tours ON Tourists_have_Tours.idTour = Tours.idTour LEFT JOIN Tourists ON Tourists_have_Tours.idTourist = Tourists.idTourist';  
    let queryTourists             = "SELECT * FROM Tourists;"
    let queryTours                  = 'SELECT * FROM Tours;'
    db.pool.query(queryTourist_have_Tours, function (error, rows, fields) {
        if (error) {
            console.error('Error fetching Tourist Assignments:', error);
            res.sendStatus(500); 
        } else {
            let touristAssignments = rows;
            db.pool.query(queryTourists, function (error, rows, fields) {
                if (error) {
                    console.error('Error fetching tourist data:', error);
                    res.sendStatus(500);
                }
                else {
                    let tourist = rows;
                    db.pool.query(queryTours, function (error, rows, fields) {
                    if (error) {
                        console.error('Error fetching tour data:', error);
                        res.sendStatus(500);
                    }
                    else {
                        let tours = rows;
                        res.render('tourists_have_Tours', { touristAssignments: touristAssignments, tourist: tourist, tours: tours});
                    }
                });
                }
        }); 
        }
    });

});
// Create Tourist Assignments
app.post('/add-tourists_have_Tours-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let idTour = parseInt(data.idTour);
    console.log(idTour);
    if (isNaN(idTour))
    {
        idTour = 'NULL'
    }

    let idTourist = parseInt(data.idTourist);
    if (isNaN(idTourist))
    {
        idTourist = 'NULL'
    }

    // Create new record
    query1 = `INSERT INTO Tourists_have_Tours (idTour, idTourist) VALUES ('${idTour}', '${idTourist}')`;
    db.pool.query(query1, function(error, rows, fields){

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            /*
                # Citation for the following function:
                # Date: 8/12/2023
                # Copied from and adapted from ed Discusion about how to format a date for the front end:
                # Source URL: https://edstem.org/us/courses/40261/discussion/3318397
            */
            let queryTourists_have_Tours = 'SELECT Tourists_have_Tours.idTourists_have_Tours, Tours.idTour, DATE_FORMAT(Tours.date, "%Y-%m-%d") AS "date", Tourists.firstName, Tourists.middleName, Tourists.lastName FROM Tourists_have_Tours LEFT JOIN Tours ON Tourists_have_Tours.idTour = Tours.idTour LEFT JOIN Tourists ON Tourists_have_Tours.idTourist = Tourists.idTourist';  
            db.pool.query(queryTourists_have_Tours, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else{
                   res.send(rows);
                }
            })
        }
    })
});

// Delete Tourist Assignments
app.delete('/delete-tourists_have_Tours-ajax/', function(req,res,next){
    let data = req.body;
    let idTourists_have_Tours = parseInt(data.idTourists_have_Tours);
    let deleteTourists_have_Tours = `DELETE FROM Tourists_have_Tours WHERE idTourists_have_Tours = ?`;
    
          // Delete tour guide assignment
        db.pool.query(deleteTourists_have_Tours, [idTourists_have_Tours], function(error, rows, fields){
            if (error) {
            console.log(error);
            res.sendStatus(400);
            }  
            else
            {
                res.sendStatus(204);
            }
        })       
    }
  );

// Update Tourist Assignments
app.put('/put-tourists_have_Tours-ajax', function(req,res,next){
    let data                          = req.body;
    let idTourists_have_Tours         = parseInt(data.idTourists_have_Tours);
    let idTourist                     = parseInt(data.idTourist);
    let queryUpdateTouristAssignments = `UPDATE Tourists_have_Tours SET Tourists_have_Tours.idTourist = ? WHERE Tourists_have_Tours.idTourists_have_Tours = ?`;
    let selectTouristAssignments      = 'SELECT * FROM Tourists_have_Tours JOIN Tourists ON Tourists_have_Tours.idTourist = Tourists.idTourist WHERE idTourists_have_Tours = ? ';
    
            // Update tour guide assignment
            db.pool.query(queryUpdateTouristAssignments, [idTourist, idTourists_have_Tours], function(error, rows, fields){
                if (error) {
                console.log(error);
                res.sendStatus(400);
                }
                // Update table in front end
                else
                {
                    db.pool.query(selectTouristAssignments, [idTourists_have_Tours], function(error, rows, fields) {
                        console.log('SECOND QUERY RUN FOR THE TABLE');
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
    })});


/////////////////Locations
// Read Locations
// GET route for handling the /Location route
app.get('/Locations', function (req, res) {
    let query = "SELECT * FROM Locations JOIN LocationTypes ON Locations.idLocationType = LocationTypes.idLocationType"; // Define our query
    let queryLocationTypes = "SELECT * FROM LocationTypes"
    db.pool.query(query, function (error, rows, fields) {
        if (error) {
            console.error('Error fetching location data:', error);
            res.sendStatus(500); 
        } else {
            let locations = rows;
            db.pool.query(queryLocationTypes, function (error, rows, fields) {
                if (error) {
                    console.error('Error fetching location type data:', error);
                    res.sendStatus(500); 
                } else {
                    let locationTypes = rows;
                    res.render('Locations', { data: locations,  locationTypes: locationTypes}); 
                }
            }); 
        }
    });

});

//Create Locations
app.post('/add-location-ajax/', function(req,res,next){
    let data = req.body;
    
    // Capture NULL values

    let AddresValue = data['Address'];
            
    let locationTypeValue = parseInt(data['LocationType']);
    if (isNaN(locationTypeValue)) {
        locationType = 'NULL'
    }
    
    let queryAddLocation = `INSERT INTO Locations (address, idLocationType)  VALUES (?, ?)`;
    let selectLocation      = `SELECT * FROM Locations JOIN LocationTypes ON Locations.idLocationType = LocationTypes.idLocationType ORDER BY idLocation DESC LIMIT 1`
    
    // Run the 1st query
    db.pool.query(queryAddLocation, [AddresValue, locationTypeValue], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else
        {
            // Run the second query
            db.pool.query(selectLocation, function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

// Delete Locations
app.delete('/delete-location/', function(req,res,next){
    let data = req.body;
    let idLocation = parseInt(data.id);
    let deleteLocations = `DELETE FROM Locations WHERE idLocation = ?`;    
    // Run the 1st query
    db.pool.query(deleteLocations, [idLocation], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
        else {
        console.log("Location " + idLocation + " has been deleted");
        res.sendStatus(204);
        }
    })
});

//Update Locations
app.put('/put-location-ajax/', function(req,res,next){
    let data = req.body;
    
    let idLocation = parseInt(data["idLocation"]);
    let Address = data["Address"];
    let locationType = parseInt(data["locationType"]);
    
    let queryUpdateLocation = `UPDATE Locations SET address = ?, idLocationType = ? WHERE idLocation = ?`;
    let selectLocation      = `SELECT * FROM Locations JOIN LocationTypes ON Locations.idLocationType = LocationTypes.idLocationType WHERE idLocation = ?`
    
    // Run the 1st query
    db.pool.query(queryUpdateLocation, [Address, locationType, idLocation], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else
        {
            // Run the second query
            db.pool.query(selectLocation, [idLocation], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

//////////////// Location Types
// Read location types
app.get('/LocationTypes', function (req, res) {
    let query = "SELECT * FROM LocationTypes;"; // Define our query
    db.pool.query(query, function (error, rows, fields) {
        if (error) {
            console.error('Error fetching tours data:', error);
            res.sendStatus(500); 
        } else {
            res.render('LocationTypes', { data: rows }); 
        }
    });

});


// Create location types
app.post('/add-locationType-ajax/', function(req,res,next){
    let data = req.body;
    
    // Capture NULL values

    let LocationTypeValue = data['LocationType'];
            
    let DescriptionValue = data['Description'];
    
    let queryAddLocationType = `INSERT INTO LocationTypes (locationType, description)  VALUES (?, ?)`;
    let selectLocationType      = `SELECT * FROM LocationTypes ORDER BY idLocationType DESC LIMIT 1`
    
    // Run the 1st query
    db.pool.query(queryAddLocationType, [LocationTypeValue, DescriptionValue], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else
        {
            // Run the second query
            db.pool.query(selectLocationType, function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

// Delete location types
app.delete('/delete-locationType/', function(req,res,next){
    let data = req.body;
    let idLocationType = parseInt(data.id);
    let deleteLocationTypes = `DELETE FROM LocationTypes WHERE idLocationType = ?`;    
    // Run the 1st query
    db.pool.query(deleteLocationTypes, [idLocationType], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
        else {
        console.log("LocationType " + idLocationType + " has been deleted");
        res.sendStatus(204);
        }
    })
});


// Update location types
app.put('/put-locationType-ajax/', function(req,res,next){
    let data = req.body;
    
    let idLocationType = parseInt(data["idLocationType"]);
    let locationType = data["locationType"];
    let description = data["description"];
    
    console.log(description)
    console.log(locationType)
    let queryUpdateLocationType = `UPDATE LocationTypes SET locationType = ?, description = ? WHERE idLocationType = ?`;
    let selectLocationType      = `SELECT * FROM LocationTypes WHERE idLocationType = ?`
    
    // Run the 1st query
    db.pool.query(queryUpdateLocationType, [locationType, description, idLocationType], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else
        {
            // Run the second query
            db.pool.query(selectLocationType, [idLocationType], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

////////////////// Tour Guides
// Read tour guides
app.get('/TourGuides', function (req, res) {
    let query = "SELECT * FROM TourGuides JOIN Locations ON TourGuides.baseLocation = Locations.idLocation;"; // Define our query
    let queryLocations = "SELECT * FROM Locations";
    db.pool.query(query, function (error, rows, fields) {
        if (error) {
            console.error('Error fetching tour guide data:', error);
            res.sendStatus(500); 
        } else {
            let tourGuides = rows;
            db.pool.query(queryLocations, function (error, rows, fields) {
                if (error) {
                    console.error('Error fetching location data:', error);
                    res.sendStatus(500); 
                } else {
                    let locations = rows;
                    res.render('TourGuides', { data: tourGuides, locations: locations }); 
                }
            
        })
    }
});
});

// Create tour guides
app.post('/add-tourGuide-ajax/', function(req,res,next){
    let data = req.body;
    
    // Capture NULL values

    let baseLocationtValue = data['baseLocation'];
    let firstNameValue = data['firstName'];
    let middleNameValue = data['middleName'];
    let lastNameValue = data['lastName'];
    let yearsAsGuideValue = data['yearsAsGuide'];
    let hourlyRateValue = data['hourlyRate'];
    
    let queryAddTourGuide = `INSERT INTO TourGuides (baseLocation, firstName, middleName, lastName, yearsAsGuide, hourlyRate)  VALUES (?, ?, ?, ?, ?, ?)`;
    let selectTourGuide      = `SELECT * FROM TourGuides JOIN Locations ON TourGuides.baseLocation = Locations.idLocation;`
    
    // Run the 1st query
    db.pool.query(queryAddTourGuide, [baseLocationtValue, firstNameValue, middleNameValue, lastNameValue, yearsAsGuideValue, hourlyRateValue], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else
        {
            // Run the second query
            db.pool.query(selectTourGuide, function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

// Delete tour guides
app.delete('/delete-tourGuide/', function(req,res,next){
    let data = req.body;
    let idTourGuide = parseInt(data.idTourGuide);
    let deleteTourGuide = `DELETE FROM TourGuides WHERE idTourGuide = ?`;    
    // Run the 1st query
    db.pool.query(deleteTourGuide, [idTourGuide], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
        else {
        console.log("Location " + idTourGuide + " has been deleted");
        res.sendStatus(204);
        }
    })
});

// Update tour guides
app.put('/put-tourGuide-ajax/', function(req,res,next){
    let data = req.body;
    
    let idTourGuide = parseInt(data.idTourGuide);
    let baseLocation = parseInt(data.baseLocation);
    let firstName = data.firstName;
    let middleName = data.middleName;
    let lastName = data.lastName;
    let yearsAsGuide = data.yearsAsGuide;
    let hourlyRate = data.hourlyRate;
    
    let queryUpdateTourGuide = `UPDATE TourGuides SET baseLocation = ?, firstName = ?, middleName = ?, lastName = ?, yearsAsGuide = ?, hourlyRate = ? WHERE idTourGuide = ?`;
    let selectTourGuide      = `SELECT * FROM TourGuides JOIN Locations ON TourGuides.baseLocation = Locations.idLocation WHERE TourGuides.idTourGuide = ?;`
    
    // Run the 1st query
    db.pool.query(queryUpdateTourGuide, [baseLocation, firstName, middleName, lastName, yearsAsGuide, hourlyRate, idTourGuide], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }

        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else
        {
            // Run the second query
            db.pool.query(selectTourGuide, [idTourGuide], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://flip1.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.')
});
