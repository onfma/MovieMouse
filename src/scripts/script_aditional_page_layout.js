function updateElementsPosition() {
    const element1 = document.querySelector('.pageContent_1');
    const element2 = document.querySelector('.pageContent_2');
    const element3 = document.querySelector('.pageContent_3');
    const element4 = document.querySelector('.pageContent_4');
    const element5 = document.querySelector('.pageContent_5');
    const element6 = document.querySelector('.pageContent_footer');

    const afterElement1 = document.querySelector('.pageContent_1:after');
    const afterElement2 = document.querySelector('.pageContent_2:after');
    const afterElement3 = document.querySelector('.pageContent_3:after');
    const afterElement4 = document.querySelector('.pageContent_4:after');
    const afterElement5 = document.querySelector('.pageContent_5:after');

    element2.style.top = `${element1.offsetTop + element1.offsetHeight + 100}px`;
    element3.style.top = `${element2.offsetTop + element2.offsetHeight + 100}px`;
    element4.style.top = `${element3.offsetTop + element3.offsetHeight + 100}px`;
    element5.style.top = `${element4.offsetTop + element4.offsetHeight + 100}px`;
    element6.style.top = `${element5.offsetTop + element5.offsetHeight + 60}px`;

    afterElement1.style.height = `${element2.offsetTop - element1.offsetHeight}px`;
    afterElement2.style.height = `${element3.offsetTop - element2.offsetHeight}px`;
    afterElement3.style.height = `${element4.offsetTop - element3.offsetHeight}px`;
    afterElement4.style.height = `${element5.offsetTop - element4.offsetHeight}px`;
    afterElement5.style.height = `${element6.offsetTop - element5.offsetHeight}px`;
  }

updateElementsPosition();
window.addEventListener('resize', updateElementsPosition);