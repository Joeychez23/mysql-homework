module.exports = `CREATE DEFINER=root@localhost PROCEDURE addDepart(
IN _id INT,
IN _name varchar(45)
)
BEGIN
	IF _id = 0 THEN 
		INSERT INTO department(name)
        VALUES (_name);
        
        SET _id = LAST_INSERT_ID();
	ELSE 
		UPDATE department
        SET
        id = _id,
        name = _name
        WHERE id = _id;
	END IF;
    
    SELECT _id AS id;

END`