async function loadQueue() {

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

  const queueList =
    document.getElementById("queueList");

  queueList.innerHTML = "";

  if (data.length === 0) {

    queueList.innerHTML = `
      <div class="empty-state">
        <h3>No Patients In Queue</h3>
      </div>
    `;

    return;
  }

  const currentPatient =
    localStorage.getItem("currentPatient");

  data.forEach((patient, index) => {

    const div =
      document.createElement("div");

    div.classList.add("patient-card");

    if (patient.name === currentPatient) {
      div.classList.add("current-user");
    }

    let nextBadge = "";

    if (
      index === 0 &&
      patient.status === "waiting"
    ) {
      nextBadge = `
        <div class="next-indicator">
          YOU'RE NEXT
        </div>
      `;
    }

    if (
      patient.status ===
      "in consultation"
    ) {
      nextBadge = `
        <div class="consulting-indicator">
          IN CONSULTATION
        </div>
      `;
    }

    div.innerHTML = `

      ${nextBadge}

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
    `;

    queueList.appendChild(div);

  });

}

loadQueue();

supabaseClient
  .channel("queue-live")

  .on(
    "postgres_changes",

    {
      event: "*",
      schema: "public",
      table: "queue"
    },

    (payload) => {

      console.log("Realtime update:", payload);

      loadQueue();

    }
  )

  .subscribe();