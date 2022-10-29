module.exports = `CREATE DEFINER=root@localhost PROCEDURE addFullEmployee(
IN _id INT,
IN _first_name varchar(45),
IN _last_name varchar(45),
IN _title varchar(45),
IN _department varchar(45),
IN _salary INT,
IN _manager varchar(45)
)
BEGIN
	IF _id = 0 THEN 
		INSERT INTO employeeData(first_name,last_name,title,department,salary,manager)
        VALUES (_first_name,_last_name,_title,_department,_salary,_manager);
        
        SET _id = LAST_INSERT_ID();
	ELSE 
		UPDATE employeeData
        SET
        id = _id,
        first_name = _first_name,
		last_name= _last_name,
        title = _title,
        department = _department,
        salary = _salary,
        manager = _manager
        WHERE id = _id;
	END IF;
    
    SELECT _id AS id;

END `