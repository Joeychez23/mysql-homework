module.exports = `CREATE TABLE employeeData (
  id int NOT NULL AUTO_INCREMENT,
  first_name varchar(45) DEFAULT NULL,
  last_name varchar(45) DEFAULT NULL,
  title varchar(45) DEFAULT NULL,
  department varchar(45) DEFAULT NULL,
  salary varchar(45) DEFAULT NULL,
  manager varchar(45) DEFAULT NULL,
  PRIMARY KEY (id)
)`