CREATE DATABASE task_manager_db;
USE task_manager_db;

CREATE TABLE tasks (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);
--Table Confirm
select * from tasks

INSERT INTO tasks (title, description)
VALUES ('Test Task', 'This is a test description for the task.');

-- Create a view for the Tasks table
CREATE VIEW vw_Tasks AS
SELECT 
    id,
    title,
    description,
    created_at,
    updated_at
FROM 
    tasks;

	-- Stored Procedure to Insert a New Task
CREATE PROCEDURE sp_InsertTask
    @Title VARCHAR(255),
    @Description TEXT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO tasks (title, description)
    VALUES (@Title, @Description);

    SELECT SCOPE_IDENTITY() AS NewTaskID; 
END
GO

EXEC sp_InsertTask @Title = 'Test Task', @Description = 'This is a test description for the task.';


-- Stored Procedure to Retrieve All Tasks
CREATE PROCEDURE sp_GetAllTasks
AS
BEGIN
    SELECT * FROM vw_Tasks;
END
GO

-- Stored Procedure to Retrieve a Task by ID
CREATE PROCEDURE sp_GetTaskById
    @Id INT
AS
BEGIN
    SELECT * FROM vw_Tasks
    WHERE id = @Id;
END
GO

-- Stored Procedure to Update a Task
CREATE PROCEDURE sp_UpdateTask
    @Id INT,
    @Title VARCHAR(255),
    @Description TEXT
AS
BEGIN
    UPDATE tasks
    SET 
        title = @Title,
        description = @Description,
        updated_at = GETDATE()
    WHERE id = @Id;
END
GO

-- Stored Procedure to Delete a Task
CREATE PROCEDURE sp_DeleteTask
    @Id INT
AS
BEGIN
    DELETE FROM tasks
    WHERE id = @Id;
END
GO

-- Drop the existing stored procedure if it exists
IF OBJECT_ID('sp_InsertTask', 'P') IS NOT NULL
    DROP PROCEDURE sp_InsertTask;
GO

