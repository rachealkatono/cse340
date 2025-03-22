-- Task 1: Insert a new account record
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Task 2: Modify Tony Stark’s account_type to 'Admin'
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- Task 3: Delete Tony Stark’s record
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- Task 4: Modify "GM Hummer" description
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Task 5: Inner join to select make, model, and classification name for 'Sport' category
SELECT 
    inventory.inv_make, 
    inventory.inv_model, 
    classification.classification_name
FROM 
    inventory
INNER JOIN 
    classification
ON 
    inventory.classification_id = classification.classification_id
WHERE 
    classification.classification_name = 'Sport';
-- Task 6: Update inventory image paths
UPDATE inventory
SET    
    inv_image = REPLACE(inv_image, '/images/vehicles/vehiclesvehicles/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/vehicles/vehiclesvehicles/', '/images/vehicles/');
