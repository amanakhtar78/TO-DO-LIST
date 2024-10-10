from flask import Flask, request, jsonify
from flask_cors import CORS
import pyodbc

app = Flask(__name__)
CORS(app)

# Database connection function
def get_db_connection():
    server = 'LAPTOP-KCF51Q02\\SQLEXPRESS'
    database = 'task_manager_db'
    username = 'sa'
    password = '12341234as'
    
    # Create the connection string
    connection_string = f'DRIVER={{SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password}'
    
    # Return a new connection to the database
    return pyodbc.connect(connection_string)

# Create a new task
@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    title = data['title']
    description = data['description']

    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("INSERT INTO Tasks (title, description) VALUES (?, ?)", (title, description))
    connection.commit()
    cursor.close()
    connection.close()

    return jsonify({'message': 'Task created successfully'}), 201

# Get all tasks
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM Tasks")
    tasks = cursor.fetchall()
    cursor.close()
    connection.close()

    # Define a function to format datetime
    def format_datetime(dt):
        return dt.strftime('%Y-%m-%d %H:%M:%S') if dt else None

    # Prepare the response
    return jsonify([
        {
            'id': row[0],
            'title': row[1],
            'description': row[2],
            'created_at': format_datetime(row[3]),
            'updated_at': format_datetime(row[4])  # Corrected indexing for updated_at
        } for row in tasks
    ]), 200

# Get task by ID
@app.route('/api/tasks/<int:id>', methods=['GET'])
def get_task(id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM Tasks WHERE id = ?", (id,))
    task = cursor.fetchone()
    cursor.close()
    connection.close()

    if task:
        return jsonify({
            'id': task[0],
            'title': task[1],
            'description': task[2],
            'created_at': task[3].strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': task[4].strftime('%Y-%m-%d %H:%M:%S')
        }), 200
    else:
        return jsonify({'message': 'Task not found'}), 404

# Update a task
@app.route('/api/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    data = request.get_json()
    title = data['title']
    description = data['description']

    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("UPDATE Tasks SET title = ?, description = ? WHERE id = ?", (title, description, id))
    connection.commit()
    cursor.close()
    connection.close()

    return jsonify({'message': 'Task updated successfully'}), 200

# Delete a task
@app.route('/api/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM Tasks WHERE id = ?", (id,))
    connection.commit()
    cursor.close()
    connection.close()

    return jsonify({'message': 'Task deleted successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
