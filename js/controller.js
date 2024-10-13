document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');

    // Inicializar las tareas al cargar la página
    function loadTasks() {
        taskList.innerHTML = ''; // Limpiar lista
        const tasks = Task.getTasks(); // Obtener tareas desde el modelo
        tasks.forEach(task => renderTask(task));
    }

    // Crear el HTML de una tarea
    function renderTask(task) {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `
            <div>
                <strong>${task.title}</strong> - ${task.description} (Due: ${task.dueDate})
            </div>
            <div class="task-controls">
                <button onclick="toggleComplete('${task.id}')">${task.completed ? 'Uncomplete' : 'Complete'}</button>
                <button onclick="editTask('${task.id}')">Edit</button>
                <button onclick="deleteTask('${task.id}')">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    }

    // Función para marcar/desmarcar una tarea como completada
    window.toggleComplete = function (id) {
        const tasks = Task.getTasks();
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            Task.updateTask(task);  // Actualiza la tarea en LocalStorage
            loadTasks();  // Recargar la lista
        }
    };

    // Función para eliminar una tarea
    window.deleteTask = function (id) {
        Task.deleteTask(id);  // Eliminar tarea del modelo
        loadTasks();  // Recargar la lista
    };

    // Función para editar una tarea
    window.editTask = function (id) {
        const tasks = Task.getTasks();
        const task = tasks.find(t => t.id === id);
        if (task) {
            // Llenar el formulario con los datos de la tarea para editar
            document.getElementById('title').value = task.title;
            document.getElementById('description').value = task.description;
            document.getElementById('dueDate').value = task.dueDate;

            // Actualizar la tarea cuando se envíe el formulario nuevamente
            taskForm.onsubmit = function (event) {
                event.preventDefault();
                task.title = document.getElementById('title').value;
                task.description = document.getElementById('description').value;
                task.dueDate = document.getElementById('dueDate').value;
                Task.updateTask(task);  // Actualizar en el modelo
                loadTasks();  // Recargar la lista
                taskForm.reset();  // Limpiar el formulario
                taskForm.onsubmit = addNewTask;  // Restablecer el comportamiento original del formulario
            };
        }
    };

    // Función para añadir una nueva tarea
    function addNewTask(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const dueDate = document.getElementById('dueDate').value;

        const newTask = new Task(Date.now().toString(), title, description, dueDate);
        Task.addTask(newTask);  // Añadir la tarea al modelo

        loadTasks();  // Recargar la lista
        taskForm.reset();  // Limpiar el formulario
    }

    // Añadir evento submit al formulario
    taskForm.addEventListener('submit', addNewTask);

    // Cargar las tareas al inicio
    loadTasks();
});
