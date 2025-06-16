const images = [
  { file: "作品.jpg", desc: "這是作品1的描述" },
  { file: "作品2.jpg", desc: "這是作品2的描述" },
  { file: "作品3.jpg", desc: "這是作品3的描述" }
];

let currentIndex = 0;
let isAnimating = false;

function openImage(index) {
  console.log("點擊了縮圖，index=", index);
  currentIndex = index;
  updateModal();

  const modal = document.getElementById('imageModal');
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  modal.removeAttribute('inert');
  modal.focus();

  console.log('modal 是否有 hidden class?', modal.classList.contains('hidden'));
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  modal.setAttribute('inert', '');

  const firstThumb = document.querySelector('.image-card');
  if (firstThumb) firstThumb.focus();
}

function updateModal() {
  if (isAnimating) return; 
  isAnimating = true;

  const modalImage = document.getElementById('modalImage');
  const modalDesc = document.getElementById('modalDesc');

  modalImage.classList.add('fade-out');

  setTimeout(() => {
    modalImage.src = 'image/' + images[currentIndex].file;
    modalDesc.textContent = images[currentIndex].desc;
    modalImage.classList.remove('fade-out');

    isAnimating = false;
    console.log('updateModal currentIndex:', currentIndex);
  }, 500); 
}

function showNext() {
  currentIndex = (currentIndex + 1) % images.length;
  console.log('showNext currentIndex:', currentIndex);
  updateModal();
}

function showPrev() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  console.log('showPrev currentIndex:', currentIndex);
  updateModal();
}

function toggleDetail(element) {
  element.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('imageModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const nextBtn = document.getElementById('modalNextBtn');
  const prevBtn = document.getElementById('modalPrevBtn');

  closeBtn.addEventListener('click', closeModal);

  nextBtn.addEventListener('click', () => {
    showNext();
  });

  prevBtn.addEventListener('click', () => {
    showPrev();
  });

  modal.addEventListener('click', e => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('hidden')) {
      if (e.key === 'Escape') closeModal();
      else if (e.key === 'ArrowRight') {
        console.log('ArrowRight pressed');
        showNext();
      }
      else if (e.key === 'ArrowLeft') {
        console.log('ArrowLeft pressed');
        showPrev();
      }
    }
  });

  const scrollGallery = document.querySelector('.scroll-gallery');
  if (scrollGallery) {
    let isDown = false;
    let startX;
    let scrollLeft;

    scrollGallery.addEventListener('mousedown', e => {
      isDown = true;
      scrollGallery.classList.add('active');
      startX = e.pageX - scrollGallery.offsetLeft;
      scrollLeft = scrollGallery.scrollLeft;
    });

    scrollGallery.addEventListener('mouseleave', () => {
      isDown = false;
      scrollGallery.classList.remove('active');
    });

    scrollGallery.addEventListener('mouseup', () => {
      isDown = false;
      scrollGallery.classList.remove('active');
    });

    scrollGallery.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollGallery.offsetLeft;
      const walk = (x - startX) * 2; 
      scrollGallery.scrollLeft = scrollLeft - walk;
    });
  }

  const cards = document.querySelectorAll('.image-card');
  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });
  cards.forEach(card => cardObserver.observe(card));

  const sections = document.querySelectorAll('.section');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  sections.forEach(section => sectionObserver.observe(section));

  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  });
});
