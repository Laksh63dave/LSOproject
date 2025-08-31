// ==== GLOBAL VARIABLES ====
let userPoints = 0;
let userLevel = 1;
let streak = 0;

// Achievement thresholds
const achievements = {
  water: { points: 10, unlocked: false, element: "ach1" },
  steps: { points: 20, unlocked: false, element: "ach2" },
  sleep: { points: 15, unlocked: false, element: "ach3" },
};

// ==== POINT SYSTEM ====
function addPoints(points) {
  userPoints += points;
  streak++;
  checkAchievements();
  updateLeaderboard();
  updateScoreDisplay();
  checkLevelUp();
}

// Update progress bars
function updateProgress(id, points) {
  const bar = document.getElementById(id);
  let current = parseInt(bar.style.width);
  bar.style.width = Math.min(current + points, 100) + "%";
}

// Check achievements
function checkAchievements() {
  for (let key in achievements) {
    if (!achievements[key].unlocked && userPoints >= achievements[key].points) {
      achievements[key].unlocked = true;
      const badge = document.getElementById(achievements[key].element);
      if (badge) {
        badge.innerText = "Unlocked 🎉";
        badge.classList.remove("bg-warning");
        badge.classList.add("bg-success");
      }
    }
  }
}

// Complete a challenge manually
function completeChallenge(progressId, pointsId, points) {
  addPoints(points);

  const progressBar = document.getElementById(progressId);
  if (progressBar) progressBar.style.width = "100%";

  const pointsBadge = document.getElementById(pointsId);
  if (pointsBadge) pointsBadge.innerText = `Points: ${points}`;

  progressBar?.classList.add("progress-animated");
  setTimeout(() => progressBar?.classList.remove("progress-animated"), 1000);
}

// Update leaderboard dynamically
function updateLeaderboard() {
  const leaderboard = [
    { name: "Laksh Dave", points: userPoints },
    { name: "Ayush Pal", points: 40 },
    { name: "Neeraj Yadav", points: 30 },
    { name: "Shivansh Pandey", points: 20 },
    { name: "Vishal Verma", points: 10 },
  ];
  leaderboard.sort((a, b) => b.points - a.points);

  const list = document.getElementById("leaderboard-list");
  if (list) {
    list.innerHTML = "";
    leaderboard.forEach(user => {
      const li = document.createElement("li");
      li.className = "list-group-item bg-transparent text-white";
      li.innerHTML = `${user.name} – ${user.points} pts`;
      list.appendChild(li);
    });
  }

  const userScore = document.getElementById("userScore");
  if (userScore) userScore.innerText = userPoints;
}

// Update score display
function updateScoreDisplay() {
  const scoreEl = document.getElementById("score");
  if (scoreEl) scoreEl.innerText = userPoints;

  const streakEl = document.getElementById("streak");
  if (streakEl) streakEl.innerText = streak;
}

// Leveling system
function checkLevelUp() {
  const newLevel = Math.floor(userPoints / 50) + 1;
  if (newLevel > userLevel) {
    userLevel = newLevel;
    alert(`🎉 Level Up! You are now Level ${userLevel}`);
    document.getElementById("level").innerText = userLevel;
  }
}

// ==== COUNTDOWN TIMER FUNCTION ====
function startCountdown(timerId, progressId, points, duration) {
  let remaining = duration; // in seconds
  const timerEl = document.getElementById(timerId);
  const progressEl = document.getElementById(progressId);

  if (!timerEl || !progressEl) return;

  const interval = setInterval(() => {
    if (remaining <= 0) {
      clearInterval(interval);
      progressEl.style.width = "100%";
      addPoints(points);
      const pointsBadge = document.getElementById(progressId.replace("-progress","-points"));
      if(pointsBadge) pointsBadge.innerText = `Points: ${points}`;
    } else {
      remaining--;
      const hrs = String(Math.floor(remaining / 3600)).padStart(2, "0");
      const mins = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
      const secs = String(remaining % 60).padStart(2, "0");
      timerEl.innerText = `Time left: ${hrs}:${mins}:${secs}`;

      const percent = ((duration - remaining) / duration) * 100;
      progressEl.style.width = percent + "%";
    }
  }, 1000);
}

// ==== INITIALIZE TIMERS ON PAGE LOAD ====
window.addEventListener("DOMContentLoaded", () => {
  startCountdown("run-timer", "run-progress", 50, 10800); // 3 hours
  startCountdown("water-timer", "water-progress", 30, 86400); // 24 hours
  startCountdown("meditation-timer", "meditation-progress", 20, 900); // 15 min
});

// ===== Animate Leaderboard Points on Scroll =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const spans = entry.target.querySelectorAll('span');
      spans.forEach(span => {
        span.classList.add('animate-points');
        let points = parseInt(span.innerText);
        let count = 0;
        const interval = setInterval(()=>{
          if(count <= points){
            span.innerText = count;
            count++;
          } else { clearInterval(interval); }
        }, 20);
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('#leaderboard-list').forEach(el => observer.observe(el));
