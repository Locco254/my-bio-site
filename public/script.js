document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addForm");
  const profilesList = document.getElementById("profiles");

  if (!form || !profilesList) return;

  async function loadProfiles() {
    try {
      const response = await fetch("/people");
      if (!response.ok) throw new Error("Failed to fetch profiles");
      const people = await response.json();

      profilesList.innerHTML = "";
      people.forEach(person => {
        const li = document.createElement("li");
        li.textContent = `${person.name} (${person.age}) – ${person.gender} from ${person.origin}`;
        profilesList.appendChild(li);
      });
    } catch (err) {
      console.error(err);
    }
  }

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
        loadProfiles();
      }
    } catch (err) {
      console.error(err);
    }
  });

  loadProfiles();
});
