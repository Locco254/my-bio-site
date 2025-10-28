// ===== Simple password login logic =====
const PASSWORD = "254access"; // <-- change this to any password you want

const loginSection = document.getElementById("login-section");
const addInfoSection = document.getElementById("add-info-section");
const profilesSection = document.getElementById("profiles-section");
const loginBtn = document.getElementById("loginBtn");
const loginMsg = document.getElementById("login-message");

// ===== Handle login =====
loginBtn.addEventListener("click", () => {
  const entered = document.getElementById("password").value.trim();
  if (entered === PASSWORD) {
    loginSection.classList.add("hidden");
    addInfoSection.classList.remove("hidden");
    profilesSection.classList.remove("hidden");
  } else {
    loginMsg.textContent = "Access denied 😅 — wrong password!";
    loginMsg.style.color = "red";
  }
});

// ===== Handle bio form submission =====
const bioForm = document.getElementById("bioForm");
bioForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPerson = {
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    origin: document.getElementById("origin").value
  };

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
    console.error(err);
    alert("Failed to save data");
  }
});

// ===== Load profiles from database =====
async function loadProfiles() {
  try {
    const res = await fetch("/people");
    const data = await res.json();
    const profilesDiv = document.getElementById("profiles");
    profilesDiv.innerHTML = "";

    data.forEach(p => {
      const el = document.createElement("p");
      el.textContent = `${p.name}, ${p.age} (${p.gender}) from ${p.origin}`;
      profilesDiv.appendChild(el);
    });
  } catch (err) {
    console.error("Error loading profiles:", err);
  }
}

loadProfiles();
