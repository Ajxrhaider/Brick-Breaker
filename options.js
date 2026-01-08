
 const canvas = document.getElementById("myCanvas");
      const ctx = canvas.getContext("2d");
      const video = document.getElementById("bgVideo");

      const menuItems = [
        { text: "Sorry But we havent Gotten that far yet", x: 590, y: 255, width: 100, height: 40, },
        { text: "We are at least going to have it ready before the one piece is found", x: 590, y: 360, width: 200, height: 40, },
        { text: "Click here to go back to the menu", x: 590, y: 470, width: 200, height: 40, url: "Menu.html" }
      ];

      let mouseX = 0;
      let mouseY = 0;
      let frameCount = 0;

      canvas.addEventListener("mousemove", function (event) {
        const rect = canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
      });

      canvas.addEventListener("click", function (event) {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        menuItems.forEach(item => {
          const left = item.x - item.width / 2;
          const top = item.y - item.height / 2;

          if (
            clickX >= left &&
            clickX <= left + item.width &&
            clickY >= top &&
            clickY <= top + item.height
          ) {
            if (item.url !== "#") {
              window.location.href = item.url;
            }
          }
        });
      });

      function drawMenu() {
  menuItems.forEach(item => {
    const left = item.x - item.width / 2;
    const top = item.y - item.height / 2;
    const isHovered = mouseX >= left && mouseX <= left + item.width &&
                      mouseY >= top && mouseY <= top + item.height;

    const shrink = frameCount % 120 < 60;
    let fontSize = isHovered ? 36 : shrink ? 26 : 30;

    ctx.font = `${fontSize}px 'Space Grotesk'`;
    ctx.textAlign = "center";

    // Shadow settings
    ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Text color
    ctx.fillStyle = isHovered ? "white" : "orange";
    ctx.fillText(item.text, item.x, item.y);

    // Reset shadows (just in case anything else is drawn later)
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  });
}


      window.addEventListener("load", () => {
        video.play().then(() => {
          function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            drawMenu();
            frameCount++;
            requestAnimationFrame(draw);
          }

          document.fonts.ready.then(draw);
        }).catch((err) => {
          console.error("Video playback failed:", err);
        });
      });
    </script>
  </body>
</html>
