if ("Notification" in window) {

  Notification.requestPermission();

}

let lastNotified = null;

async function loadQueue() {

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

  const queueList =
    document.getElementById("queueList");

  queueList.innerHTML = "";

  if (data.length === 0) {

    queueList.innerHTML = `
      <div class="empty-state">
        <h3>No Active Patients</h3>
      </div>
    `;

    return;
  }

  // queue stats

  const waitingCount =
    document.getElementById(
      "waitingCount"
    );

  const urgentCount =
    document.getElementById(
      "urgentCount"
    );

  const avgWait =
    document.getElementById(
      "avgWait"
    );

  const nowServing =
    document.getElementById(
      "nowServing"
    );

  if (waitingCount) {

    waitingCount.innerText =
      data.length;

  }

  const urgentCases =
    data.filter(
      patient =>
        patient.urgency ===
        "Urgent"
    ).length;

  if (urgentCount) {

    urgentCount.innerText =
      urgentCases;

  }

  if (avgWait) {

    avgWait.innerText =
      `${data.length * 5}m`;

  }

  const activePatient =
    data.find(
      patient =>
        patient.status ===
        "in consultation"
    );

  if (nowServing) {

    if (activePatient) {

      nowServing.innerText =
        activePatient.ticket_number;

    }

    else {

      nowServing.innerText =
        "--";

    }

  }

  const currentPatient =
    localStorage.getItem(
      "currentPatient"
    );

  // notification logic

  const patientIndex =
    data.findIndex(
      patient =>
        patient.ticket_number ===
        currentPatient
    );

  if (
    patientIndex !== -1 &&
    patientIndex <= 1
  ) {

    const patient =
      data[patientIndex];

    if (
      Notification.permission ===
      "granted"
    ) {

      if (
        lastNotified !==
        patient.ticket_number
      ) {

        new Notification(
          "MediFlow Alert",
          {
            body:
              "You're almost next at the clinic."
          }
        );

        lastNotified =
          patient.ticket_number;

      }

    }

  }

  data.forEach((patient, index) => {

    const div =
      document.createElement("div");

    div.classList.add(
      "patient-card"
    );

    if (
      patient.ticket_number ===
      currentPatient
    ) {

      div.classList.add(
        "current-user"
      );

    }

    // urgency styling

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

    let nextBadge = "";

    if (
      index === 0 &&
      patient.status ===
      "waiting"
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

        <div>

          <h3 class="ticket-number">
            ${patient.ticket_number}
          </h3>

          <p class="estimated-time">
            Estimated Wait:
            ${waitTime} mins
          </p>

          <p class="queue-position">
            Position:
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

    () => {

      loadQueue();

    }
  )

  .subscribe();