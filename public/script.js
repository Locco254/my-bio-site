// ===== Handle form submission and display saved profiles =====

// Grab the form element
const bioForm = document.getElementById("bioForm");

// ===== Submit form handler =====
bioForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Collect user input
  const newPerson = {
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    origin: document.getElementById("origin").value
  };

  // Send data to backend
  try {
    const res = await fetch("/people", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPerson)
    });
    const saved = await res.json();
    alert(`Saved: ${saved.name}`);
    bioForm.reset();
    loadProfiles();
  } catch (err) {
    console.error("Error saving data:", err);
    alert("Failed to save data");
  }
});

// ===== Load profiles from MongoDB =====
async function loadProfiles() {
  try {
    const res = await fetch("/people");
    const data = await res.json();
    const profilesDiv = document.getElementById("profiles");
    profilesDiv.innerHTML = "";

    // Display each saved person
    data.forEach((p) => {
      const el = document.createElement("p");
      el.textContent = `${p.name}, ${p.age} (${p.gender}) from ${p.origin}`;
      profilesDiv.appendChild(el);
    });
  } catch (err) {
    console.error("Error loading profiles:", err);
  }
}

// Load any existing profiles when the page starts
loadProfiles();
