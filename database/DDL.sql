
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

/* Create the Tables TourGuides, Tourists, Locations, Tours
and Location Types. */

CREATE OR REPLACE TABLE LocationTypes (
    idLocationType int NOT NULL AUTO_INCREMENT,
    locationType varchar(145) NOT NULL,
    description varchar(545) NOT NULL,
    PRIMARY KEY(idLocationType)    
);

CREATE OR REPLACE TABLE Locations (
    idLocation int NOT NULL AUTO_INCREMENT,
    address varchar(50) NOT NULL,
    idLocationType int,
    PRIMARY KEY(idLocation), 
    FOREIGN KEY(idLocationType) REFERENCES LocationTypes(idLocationType)
ON DELETE CASCADE);

CREATE OR REPLACE TABLE TourGuides (
    idTourGuide int NOT NULL AUTO_INCREMENT,
    baseLocation int NULL, 
    firstName varchar(50) NOT NULL,
    middleName varchar(50), 
    lastName varchar(50) NOT NULL,
    yearsAsGuide int NOT NULL,
    hourlyRate decimal NOT NULL,
    PRIMARY KEY(idTourGuide),
    FOREIGN KEY(baseLocation) REFERENCES Locations(idLocation)
);

CREATE OR REPLACE TABLE Tourists (
    idTourist int NOT NULL AUTO_INCREMENT,
    firstName varchar(50) NOT NULL,
    middleName varchar(50),
    lastName varchar(50) NOT NULL,
    toursAttended int NOT NULL,
    email varchar(50) NOT NULL,
    phoneNumber varchar(50) NOT NULL,
    PRIMARY KEY(idTourist)
);


CREATE OR REPLACE TABLE Tours (
    idTour int NOT NULL AUTO_INCREMENT,
    numberOfTourist int NOT NULL,
    date date NOT NULL,
    idLocation int,
    PRIMARY KEY(idTour),
    FOREIGN KEY(idLocation) REFERENCES Locations(idLocation)
ON DELETE CASCADE);

-- Create the intersection tables to build M:M Relationships
-- TourGuides and Tours M:M Intersection Table

CREATE OR REPLACE TABLE TourGuides_have_Tours (
    idTourGuides_have_Tours int NOT NULL AUTO_INCREMENT,
    idTour int,
    idTourGuide int,
    PRIMARY KEY(idTourGuides_have_Tours),
    FOREIGN KEY(idTour) REFERENCES Tours(idTour) ON DELETE CASCADE,
    FOREIGN KEY(idTourGuide) REFERENCES TourGuides(idTourGuide)
ON DELETE CASCADE);

-- Tourists and Tours M:M Intersection Table

CREATE OR REPLACE TABLE Tourists_have_Tours (
    idTourists_have_Tours int NOT NULL AUTO_INCREMENT,
    idTour int,
    idTourist int,
    PRIMARY KEY(idTourists_have_Tours),
    FOREIGN KEY(idTour) REFERENCES Tours(idTour) ON DELETE CASCADE,
    FOREIGN KEY(idTourist) REFERENCES Tourists(idTourist)
ON DELETE CASCADE);

-- Insert Section

INSERT INTO TourGuides (baseLocation, firstName, middleName, lastName, yearsAsGuide, hourlyRate)
VALUES (2, 'Mark', 'James', 'Robinson', 1, 10),
        (3, 'Timmy', NULL, 'Turner', 10, 12.34), 
        (1, 'Oprah', 'Gail', 'Winfrey', 23, 120.38), 
        (1, 'Joe', 'Average', 'Guy', 0, 7.25), 
        (3, 'Taylor', 'Alison', 'Swift', 7, 22.12);


INSERT INTO Tourists (firstName, middleName, lastName, toursAttended, email, phoneNumber)
VALUES ('James', 'Michael', 'Smith', 5, 'James.Smith@gmail.com', '867-867-5309'),
        ('Tyler', NULL, 'Vance', 2, 'vancety@oregonstate.edu', '123-456-7899'),
        ('Matthew', NULL, 'Hearne', 7, 'hearnem@oregonstate.edu', '098-765-4321'),
        ('Ariel', 'Little', 'Mermaid', 1, 'ariel@underthesea.com', '111-111-1111');

INSERT INTO Locations (address, idLocationType)
VALUES ('123 Potato Stree San Diego CA 92101', 1),
        ('Smithsonian Institution, 600 Maryland Ave SW, Washington, DC 20024', 2),
        ('20 W 34th St., New York, NY 10001', 3),
        ('US Highway 101 Golden Gate Brg, San Francisco, CA', 3);

INSERT INTO LocationTypes (locationType, description)
VALUES ('Beach', 'A beach along a body of water'),
        ('Museum', 'Museum'),
        ('Historic Landmark', 'A building, statue, natural structure, or other notable landmark');

INSERT INTO Tours (numberOfTourist, date, idLocation)
VALUES (6, 20230716, 1),
        (2, 20230717, 3),
        (2, 20230718, 4),
        (3, 20230718, 2),
        (1, 20230720, 2);

INSERT INTO TourGuides_have_Tours (idTour, idTourGuide)
VALUES (1, 1),  
        (1, 2),
        (2, 3),
        (3, 4),
        (4, 4),
        (5, 5),
        (6, 5);

INSERT INTO Tourists_have_Tours (idTour, idTourist)
VALUES (2, 1), 
        (2, 4),
        (4, 2),
        (4, 3),
        (5, 4);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;