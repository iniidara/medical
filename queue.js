const QUEUE_REFRESH_INTERVAL = 1000;
const queueList = document.getElementById("queueList");

function getQueue() {
  const storedValue = localStorage.getItem("queue");
  if (!storedValue) {
    return [];
  }

  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.warn("Unable to parse queue from localStorage:", error);
    return [];
  }
}

function createStatusIndicator(status, isNextInLine) {
  if (status === "waiting" && isNextInLine) {
    return `<div class="indicator next-indicator">YOU'RE NEXT</div>`;
  }

  if (status === "in consultation") {
    return `<div class="indicator consulting-indicator">IN CONSULTATION</div>`;
  }

  return "";
}

function createPatientCard(patient, position) {
  const card = document.createElement("article");
  card.className = "patient-card";

  card.innerHTML = `
    ${createStatusIndicator(patient.status, position === 0)}

    <div class="patient-header">
      <div class="patient-summary">
        <div class="queue-number">${position + 1}</div>

        <div class="patient-details">
          <h2 class="patient-name">${patient.name}</h2>
          <p class="patient-symptom">${patient.symptom}</p>
        </div>
      </div>

      <div class="status-badge">${patient.status}</div>
    </div>
  `;

  return card;
}

function renderEmptyState() {
  const emptyState = document.createElement("div");
  emptyState.className = "empty-state";
  emptyState.innerHTML = `
    <h2>No Patients In Queue</h2>
    <p>The clinic queue is currently empty.</p>
  `;

  return emptyState;
}

function loadQueue() {
  queueList.innerHTML = "";
  const queue = getQueue();

  if (queue.length === 0) {
    queueList.appendChild(renderEmptyState());
    return;
  }

  queue.forEach((patient, index) => {
    queueList.appendChild(createPatientCard(patient, index));
  });
}

loadQueue();
setInterval(loadQueue, QUEUE_REFRESH_INTERVAL);