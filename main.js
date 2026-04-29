const quoteBox = document.querySelector('#quote');
const debugBtn = document.querySelector('#debug-btn');
const emptyBtn = document.querySelector('#empty-btn');
let debug = false;

function quote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

function getCount() {
  return Number(localStorage.getItem('count') || 0);
}

function getStreak() {
  return Number(localStorage.getItem('streak') || 0);
}

function incrementCount() {
  localStorage.setItem(
    'count',
    getCount() + 1
  );
}

function setStreak(num) {
  localStorage.setItem(
    'streak',
    num
  );
}

function considerStreak(dates) {
  const currentStreak = getStreak();

  const today = dates[dates.length - 1];
  const last = dates[dates.length - 2] || false;

  if (!last) setStreak(1);

  const todayDate = new Date(today);
  const lastDate = new Date(last);

  const diffInMs = todayDate - lastDate;
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInDays < 3 && diffInDays > 0) setStreak(currentStreak + 1);

  if (diffInDays === 0) setStreak(currentStreak);

  setStreak(1);
}

function logDay() {
  const today = new Date().toLocaleDateString("en-CA");
  const type = document.querySelector('#type-selector').value;
  const workouts = JSON.parse(localStorage.getItem('workouts')) || [];

  // makes sure the same day cant be logged twice
  let dates = [];
  let valid = true;
  workouts.forEach((entry) => {
    dates.push(entry['date']);
    if (entry['date'].includes(today))
      valid = false;
  });

  if (valid || debug) {
    workouts.push({
      type: type,
      date: today
    });

    incrementCount();
    quoteBox.textContent = quote();

    localStorage.setItem(
      'workouts',
      JSON.stringify(workouts)
    );

    considerStreak(dates);
  } else {
    quoteBox.textContent = 'Huomen uusiks';
  }
}

function render() {
  document.querySelector('#count').textContent = getCount() + ' 🏅';
  document.querySelector('#streak').textContent = getStreak() + ' 🔥';
}

function renderStats() {
  const workouts = JSON.parse(localStorage.getItem('workouts')) || [];
  const list = document.querySelector('#history-list');
  list.innerHTML = '';
  workouts.forEach((workout) => {
    list.insertAdjacentHTML('afterbegin', 
      `<li>${workout.date} — ${workout.type}</li>`
    );
  });
}

document.querySelector('#done-btn').addEventListener('click', (e) => {
  logDay();
  render();
  e.target.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.15)" },
      { transform: "scale(1)" }
    ],
    { duration: 180 }
  );
});

debugBtn.addEventListener('click', () => {
  debug = !debug;
  if (debug) {
    debugBtn.textContent = `debug ON`;
    emptyBtn.style.display = 'block';
  } else {
    debugBtn.textContent = `debug OFF`;
    emptyBtn.style.display = 'none';
  }
});

emptyBtn.addEventListener('click', () => {
  localStorage.clear();
  render();
});

// stats dialog stuff
const dialog = document.querySelector('#stats-dialog');
document.querySelector('#stats-btn').addEventListener('click', () => {
  dialog.showModal();
  renderStats();
});

document.querySelector('#close-dialog-btn').addEventListener('click', () => {
  dialog.close();
});

quoteBox.textContent = quote();
render();
