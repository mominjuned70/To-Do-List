const form = document.getElementById("task_form");
const input = document.getElementById("task_box");
const list = document.getElementById("list");
const count = document.getElementById("count");
const filterBtns = document.querySelectorAll(".filters button[data-filter]");
const clearBtn = document.getElementById("clear_completed");

let tasks = load();
let currentFilter = "all";

function load() {
  try {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  } catch (e) {
    return [];
  }
}

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function render() {
  list.innerHTML = "";

  const filteredTasks = tasks.filter(function (t) {
    if (currentFilter === "active") return !t.done;
    if (currentFilter === "done") return t.done;
    return true;
  });

  filteredTasks.forEach(function (t) {
    const li = document.createElement("li");
    li.dataset.id = t.id;
    li.className = t.done ? "done" : "";

    const label = document.createElement("span");
    label.textContent = t.text;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.textContent = t.done ? "Undo" : "Done";
    toggle.dataset.action = "toggle";

    const del = document.createElement("button");
    del.type = "button";
    del.textContent = "Delete";
    del.dataset.action = "delete";

    li.append(label, toggle, del);
    list.append(li);
  });

  const remaining = tasks.filter(function (t) {
    return !t.done;
  }).length;

  count.textContent = remaining + " left";
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text: text,
    done: false
  });

  input.value = "";
  save();
  render();
});

list.addEventListener("click", function (e) {
  const action = e.target.dataset.action;
  if (!action) return;

  const li = e.target.closest("li");
  if (!li) return;

  const id = Number(li.dataset.id);

  if (action === "delete") {
    tasks = tasks.filter(function (t) {
      return t.id !== id;
    });
  }

  if (action === "toggle") {
    tasks.forEach(function (t) {
      if (t.id === id) {
        t.done = !t.done;
      }
    });
  }

  save();
  render();
});

filterBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filterBtns.forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

clearBtn.addEventListener("click", function () {
  tasks = tasks.filter(function (t) {
    return !t.done;
  });
  save();
  render();
});

render();
