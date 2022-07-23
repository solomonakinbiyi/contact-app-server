CREATE DATABASE contactdb;

CREATE TABLE users(
    id SERIAL,
    email VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    password VARCHAR(255)
);

CREATE TABLE contacts(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    name VARCHAR(255),
    phone VARCHAR(255),
    houseaddress VARCHAR(255),
    owneremail VARCHAR(255)
);