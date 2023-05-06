function updateElementsPosition() {

  const element1 = document.querySelector('.pageContent_conditions');
  const element2 = document.querySelector('.pageContent_privacy');
  const element3 = document.querySelector('.pageContent_press');
  const element4 = document.querySelector('.pageContent_footer');

  const afterElement1 = document.querySelector('.pageContent_conditions:after');
  const afterElement2 = document.querySelector('.pageContent_privacy:after');
  const afterElement3 = document.querySelector('.pageContent_press:after');

  element2.style.top = `${element1.offsetTop + element1.offsetHeight + 100}px`;
  element3.style.top = `${element2.offsetTop + element2.offsetHeight + 100}px`;
  element4.style.top = `${element3.offsetTop + element3.offsetHeight + 100}px`;

  afterElement1.style.height = `${element2.offsetTop - element1.offsetHeight}px`;
  afterElement2.style.height = `${element3.offsetTop - element2.offsetHeight}px`;
  afterElement3.style.height = `${element4.offsetTop - element3.offsetHeight}px`;
}

updateElementsPosition();
window.addEventListener('resize', updateElementsPosition);