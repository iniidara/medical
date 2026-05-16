const QUEUE_KEY = "queue";
const REFRESH_INTERVAL_MS = 1000;
const adminQueue = document.getElementById("adminQueue");

function getQueue() {
  const rawQueue = localStorage.getItem(QUEUE_KEY);
  if (!rawQueue) return [];

  try {
    return JSON.parse(rawQueue);
  } catch (error) {
    console.warn("Unable to parse queue from localStorage:", error);
    return [];
  }
}

function saveQueue(queue) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

function createPatientCard(patient, index) {
  const card = document.createElement("div");
  card.className = "patient-card";

  card.innerHTML = `
    <div class="patient-header">
      <div class="patient-summary">
        <div class="queue-number">${index + 1}</div>
        <div class="patient-details">
          <h3 class="patient-name">${patient.name}</h3>
          <p class="patient-symptom">${patient.symptom}</p>
        </div>
      </div>
      <div class="status-badge">${patient.status}</div>
    </div>
    <div class="admin-actions">
      <button type="button" onclick="startConsult(${index})">Start</button>
      <button type="button" onclick="markDone(${index})">Done</button>
      <button type="button" onclick="removePatient(${index})">Remove</button>
    </div>
  `;

  return card;
}

function renderEmptyState() {
  const emptyState = document.createElement("div");
  emptyState.className = "empty-state";
  emptyState.innerHTML = `
    <h2>No Active Patients</h2>
    <p>The clinic queue is currently empty.</p>
  `;
  return emptyState;
}

function loadAdminQueue() {
  const queue = getQueue();
  adminQueue.innerHTML = "";

  if (!queue.length) {
    adminQueue.appendChild(renderEmptyState());
    return;
  }

  queue.forEach((patient, index) => {
    adminQueue.appendChild(createPatientCard(patient, index));
  });
}

function startConsult(index) {
  const queue = getQueue();
  if (!queue[index]) return;

  queue.forEach((patient) => {
    if (patient.status === "in consultation") {
      patient.status = "waiting";
    }
  });

  queue[index].status = "in consultation";
  saveQueue(queue);
  loadAdminQueue();
}

function markDone(index) {
  const queue = getQueue();
  if (!queue[index]) return;

  queue[index].status = "done";
  saveQueue(queue);
  loadAdminQueue();
}

function removePatient(index) {
  const queue = getQueue();
  if (!queue[index]) return;

  queue.splice(index, 1);
  saveQueue(queue);
  loadAdminQueue();
}

function clearQueue() {
  localStorage.removeItem(QUEUE_KEY);
  loadAdminQueue();
}

loadAdminQueue();
setInterval(loadAdminQueue, REFRESH_INTERVAL_MS);
