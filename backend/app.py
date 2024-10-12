from flask import Flask, request, jsonify
from flask_cors import CORS
from flasgger import Swagger
import pyodbc
import os
from dotenv import load_dotenv
import logging

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)
swagger = Swagger(app)  # Initialize Swagger

# Database connection function
def get_db_connection():
    server = os.getenv('DB_SERVER')
    database = os.getenv('DB_DATABASE')
    username = os.getenv('DB_USERNAME')
    password = os.getenv('DB_PASSWORD')
    
    connection_string = (
        f'DRIVER={{SQL Server}};'
        f'SERVER={server};'
        f'DATABASE={database};'
        f'UID={username};'
        f'PWD={password}'
    )
    
    return pyodbc.connect(connection_string)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/api/tasks', methods=['POST'])
def create_task():
    """
    Create a new task
    ---
    parameters:
      - name: task
        in: body
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
              example: "New Task"
            description:
              type: string
              example: "Task Description"
    responses:
      201:
        description: Task created successfully
      400:
        description: Title is required
      500:
        description: Error creating task
    """
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')

    if not title:
        return jsonify({'message': 'Title is required'}), 400

    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("{CALL sp_InsertTask (?, ?)}", (title, description))
        row = cursor.fetchone()
        connection.commit()
        if row:
            new_task_id = row[0]
            logger.info(f"Task created successfully with ID: {new_task_id}")
            return jsonify({'message': 'Task created successfully', 'id': new_task_id}), 201
        else:
            logger.error("No Task ID returned from stored procedure.")
            return jsonify({'message': 'Task created, but no ID returned.'}), 201
    except Exception as e:
        connection.rollback()
        logger.error(f"Error creating task: {e}")
        return jsonify({'message': 'Error creating task', 'error': str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """
    Get all tasks
    ---
    responses:
      200:
        description: A list of tasks
      500:
        description: Error fetching tasks
    """
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("{CALL sp_GetAllTasks}")
        columns = [column[0] for column in cursor.description]
        tasks = []
        for row in cursor.fetchall():
            tasks.append(dict(zip(columns, row)))
        return jsonify(tasks), 200
    except Exception as e:
        return jsonify({'message': 'Error fetching tasks', 'error': str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/tasks/<int:id>', methods=['GET'])
def get_task(id):
    """
    Get a task by ID
    ---
    parameters:
      - name: id
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Task found
      404:
        description: Task not found
      500:
        description: Error fetching task
    """
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("{CALL sp_GetTaskById (?)}", (id,))
        row = cursor.fetchone()
        if row:
            columns = [column[0] for column in cursor.description]
            task = dict(zip(columns, row))
            return jsonify(task), 200
        else:
            return jsonify({'message': 'Task not found'}), 404
    except Exception as e:
        return jsonify({'message': 'Error fetching task', 'error': str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    """
    Update a task
    ---
    parameters:
      - name: id
        in: path
        required: true
        type: integer
      - name: task
        in: body
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
              example: "Updated Task"
            description:
              type: string
              example: "Updated Description"
    responses:
      200:
        description: Task updated successfully
      404:
        description: Task not found
      400:
        description: Title is required
      500:
        description: Error updating task
    """
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')

    if not title:
        return jsonify({'message': 'Title is required'}), 400

    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("{CALL sp_UpdateTask (?, ?, ?)}", (id, title, description))
        connection.commit()
        if cursor.rowcount == 0:
            return jsonify({'message': 'Task not found'}), 404
        return jsonify({'message': 'Task updated successfully'}), 200
    except Exception as e:
        connection.rollback()
        return jsonify({'message': 'Error updating task', 'error': str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    """
    Delete a task
    ---
    parameters:
      - name: id
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Task deleted successfully
      404:
        description: Task not found
      500:
        description: Error deleting task
    """
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        cursor.execute("{CALL sp_DeleteTask (?)}", (id,))
        connection.commit()
        if cursor.rowcount == 0:
            return jsonify({'message': 'Task not found'}), 404
        return jsonify({'message': 'Task deleted successfully'}), 200
    except Exception as e:
        connection.rollback()
        return jsonify({'message': 'Error deleting task', 'error': str(e)}), 500
    finally:
        cursor.close()
        connection.close()

if __name__ == '__main__':
    app.run(debug=True)
