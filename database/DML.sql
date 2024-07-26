-- Select statements to see table information
SELECT * FROM TourGuides;

SELECT * FROM Tourists;

SELECT * FROM Tours;

SELECT * FROM Locations;

SELECT * FROM LocationTypes;

SELECT * FROM TourGuides_has_Tours;

SELECT * FROM Tourists_has_Tours;

--Insert statements to insert new row into the tables
INSERT INTO TourGuides (baseLocation, firstName, middleName, lastName, yearsAsGuide, hourlyRate)
VALUES (:baseLocationIdInput, :fNameInput, :mNameInput, :lNameInput, :yearsAsGuideInput, :hourlyRateInput);

INSERT INTO Tourists (firstName, middleName, lastName, toursAttended, email, phoneNumber)
VALUES (:fNameInput, :mNameInput, :lNameInput, :toursAttendedInput, :emailInput, :phoneNumberInput);
       

INSERT INTO Locations (address, idLocationType)
VALUES (:addressInput, :idLocationTypeInput);
    
INSERT INTO LocationTypes (locationType, description)
VALUES (:locationTypeInput, :descriptionInput);
        
INSERT INTO Tours (numberOfTourist, date, idLocation)
VALUES (:numberOfTouristInput, :dateInput, :idLocationInput);    

INSERT INTO TourGuides_have_Tours (idTour, idTourGuide)
VALUES (:idTourInput, :idTourGuideInput); 

INSERT INTO Tourists_have_Tours (idTour, idTourist)
VALUES (:idTourInput, :idTouristInput);
 
 -- Update statements to update records
UPDATE TourGuides SET baseLocation = :baseLocationIdInput, firstName = :fNameInput, middleName = :mNameInput, lastName = :lNameInput, yearsAsGuide = :yearsAsGuideInput, hourlyRate = :hourlyRateInput WHERE idTourGuide = :idTourGuide_FROM_UPDATE_FORM;

UPDATE Tourists SET firstName = :fNameInput, middleName = :mNameInput, lastName = :lNameInput, toursAttended = :toursAttendedInput, email = :emailInput, phoneNumber = :phoneNumberInput WHERE idTourist = :idTourist_FROM_UPDATE_FORM;      

UPDATE Locations SET address = :addressInput, idLocationType = :idLocationTypeInput WHERE idLocation = :idLocation_FROM_UPDATE_FORM;
    
UPDATE LocationTypes SET locationType = :locationTypeInput, description = :descriptionInput WHERE idLocationType = :idLocationType_FROM_UPDATE_FORM;
        
UPDATE Tours SET numberOfTourist = :numberOfTouristInput, date = :dateInput, idLocation = :idLocationInput WHERE :idTour_FROM_UPDATE_FORM;
 -- Excluding the intersection tables from update statements since it may make more sense to delete a record from these instead of updating them

-- Delete statements to delete records
DELETE FROM TourGuides WHERE idTourGuide = :idTourGuide_FROM_DELETE_FORM;

DELETE FROM Tourists WHERE idTourist = :idTourist_FROM_DELETE_FORM;      

DELETE FROM Locations WHERE idLocation = :idLocation_FROM_DELETE_FORM;
    
DELETE FROM LocationTypes WHERE idLocationType = :idLocationType_FROM_DELETE_FORM;
        
DELETE FROM Tours WHERE :idTour_FROM_UPDATE_FORM;

-- Delete tour from tour guide's assignments
DELETE FROM TourGuides_have_Tours WHERE idTour = :idTour_FROM_DELETE_TourGuides_have_Tours_FORM AND idTourGuide = :idTourGuide_FROM_DELETE_TourGuides_have_Tours_FORM;

-- Delete tour from tourist's assignments
DELETE FROM Tourists_have_Tours WHERE idTour = :idTour_FROM_DELETE_Tourists_have_Tours_FORM AND idTourist = :idTourist_FROM_DELETE_Tourists_have_Tours_FORM;
