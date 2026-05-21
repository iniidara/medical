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
      .order("created_at", {
        ascending: true
      });

  if (error) {
    console.error(error);
    return;
  }

  const adminQueue =
    document.getElementById("adminQueue");

  adminQueue.innerHTML = "";

  if (data.length === 0) {

    adminQueue.innerHTML = `
      <div class="empty-state">
        <h3>No Active Patients</h3>
      </div>
    `;

    return;
  }

  data.forEach((patient, index) => {

    const div =
      document.createElement("div");

    div.classList.add("patient-card");

    div.innerHTML = `

      <div class="patient-header">

        <div style="
          display:flex;
          gap:14px;
          align-items:center;
        ">

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

        <button onclick="startConsult(${patient.id})">
          Start
        </button>

        <button onclick="markDone(${patient.id})">
          Done
        </button>

        <button onclick="removePatient(${patient.id})">
          Remove
        </button>

      </div>
    `;

    adminQueue.appendChild(div);

  });

}

async function startConsult(id) {

  await supabaseClient
    .from("queue")
    .update({
      status: "in consultation"
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

    (payload) => {

      console.log("Admin realtime:", payload);

      loadAdminQueue();

    }
  )

  .subscribe();