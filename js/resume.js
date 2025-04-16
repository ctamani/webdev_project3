document.addEventListener("DOMContentLoaded", function () {
  const projects = document.querySelectorAll('.project-item');
  const leftBtn = document.querySelector('.left-btn');
  const rightBtn = document.querySelector('.right-btn');
  let currentIndex = 0;

  function showProject(index) {
    projects.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
  }

  leftBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + projects.length) % projects.length;
  showProject(currentIndex);
  });

  rightBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % projects.length;
  showProject(currentIndex);
  });

  // Initialize
  showProject(currentIndex);

  // Skills Section
  const skills = document.querySelectorAll('.skills-list li');
  skills.forEach(skill => {
    skill.addEventListener('mouseenter', function() {
    skill.classList.add('hovered');
    });
    skill.addEventListener('mouseleave', function() {
    skill.classList.remove('hovered');
    });
  });
});