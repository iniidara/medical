if (
  localStorage.getItem("clinicAdmin")
  !== "true"
) {

  window.location.href =
    "admin-login.html";

}

async function loadAdminQueue() {

  const { data, error } =
    await supabaseClient
      .from("queue")
      .select("*")
      .neq("status", "done")
      .order("priority", {
        ascending: false
      })
      .order("created_at", {
        ascending: true
      });

  if (error) {

    console.error(error);

    return;

  }

  const adminQueue =
    document.getElementById(
      "adminQueue"
    );

  adminQueue.innerHTML = "";

  if (data.length === 0) {

    adminQueue.innerHTML = `
      <div class="empty-state">
        <h3>No Active Patients</h3>
      </div>
    `;

    updateStats([]);

    return;

  }

  data.forEach((patient, index) => {

    const div =
      document.createElement("div");

    div.classList.add(
      "patient-card"
    );

    let urgencyClass = "";

    if (
      patient.urgency ===
      "Urgent"
    ) {

      urgencyClass =
        "urgent";

    }

    else if (
      patient.urgency ===
      "Moderate"
    ) {

      urgencyClass =
        "moderate";

    }

    else {

      urgencyClass =
        "non-urgent";

    }

    // estimated wait

    const waitTime =
      index * 5;

    div.innerHTML = `

      <div class="patient-header">

        <div>

          <h3 class="ticket-number">
            ${patient.ticket_number}
          </h3>

          <p class="patient-name">
            ${patient.name}
          </p>

          <p class="patient-symptom">
            ${patient.symptoms}
          </p>

          <p class="patient-notes">
            ${patient.notes || ""}
          </p>

          <p class="estimated-time">
            Estimated Wait:
            ${waitTime} mins
          </p>

          <p class="queue-position">
            Queue Position:
            ${index + 1}
          </p>

        </div>

        <div class="
          urgency-badge
          ${urgencyClass}
        ">
          ${patient.urgency}
        </div>

      </div>

      <div class="status-badge">
        ${patient.status}
      </div>

      <div class="admin-actions">

        <button onclick="startConsult(${patient.id})">
          Call Patient
        </button>

        <button onclick="markDone(${patient.id})">
          Mark Seen
        </button>

        <button onclick="removePatient(${patient.id})">
          Remove
        </button>

      </div>
    `;

    adminQueue.appendChild(
      div
    );

  });

  updateStats(data);

}

function updateStats(data) {

  const totalPatients =
    data.length;

  const urgentCases =
    data.filter(
      patient =>
        patient.urgency ===
        "Urgent"
    ).length;

  const consultationCount =
    data.filter(
      patient =>
        patient.status ===
        "in consultation"
    ).length;

  document.getElementById(
    "totalPatients"
  ).innerText =
    totalPatients;

  document.getElementById(
    "urgentCases"
  ).innerText =
    urgentCases;

  document.getElementById(
    "consultationCount"
  ).innerText =
    consultationCount;

}

async function startConsult(id) {

  // reset old consultations

  await supabaseClient
    .from("queue")
    .update({
      status: "waiting"
    })
    .eq(
      "status",
      "in consultation"
    );

  // start new consultation

  await supabaseClient
    .from("queue")
    .update({
      status:
        "in consultation"
    })
    .eq("id", id);

  loadAdminQueue();

}

async function markDone(id) {

  await supabaseClient
    .from("queue")
    .update({
      status: "done"
    })
    .eq("id", id);

  loadAdminQueue();

}

async function removePatient(id) {

  await supabaseClient
    .from("queue")
    .delete()
    .eq("id", id);

  loadAdminQueue();

}

async function clearQueue() {

  await supabaseClient
    .from("queue")
    .delete()
    .neq("id", 0);

  loadAdminQueue();

}

loadAdminQueue();

supabaseClient
  .channel("admin-live")

  .on(
    "postgres_changes",

    {
      event: "*",
      schema: "public",
      table: "queue"
    },

    () => {

      loadAdminQueue();

    }
  )

  .subscribe();