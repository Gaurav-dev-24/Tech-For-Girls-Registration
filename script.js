document.addEventListener('DOMContentLoaded', function () {
  const whatsappBtn = document.getElementById('whatsappShare');
  const clickCounter = document.getElementById('clickCounter');
  const fileUploadGroup = document.getElementById('fileUploadGroup');
  const shareCompleteMsg = document.getElementById('shareCompleteMsg');
  const form = document.getElementById('form');

  let count = 0;
  const maxClicks = 5;

  // Initially hide upload section and message
  fileUploadGroup.style.display = 'none';
  shareCompleteMsg.style.display = 'none';

  // Disable form submission until sharing is complete
  form.addEventListener('submit', function (e) {
    if (count < maxClicks) {
      e.preventDefault();
      alert("Please complete WhatsApp sharing first (5 times)!");
    }
  });

  whatsappBtn.addEventListener('click', function () {
    if (count < maxClicks) {
      count++;
      clickCounter.textContent = `Click count: ${count}/${maxClicks}`;

      const url = encodeURIComponent(window.location.href);
      const message = encodeURIComponent("Hey buddy, join Tech For Girls Community! " + url);
      window.open(`https://wa.me/?text=${message}`, '_blank');

      if (count === maxClicks) {
        whatsappBtn.disabled = true;
        whatsappBtn.style.opacity = 0.6;
        whatsappBtn.style.cursor = 'not-allowed';
        fileUploadGroup.style.display = 'flex';
        shareCompleteMsg.style.display = 'block';
      }
    }
  });
});
