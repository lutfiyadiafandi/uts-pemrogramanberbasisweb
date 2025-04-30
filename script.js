const form = document.getElementById("activityForm");
const inputText = document.getElementById("inputText");
const inputDate = document.getElementById("inputDate");
const tableBody = document.getElementById("activityTableBody");

let activities = JSON.parse(localStorage.getItem("activities")) || [];
let editIndex = -1;

function saveToLocalStorage() {
  localStorage.setItem("activities", JSON.stringify(activities));
}

function formatTanggal(dateString) {
  const options = { day: "numeric", month: "long", year: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", options);
}

function renderTable() {
  tableBody.innerHTML = "";
  activities.forEach((activity, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <th scope="row">${index + 1}</th>
      <td class="fw-semibold fs-6 text-dark ${
        activity.completed ? "text-decoration-line-through text-muted" : ""
      }">${activity.name}</td>
      <td class="fw-semibold fs-6 text-dark">${formatTanggal(
        activity.date
      )}</td>
      <td>
        <input class="form-check-input border-dark border-2 checkbox" type="checkbox" ${
          activity.completed ? "checked" : ""
        } onchange="toggleComplete(${index})">
      </td>
      <td>
        <button type="button" class="btn btn-sm btn-success fw-semibold fs-6 text-white" onclick="editActivity(${index})" ${
      activity.completed ? "disabled" : ""
    }>
          Edit
        </button>
        <button type="button" class="btn btn-sm btn-danger fw-semibold fs-6 text-white" onclick="deleteActivity(${index})">
          Hapus
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = inputText.value.trim();
  const date = inputDate.value;

  if (!name || !date) {
    alert("Isi Nama dan Tanggal Kegiatan terlebih dahulu!");
    return;
  }

  if (editIndex === -1) {
    activities.unshift({ name, date, completed: false });
  } else {
    activities[editIndex].name = name;
    activities[editIndex].date = date;
    editIndex = -1;
  }

  saveToLocalStorage();
  renderTable();
  form.reset();
});

function editActivity(index) {
  inputText.value = activities[index].name;
  inputDate.value = activities[index].date;
  editIndex = index;
  inputText.focus();
}

function deleteActivity(index) {
  if (confirm("Apakah Anda yakin ingin menghapus kegiatan ini?")) {
    activities.splice(index, 1);
    saveToLocalStorage();
    renderTable();
  }
}

function toggleComplete(index) {
  activities[index].completed = !activities[index].completed;
  saveToLocalStorage();
  renderTable();
}

renderTable();
