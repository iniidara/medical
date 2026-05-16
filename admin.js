function loadAdminQueue() {

  const queue = JSON.parse(localStorage.getItem("queue")) || [];

  const adminQueue = document.getElementById("adminQueue");

  adminQueue.innerHTML = "";

  if (queue.length === 0) {

    adminQueue.innerHTML = `
      <div class="empty-state">
        <h3>No Active Patients</h3>
        <p>The clinic queue is currently empty.</p>
      </div>
    `;

    return;
  }

  queue.forEach((patient, index) => {

    const div = document.createElement("div");

    div.classList.add("patient-card");

    div.innerHTML = `

      <div class="patient-header">

        <div style="display:flex; gap:14px; align-items:center;">

          <div class="queue-number">
            ${index + 1}
          </div>

          <div>
            <h3 class="patient-name">
              ${patient.name}
            </h3>

            <p class="patient-symptom">
              ${patient.symptom}
            </p>
          </div>

        </div>

        <div class="status-badge">
          ${patient.status}
        </div>

      </div>

      <div class="admin-actions">

        <button onclick="startConsult(${index})">
          Start
        </button>

        <button onclick="markDone(${index})">
          Done
        </button>

        <button onclick="removePatient(${index})">
          Remove
        </button>

      </div>

    `;

    adminQueue.appendChild(div);

  });

}

function startConsult(index) {

  let queue = JSON.parse(localStorage.getItem("queue")) || [];

  // reset everyone else
  queue.forEach(patient => {
    if (patient.status === "in consultation") {
      patient.status = "waiting";
    }
  });

  // active patient
  queue[index].status = "in consultation";

  localStorage.setItem("queue", JSON.stringify(queue));

  loadAdminQueue();
}

function markDone(index) {

  let queue = JSON.parse(localStorage.getItem("queue")) || [];

  queue[index].status = "done";

  localStorage.setItem("queue", JSON.stringify(queue));

  loadAdminQueue();

}

function removePatient(index) {

  let queue = JSON.parse(localStorage.getItem("queue")) || [];

  queue.splice(index, 1);

  localStorage.setItem("queue", JSON.stringify(queue));

  loadAdminQueue();

}

function clearQueue() {

  localStorage.removeItem("queue");

  loadAdminQueue();

}

loadAdminQueue();

setInterval(loadAdminQueue, 1000);