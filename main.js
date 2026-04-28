
let count = 0;

document.querySelector("#done-btn")
  .addEventListener('click', () => {
    count++;
    renderCount();
  });

function renderCount() {
  document.querySelector('#count').textContent = count;
}
