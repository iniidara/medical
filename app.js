async function checkIn() {

  const name =
    document.getElementById("name").value;

  const matric =
    document.getElementById("matric").value;

  const notes =
    document.getElementById("notes").value;

  const checks =
    document.querySelectorAll(".symptom-check:checked");

  const symptoms =
    Array.from(checks).map(
      check => check.value
    );

  if (!name || !matric) {

    alert("Fill all required fields");

    return;
  }

  // urgency logic
  let urgency = "Non-Urgent";

  if (
    symptoms.includes("Chest Pain") ||
    symptoms.includes("Difficulty Breathing")
  ) {

    urgency = "Urgent";

  } else if (
    symptoms.includes("Injury")
  ) {

    urgency = "Moderate";
  }

  // generate ticket
  const ticketNumber =
    "MF-" +
    Math.floor(
      1000 + Math.random() * 9000
    );

  const { error } =
    await supabaseClient
      .from("queue")
      .insert([
        {
          name: name,
          matric_number: matric,
          symptoms: symptoms.join(", "),
          notes: notes,
          urgency: urgency,
          ticket_number: ticketNumber,
          status: "waiting"
        }
      ]);

  if (error) {

    console.error(error);

    alert("Submission failed");

    return;
  }

  localStorage.setItem(
    "currentPatient",
    ticketNumber
  );

  alert(
    `Check-in successful.\nTicket: ${ticketNumber}`
  );

  window.location.href =
    "queue.html";
}