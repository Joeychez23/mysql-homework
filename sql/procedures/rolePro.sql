module.exports = `CREATE DEFINER=root@localhost PROCEDURE addRole(
IN _id INT,
IN _title varchar(45),
IN _salary INT,
IN _department_id INT
)
BEGIN
	IF _id = 0 THEN 
		INSERT INTO role(title,salary,department_id)
        VALUES (_title,_salary,_department_id);
        
        SET _id = LAST_INSERT_ID();
	ELSE 
		UPDATE role
        SET
        id = _id,
        title = _title,
		salary = _salary,
        department_id = _department_id
        WHERE id = _id;
	END IF;
    
    SELECT _id AS id;

END`