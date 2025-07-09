document.addEventListener('DOMContentLoaded', function () {
  const whatsappBtn = document.getElementById('whatsappShare');
  const clickCounter = document.getElementById('clickCounter');
  const fileUploadGroup = document.getElementById('fileUploadGroup');
  const shareCompleteMsg = document.getElementById('shareCompleteMsg');
  const form = document.getElementById('form');
  const successMessage = document.getElementById('message');

  let count = 0;
  const maxClicks = 5;

  // If already submitted, disable form
  if (localStorage.getItem("submitted") === "true") {
    form.style.pointerEvents = "none";
    whatsappBtn.disabled = true;
    whatsappBtn.style.opacity = 0.6;
    whatsappBtn.style.cursor = 'not-allowed';
    fileUploadGroup.style.display = 'none';
    shareCompleteMsg.style.display = 'none';
    successMessage.textContent = "🎉 You already submitted!";
    successMessage.style.display = 'flex';
    return;
  }

  // Hide upload & message initially
  fileUploadGroup.style.display = 'none';
  shareCompleteMsg.style.display = 'none';
  successMessage.style.display = 'none';

  whatsappBtn.addEventListener('click', function () {
    if (count < maxClicks) {
      count++;
      clickCounter.textContent = `Click count: ${count}/${maxClicks}`;
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent('Hey buddy, join the Tech for Girls Community! Register now: ' + url);
      window.open(`https://wa.me/?text=${text}`, '_blank');

      if (count === maxClicks) {
        whatsappBtn.disabled = true;
        whatsappBtn.style.opacity = 0.6;
        whatsappBtn.style.cursor = 'not-allowed';
        fileUploadGroup.style.display = 'flex';
        shareCompleteMsg.style.display = 'block';
      }
    }
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (count < 5) {
      alert("Please complete WhatsApp sharing first.");
      return;
    }

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const college = document.getElementById("college").value.trim();
    const fileInput = document.getElementById("screenshot");
    const file = fileInput.files[0];

    if (!file) {
      alert("Please upload a screenshot.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async function () {
      const base64 = reader.result.split(",")[1];

      const data = {
        name,
        phone,
        email,
        college,
        screenshot: {
          name: file.name,
          type: file.type,
          base64: base64
        }
      };

      try {
        const res = await fetch("https://script.google.com/macros/s/AKfycbyRCAdyPpi2t47LTv1UsUQ5bczLiE5iT_SJQ2AQx4iXa1aORUWl0HyJwVOtOV-r_kb-/exec", {
          method: "POST",
          mode="no-cors",
          
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await res.json();
        if (result.success) {
          localStorage.setItem("submitted", "true");
          form.reset();
          form.style.pointerEvents = "none";
          successMessage.textContent = "🎉 Your submission has been recorded. Thanks for being part of Tech for Girls!";
          successMessage.style.display = 'flex';
        } else {
          alert("Something went wrong: " + result.error);
        }
      } catch (err) {
        alert("Something went wrong. Please try again.");
      }
    };

    reader.readAsDataURL(file);
  });
});
