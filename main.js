document.addEventListener("DOMContentLoaded", () => {
    const inputField = document.getElementById("todo-input");
    const addButton = document.getElementById("add-btn");
    const todoList = document.getElementById("todo-list");
    const datePicker = document.getElementById("todo-date");

    // 🟢 로컬 저장소에서 저장된 할 일 불러오기
    const loadTodos = () => {
        const selectedDate = datePicker.value || getToday();
        const savedTodos = JSON.parse(localStorage.getItem(`todos_${selectedDate}`)) || [];
        todoList.innerHTML = ""; // 기존 목록 초기화
        savedTodos.forEach(todo => addTodo(todo.text, todo.completed, false));
    };

    // 🟢 오늘 날짜 가져오기 (YYYY-MM-DD)
    const getToday = () => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // YYYY-MM-DD 포맷
    };

    // 🟢 할 일 추가 함수
    const addTodo = (text, completed = false, save = true) => {
        if (!text.trim()) return;

        const li = document.createElement("li");
        li.classList.add("todo-item");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = completed;
        checkbox.addEventListener("change", () => {
            saveTodos();
            li.classList.toggle("completed", checkbox.checked);
        });

        const span = document.createElement("span");
        span.textContent = text;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => {
            li.style.opacity = "0";
            setTimeout(() => {
                li.remove();
                saveTodos();
            }, 300);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);

        if (save) saveTodos();
    };

    // 🟢 할 일 저장 함수 (날짜별 저장)
    const saveTodos = () => {
        const selectedDate = datePicker.value || getToday();
        const todos = [];
        document.querySelectorAll(".todo-item").forEach(li => {
            todos.push({
                text: li.querySelector("span").textContent,
                completed: li.querySelector("input").checked
            });
        });
        localStorage.setItem(`todos_${selectedDate}`, JSON.stringify(todos));
    };

    // 🟢 추가 버튼 클릭 시 할 일 추가
    addButton.addEventListener("click", () => {
        addTodo(inputField.value);
        inputField.value = "";
    });

    // 🟢 Enter 키 입력 시 할 일 추가
    inputField.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addTodo(inputField.value);
            inputField.value = "";
        }
    });

    // 🟢 날짜 선택 시 해당 날짜의 할 일 불러오기
    datePicker.addEventListener("change", loadTodos);

    // 🟢 페이지 로드 시 기본 날짜 설정 및 할 일 불러오기
    datePicker.value = getToday();
    loadTodos();
});
