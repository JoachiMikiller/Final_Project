window.onload = init;

function init() {
  requireAuth();

  document.getElementById("logout-btn").addEventListener("click", logout);
  document.getElementById("search-form").addEventListener("submit", onSearch);
  document.getElementById("clear-search").addEventListener("click", onClear);

  loadEmployees();
}

function loadEmployees() {
  setMessage("Cargando empleados...");

  axios
    .get("http://localhost:3000" + "/employee", authHeaders())
    .then(res => {
      setMessage("");
      renderRows(res.data.message);
    })
    .catch(err => {
      if (handleAuthError(err)) return;
      setMessage("No se pudieron cargar los empleados");
    });
}

function onSearch(event) {
  event.preventDefault();
  const name = document.getElementById("search-name").value.trim();

  if (!name) {
    loadEmployees();
    return;
  }

  setMessage("Buscando...");

  axios
    .get("http://localhost:3000" + "/employee/name/" + encodeURIComponent(name), authHeaders())
    .then(res => {
      const count = res.data.message.length;
      setMessage(count + " resultado(s)");
      renderRows(res.data.message);
    })
    .catch(err => {
      if (handleAuthError(err)) return;
      if (err.response && err.response.status === 404) {
        renderRows([]);
        setMessage("Sin resultados");
        return;
      }
      setMessage("Error en la busqueda");
    });
}

function onClear() {
  document.getElementById("search-name").value = "";
  loadEmployees();
}

function renderRows(rows) {
  const tbody = document.getElementById("employee-rows");
  tbody.innerHTML = "";

  if (!rows || rows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">No hay empleados registrados</td></tr>';
    return;
  }

  rows.forEach(emp => {
    const id = emp.emp_id || emp.id;
    const name = emp.emp_name || emp.name || "";
    const lastname = emp.emp_lastname || emp.lastname || "";
    const phone = emp.emp_phone || emp.phone || "";
    const email = emp.emp_email || emp.email || "";
    const address = emp.emp_address || emp.address || "";

    tbody.innerHTML += `
      <tr>
        <td>${name} ${lastname}<br><small>ID: ${id}</small></td>
        <td>${phone}</td>
        <td>${email}</td>
        <td>${address}</td>
        <td>
          <div class="row-actions">
            <a href="EmployeeEdit.html?id=${id}">Editar</a>
            <button class="delete-btn" data-id="${id}" type="button">Eliminar</button>
          </div>
        </td>
      </tr>
    `;
  });

  document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", onDelete);
  });
}

function onDelete(event) {
  const id = event.currentTarget.dataset.id;
  if (!confirm("¿Eliminar empleado?")) return;

  axios
    .delete("http://localhost:3000" + "/employee/" + id, authHeaders())
    .then(res => {
      if (res.data.code == 200) {
        setMessage("Empleado eliminado");
        loadEmployees();
        return;
      }
      setMessage("No se pudo eliminar el empleado");
    })
    .catch(err => {
      if (handleAuthError(err)) return;
      setMessage("Error al eliminar empleado");
    });
}

function setMessage(text) {
  const el = document.getElementById("message");
  if (el) el.textContent = text || "";
}
