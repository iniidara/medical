function loginAdmin() {

  const password =
    document.getElementById("password").value;

  // temporary clinic password
  const clinicPassword =
    "unilagclinic123";

  if (password === clinicPassword) {

    localStorage.setItem(
      "clinicAdmin",
      "true"
    );

    window.location.href =
      "admin.html";

  } else {

    alert("Wrong password");

  }

}