-- create data base
CREATE DATABASE task_manager_db;
USE task_manager_db;

-- create table
CREATE TABLE tasks (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- inset test values
INSERT INTO tasks (title, description)
VALUES ('Test Task', 'This is a test description for the task.');

-- test table 
select * from tasks