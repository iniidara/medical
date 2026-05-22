if ("Notification" in window) {

  Notification.requestPermission();

}

let hasNotified = false;

async function loadQueue() {

  const { data, error } =
    await supabaseClient
      .from("queue")
      .select("*")
      .neq("status", "done")
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

  const currentPatient =
    localStorage.getItem("currentPatient");

  // reset notification state
  hasNotified = false;

  data.forEach((patient, index) => {

    const div =
      document.createElement("div");

    div.classList.add("patient-card");

    if (
      patient.ticket_number ===
      currentPatient
    ) {

      div.classList.add(
        "current-user"
      );

    }

    // notification logic

    if (
      patient.ticket_number ===
      currentPatient &&
      index <= 1 &&
      patient.status === "waiting" &&
      !hasNotified
    ) {

      new Notification(
        "MediFlow Alert",
        {
          body:
            "You're almost next. Please prepare."
        }
      );

      hasNotified = true;
    }

    // urgency styling

    let urgencyClass = "";

    if (
      patient.urgency === "Urgent"
    ) {

      urgencyClass = "urgent";

    }

    else if (
      patient.urgency === "Moderate"
    ) {

      urgencyClass = "moderate";

    }

    else {

      urgencyClass = "non-urgent";

    }

    // estimated wait

    const waitTime =
      index * 5;

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

        <div>

          <h3 class="ticket-number">
            ${patient.ticket_number}
          </h3>

          <p class="estimated-time">
            Estimated Wait:
            ${waitTime} mins
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