function checkIn() {
  const name = document.getElementById("name").value;
  const symptom = document.getElementById("symptom").value;

  if (!name) {
    alert("Enter your name");
    return;
  }

  let queue = JSON.parse(localStorage.getItem("queue")) || [];

  const patient = {
    name,
    symptom,
    status: "waiting"
  };

  queue.push(patient);

  localStorage.setItem("queue", JSON.stringify(queue));

  // store current patient name
  localStorage.setItem("currentPatient", name);
  window.location.href = "queue.html";
}