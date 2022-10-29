module.exports = `CREATE DEFINER=root@localhost PROCEDURE addEmployee(
IN _id INT,
IN _first_name varchar(45),
IN _last_name varchar(45),
IN _role_id INT,
IN _manager_id INT
)
BEGIN
	IF _id = 0 THEN 
		INSERT INTO employee(first_name,last_name,role_id,manager_id)
        VALUES (_first_name,_last_name,_role_id,_manager_id);
        
        SET _id = LAST_INSERT_ID();
	ELSE 
		UPDATE employee
        SET
        id = _id,
        first_name = _first_name,
		last_name= _last_name,
        role_id = _role_id,
        manager_id = _manager_id
        WHERE id = _id;
	END IF;
    
    SELECT _id AS id;

END`