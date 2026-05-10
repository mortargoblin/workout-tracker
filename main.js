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

  if (dates.length === 1) {
    setStreak(1);
    return;
  }

  const today = new Date(dates[dates.length - 1]);
  const last = new Date(dates[dates.length - 2]);

  today.setHours(0,0,0,0);
  last.setHours(0,0,0,0);

  const diffInMs = today - last;
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInDays < 3 && diffInDays > 0) {
    setStreak(currentStreak + 1);
  } else if (diffInDays === 0) {
    setStreak(currentStreak);
  } else {
    setStreak(1);
  }
}

function logDay(customDate = null) {
  const today = customDate || new Date().toLocaleDateString("en-CA");
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

    dates.push(today);

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
  render();
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
