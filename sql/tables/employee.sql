module.exports = `CREATE TABLE employee (
  id int NOT NULL AUTO_INCREMENT,
  first_name varchar(45) DEFAULT NULL,
  last_name varchar(45) DEFAULT NULL,
  role_id varchar(45) DEFAULT NULL,
  manager_id varchar(45) DEFAULT NULL,
  PRIMARY KEY (id)
)`