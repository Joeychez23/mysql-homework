module.exports = `CREATE TABLE role (
  id int NOT NULL AUTO_INCREMENT,
  title varchar(45) DEFAULT NULL,
  salary int NOT NULL,
  department_id varchar(45) DEFAULT NULL,
  PRIMARY KEY (id)
)`
