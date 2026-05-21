async function checkIn() {

  const name =
    document.getElementById("name").value;

  const symptom =
    document.getElementById("symptom").value;

  if (!name) {
    alert("Enter your name");
    return;
  }

  const { data, error } =
    await supabaseClient
      .from("queue")
      .insert([
        {
          name: name,
          symptom: symptom,
          status: "waiting"
        }
      ]);

  if (error) {
    console.error(error);
    return;
  }

  localStorage.setItem(
    "currentPatient",
    name
  );

  window.location.href =
    "queue.html";
}