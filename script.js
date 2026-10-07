// ========================================
// 🕷️ TASK MANAGEMENT APP
// Step 9 - Overdue + Today Status
// ========================================

// ========================================
// GET HTML ELEMENTS
// ========================================

const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");
const taskCategory = document.getElementById("taskCategory");
const addTaskBtn = document.getElementById("addTaskBtn");
const completionRate = document.getElementById("completionRate");
const remainingTasks = document.getElementById("remainingTasks");
const clearCompletedBtn =document.getElementById("clearCompletedBtn");
const exportTasksBtn = document.getElementById("exportTasksBtn");
const importTasksBtn = document.getElementById("importTasksBtn");
const importTasksInput = document.getElementById("importTasksInput");

const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");


const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");
const overdueTasks = document.getElementById("overdueTasks");

const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const sortSelect = document.getElementById("sortSelect");
const categoryFilter = document.getElementById("categoryFilter");
// ========================================
// LOAD TASKS FROM LOCAL STORAGE
// ========================================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// ========================================
// SAVE TASKS
// ========================================

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// ========================================
// ADD TASK
// ========================================

addTaskBtn.addEventListener("click", addTask);

function addTask() {

    const taskText = taskInput.value.trim();
    const date = taskDate.value;
    const priority = taskPriority.value;
    const category = taskCategory.value;
    // Check empty task
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    // Create task
   const task = {
    id: Date.now(),
    text: taskText,
    date: date,
    priority: priority,
    category: category,
    completed: false
};
    // Add task
    tasks.push(task);

    // Save task
    saveTasks();

    // Clear inputs
    taskInput.value = "";
    taskDate.value = "";
    taskPriority.value = "medium";
    taskCategory.value = "study";

    // Update UI
    renderTasks();
}
// ========================================
// QUICK ADD TASK WITH ENTER
// ========================================

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});
// ========================================
// DATE STATUS - OVERDUE CHECK
// ========================================

function isOverdue(task) {

    // No date or completed task = not overdue
    if (!task.date || task.completed) {
        return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [year, month, day] = task.date.split("-");

    const dueDate = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
    );

    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
}
// ========================================
// SMART TASK SORTING
// ========================================

function sortTasks(taskArray) {

    const sortType = sortSelect.value;

    taskArray.sort(function(a, b) {

        // Completed tasks always at bottom
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        const aOverdue = isOverdue(a);
const bOverdue = isOverdue(b);

if (aOverdue !== bOverdue) {
    return aOverdue ? -1 : 1;
}


        // Priority sorting
        if (sortType === "priority") {

            const priorityWeight = {
                high: 1,
                medium: 2,
                low: 3
            };

            return (
                (priorityWeight[a.priority] || 2) -
                (priorityWeight[b.priority] || 2)
            );
        }


        // Due date sorting
        if (sortType === "date") {

            if (!a.date && !b.date) return 0;
            if (!a.date) return 1;
            if (!b.date) return -1;

            return a.date.localeCompare(b.date);
        }


        // Newest first
        if (sortType === "newest") {
            return b.id - a.id;
        }


        // Oldest first
        if (sortType === "oldest") {
            return a.id - b.id;
        }


        // Default
        return 0;
    });
}

// ========================================
// DISPLAY / RENDER TASKS
// ========================================

function renderTasks() {

    taskList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase().trim();
    const filter = filterSelect.value;
    const category = categoryFilter.value;

    // Filter tasks
    const filteredTasks = tasks.filter(function(task) {

        const matchesSearch =
            task.text.toLowerCase().includes(searchText);

        const matchesFilter =
            filter === "all" ||
            (filter === "pending" && !task.completed) ||
            (filter === "completed" && task.completed);

        const matchesCategory =
    category === "all" ||
    task.category === category;

return matchesSearch && matchesFilter && matchesCategory;

    });
sortTasks(filteredTasks);

    // ========================================
    // NO TASKS FOUND
    // ========================================

    if (filteredTasks.length === 0) {

    emptyMessage.style.display = "block";

    if (tasks.length === 0) {

        emptyMessage.innerHTML = `
            <div class="empty-icon">🕷️</div>
            <h3>No Tasks Yet</h3>
            <p>Add your first task and start getting things done!</p>
        `;

    } else {

        emptyMessage.innerHTML = `
            <div class="empty-icon">🔍</div>
            <h3>No Matching Tasks</h3>
            <p>Try changing your search or filter.</p>
        `;
    }

    updateStats();
    return;
}

    emptyMessage.style.display = "none";


    // ========================================
    // DISPLAY EACH TASK
    // ========================================

    filteredTasks.forEach(function(task) {

        const taskCard = document.createElement("div");

        taskCard.className = "task-card";


        // Completed class
        if (task.completed) {
            taskCard.classList.add("completed");
        }


        // ========================================
        // DATE STATUS
        // ========================================

        let dateStatus = "";

        if (task.date && !task.completed) {

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const [year, month, day] = task.date.split("-");

const dueDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
);

dueDate.setHours(0, 0, 0, 0);

            // Overdue
            if (dueDate < today) {
                dateStatus = "⚠️ Overdue";
            }

            // Due Today
            else if (dueDate.getTime() === today.getTime()) {
                dateStatus = "📌 Today";
            }
        }


        // ========================================
        // TASK CARD HTML
        // ========================================

        taskCard.innerHTML = `

            <div class="task-info">

                <h3>${task.text}</h3>

                <div class="task-meta">

                    ${
                        task.date
                        ? `<span>📅 ${task.date}</span>`
                        : ""
                    }

                    ${
                        dateStatus
                        ? `<span class="date-status">${dateStatus}</span>`
                        : ""
                    }
                    <span class="category ${task.category}">
    ${
        task.category === "study"
        ? "📚 Study"
        : task.category === "work"
        ? "💻 Work"
        : task.category === "personal"
        ? "🏠 Personal"
        : task.category === "shopping"
        ? "🛒 Shopping"
        : "📌 Other"
    }
</span>

                    <span class="priority ${task.priority}">
                        ${
                            task.priority === "high"
                            ? "🔴 High"
                            : task.priority === "medium"
                            ? "🟡 Medium"
                            : "🟢 Low"
                        }
                    </span>

                </div>

            </div>


            <div class="task-actions">

                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})">
                    ✏️ Edit
                </button>

                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})">
                    ${task.completed ? "↩ Undo" : "✓ Done"}
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">
                    🗑 Delete
                </button>

            </div>

        `;

        taskList.appendChild(taskCard);
    });


    // Update statistics
    updateStats();
}


// ========================================
// COMPLETE / UNCOMPLETE TASK
// ========================================

function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    renderTasks();
}


// ========================================
// EDIT TASK
// ========================================

function editTask(id) {

    const task = tasks.find(function(task) {
        return task.id === id;
    });

    if (!task) {
        return;
    }

    // Edit task name
    const newText = prompt(
        "Edit your task:",
        task.text
    );

    if (newText === null) {
        return;
    }

    const updatedText = newText.trim();

    if (updatedText === "") {
        alert("Task cannot be empty!");
        return;
    }

    // Edit date
    const newDate = prompt(
        "Enter due date (YYYY-MM-DD):",
        task.date || ""
    );

    if (newDate === null) {
        return;
    }

    // Edit priority
    const newPriority = prompt(
        "Enter priority: high / medium / low",
        task.priority
    );

    if (newPriority === null) {
        return;
    }

    const priority = newPriority.toLowerCase().trim();

    if (!["high", "medium", "low"].includes(priority)) {
        alert("Invalid priority! Use: high, medium or low.");
        return;
    }

    // Edit category
    const newCategory = prompt(
        "Enter category: study / work / personal / shopping / other",
        task.category
    );

    if (newCategory === null) {
        return;
    }

    const category = newCategory.toLowerCase().trim();

    if (!["study", "work", "personal", "shopping", "other"].includes(category)) {
        alert("Invalid category!");
        return;
    }

    // Save changes
    task.text = updatedText;
    task.date = newDate;
    task.priority = priority;
    task.category = category;

    saveTasks();
    renderTasks();
}

// ========================================
// DELETE TASK
// ========================================

function deleteTask(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
        return;
    }


    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    saveTasks();
    renderTasks();
}


// ========================================
// SEARCH TASKS
// ========================================

searchInput.addEventListener("input", renderTasks);
sortSelect.addEventListener("change", renderTasks);

// ========================================
// FILTER TASKS
// ========================================

filterSelect.addEventListener("change", renderTasks);

categoryFilter.addEventListener("change", renderTasks);
// ========================================
// UPDATE STATISTICS
// ========================================

function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    const overdue = tasks.filter(function(task) {
        return isOverdue(task);
    }).length;

    // Dashboard statistics
    totalTasks.textContent = total;
    pendingTasks.textContent = pending;
    completedTasks.textContent = completed;
    overdueTasks.textContent = overdue;

    // Progress percentage
    const progress = total === 0
        ? 0
        : Math.round((completed / total) * 100);
        completionRate.textContent = progress + "%";
remainingTasks.textContent = pending;

    progressPercent.textContent = progress + "%";

    progressFill.style.width = progress + "%";

    progressText.textContent =
        `${completed} of ${total} tasks completed`;
        document.title = pending > 0
    ? `(${pending}) Task Management App`
    : "Task Management App";
}

// ========================================
// INITIAL LOAD
// ========================================

renderTasks();
// ========================================
// THEME TOGGLE
// ========================================

const themeToggle = document.getElementById("themeToggle");

let lightMode = localStorage.getItem("lightMode") === "true";

function updateTheme() {

    if (lightMode) {
        document.body.classList.add("light-mode");
        themeToggle.textContent = "🌙 Dark";
    } else {
        document.body.classList.remove("light-mode");
        themeToggle.textContent = "☀️ Light";
    }
}

themeToggle.addEventListener("click", function() {

    lightMode = !lightMode;

    localStorage.setItem("lightMode", lightMode);

    updateTheme();
});

updateTheme();
// ========================================
// CLEAR COMPLETED TASKS
// ========================================

clearCompletedBtn.addEventListener("click", function() {

    const completedCount = tasks.filter(function(task) {
        return task.completed;
    }).length;

    if (completedCount === 0) {
        alert("No completed tasks to clear!");
        return;
    }

    const confirmClear = confirm(
        `Delete ${completedCount} completed task(s)?`
    );

    if (!confirmClear) {
        return;
    }

    tasks = tasks.filter(function(task) {
        return !task.completed;
    });

    saveTasks();
    renderTasks();
});
// ========================================
// EXPORT TASKS
// ========================================

exportTasksBtn.addEventListener("click", function() {

    if (tasks.length === 0) {
        alert("No tasks available to export!");
        return;
    }

    const data = JSON.stringify(tasks, null, 2);

    const blob = new Blob(
        [data],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "task-management-backup.json";

    link.click();

    URL.revokeObjectURL(url);
});
// ========================================
// IMPORT TASKS
// ========================================

importTasksBtn.addEventListener("click", function() {
    importTasksInput.click();
});

importTasksInput.addEventListener("change", function(event) {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {

        try {

            const importedTasks = JSON.parse(e.target.result);

            if (!Array.isArray(importedTasks)) {
                throw new Error("Invalid task file");
            }

            const validTasks = importedTasks.filter(function(task) {

                return (
                    task.id &&
                    task.text &&
                    typeof task.completed === "boolean"
                );

            });

            if (validTasks.length === 0) {
                alert("No valid tasks found in this file!");
                return;
            }

            const confirmImport = confirm(
                `Import ${validTasks.length} task(s)?`
            );

            if (!confirmImport) {
                return;
            }

            tasks = validTasks;

            saveTasks();
            renderTasks();

            alert("Tasks imported successfully! ✅");

        } catch (error) {

            alert("Invalid JSON file!");

        }

        importTasksInput.value = "";
    };

    reader.readAsText(file);
});
// ========================================
// ⌨️ KEYBOARD SHORTCUTS
// ========================================

document.addEventListener("keydown", function(event) {

    // "/" → Focus Search
    if (
        event.key === "/" &&
        document.activeElement !== taskInput &&
        document.activeElement !== searchInput
    ) {
        event.preventDefault();
        searchInput.focus();
    }

    // "Escape" → Clear Search
    if (event.key === "Escape") {
        searchInput.value = "";
        renderTasks();
        searchInput.blur();
    }

});