// ===== Frontend script for My Bio Site =====

// This script is ready for future interactivity,
// but it keeps things calm and clean for now since
// the form and saved profiles are hidden from public view.

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addForm");
  const profilesList = document.getElementById("profiles");
  const addInfoSection = document.getElementById("add-info");
  const savedProfilesSection = document.getElementById("saved-profiles");

  // Prevent running if hidden
  if (!form || !profilesList) return;

  // ===== Load existing profiles =====
  async function loadProfiles() {
    try {
      const response = await fetch("/people");
      if (!response.ok) throw new Error("Failed to fetch profiles");
      const people = await response.json();

      profilesList.innerHTML = "";
      people.forEach((person) => {
        const li = document.createElement("li");
        li.textContent = `${person.name} (${person.age}) – ${person.gender} from ${person.origin}`;
        profilesList.appendChild(li);
      });
    } catch (err) {
      console.error("Error loading profiles:", err);
    }
  }

  // ===== Add new profile =====
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: form.name.value,
      age: form.age.value,
      gender: form.gender.value,
      origin: form.origin.value,
    };

    try {
      const res = await fetch("/people", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        form.reset();
        await loadProfiles();
      } else {
        console.error("Failed to add new person");
      }
    } catch (err) {
      console.error("Error adding person:", err);
    }
  });

  // Initial load
  loadProfiles();
});
