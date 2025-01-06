const maxUsers = 5;
const usersKey = "leetStatsUsers";

function getUsers() {
  return JSON.parse(localStorage.getItem(usersKey)) || [];
}

function saveUsers(users) {
  localStorage.setItem(usersKey, JSON.stringify(users));
}

async function renderTable() {
  const users = getUsers();
  const tableBody = document.querySelector("#statsTable tbody");
  tableBody.innerHTML = "";

  for (const user of users) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.username}</td>
      <td class="stats">${user.totalSolved || "N/A"}</td>
      <td class="stats easy">${user.easySolved || "N/A"}</td>
      <td class="stats medium">${user.mediumSolved || "N/A"}</td>
      <td class="stats hard">${user.hardSolved || "N/A"}</td>
      <td><button class="action-btn removeUser" data-username="${user.username}">Remove</button></td>
    `;
    tableBody.appendChild(row);
  }

  document.querySelectorAll(".removeUser").forEach(button => {
    button.addEventListener("click", () => removeUser(button.dataset.username));
  });
}

async function addUser() {
  const username = prompt("Enter LeetCode username:");
  if (!username) return;

  const users = getUsers();
  if (users.length >= maxUsers) {
    alert("You can only save up to 5 users.");
    return;
  }

  try {
    const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
    if (!response.ok) {
      throw new Error("Invalid username or API error.");
    }

    const data = await response.json();
    users.push({
      username,
      totalSolved: data.totalSolved,
      easySolved: data.easySolved,
      mediumSolved: data.mediumSolved,
      hardSolved: data.hardSolved,
    });
    
    saveUsers(users);
    renderTable();
  } catch (error) {
    alert(`Failed to fetch stats: ${error.message}`);
  }
}

function removeUser(username) {
  const users = getUsers().filter(user => user.username !== username);
  saveUsers(users);
  renderTable();
}

document.getElementById("addUser").addEventListener("click", addUser);
window.onload = renderTable;