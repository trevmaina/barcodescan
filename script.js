// script.js

// Function to initialize the barcode scanner
function initializeScanner() {
  document.getElementById("scanner").style.display = "block";
  document.getElementById("stop-scan").style.display = "inline-block"; // Show stop button

  Quagga.init(
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector("#scanner"),
        constraints: {
          facingMode: "environment", // Use the rear camera on mobile devices
        },
      },
      decoder: {
        readers: [
          "code_128_reader",
          "ean_reader",
          "ean_8_reader",
          "code_39_reader",
          "code_39_vin_reader",
          "codabar_reader",
          "upc_reader",
          "upc_e_reader",
        ],
      },
    },
    function (err) {
      if (err) {
        console.error(err);
        return;
      }
      Quagga.start();
    }
  );

  Quagga.onDetected(handleBarcodeDetected);
}

// Function to handle barcode detection
function handleBarcodeDetected(data) {
  const code = data.codeResult.code;
  document.getElementById("result").innerText = `Scanned Code: ${code}`;
  Quagga.stop(); // Stop scanning after detecting the barcode
  document.getElementById("scanner").style.display = "none";
  document.getElementById("stop-scan").style.display = "none"; // Hide stop button
}

// Function to stop the barcode scanner
function stopScanner() {
  Quagga.stop();
  document.getElementById("scanner").style.display = "none";
  document.getElementById("stop-scan").style.display = "none"; // Hide stop button
}

// Event listener for Start Scanning button
document
  .getElementById("start-scan")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    initializeScanner();
  });

// Event listener for Stop Scanning button
document
  .getElementById("stop-scan")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    stopScanner();
  });

// Event listener for Upload Image button to trigger file input
document
  .getElementById("upload-button")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    stopScanner(); // Stop the camera if it's running
    document.getElementById("upload-image").click();
  });

// Event listener for file input change
document
  .getElementById("upload-image")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        Quagga.decodeSingle(
          {
            src: img.src,
            numOfWorkers: 0, // Needs to be 0 when used within node
            inputStream: {
              size: 800, // restrict input-size to be 800
            },
            decoder: {
              readers: [
                "code_128_reader",
                "ean_reader",
                "ean_8_reader",
                "code_39_reader",
                "code_39_vin_reader",
                "codabar_reader",
                "upc_reader",
                "upc_e_reader",
              ],
            },
          },
          function (result) {
            if (result && result.codeResult) {
              document.getElementById(
                "result"
              ).innerText = `Scanned Code: ${result.codeResult.code}`;
            } else {
              document.getElementById("result").innerText =
                "No barcode detected";
            }
          }
        );
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
