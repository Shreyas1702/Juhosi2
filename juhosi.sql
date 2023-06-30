show databases;
use juhosi;
show tables;

create table user(id int not null AUTO_INCREMENT , 
username varchar(20)  NOT NULL,
password varchar(20)  NOT NULL,
phone numeric(10)  NOT NULL unique,
compname varchar(20) NOT NULL,
PRIMARY KEY (id) 
);

insert into user(username , password ,phone , compname) values("Jason" , "123456789" , 8446123369 , "Jet Technologies"); 

insert into user(id ,username , password ,phone , compname) values(17,"Jack" , "123456789" , 8446923369 , "Jet Technologies"); 


desc OrderItem;
DELETE FROM user WHERE username = "Jason";


show tables;

desc ProductInfo;

select * from ProductInfo;

select * from user;

select id from ProductInfo where species like "Laptop";