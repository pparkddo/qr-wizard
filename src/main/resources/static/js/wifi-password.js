class WifiPassword {

  static QR_STROKE_COLOR() {
    return "#FF3B58";
  }

  constructor() {
    this.video = null;
    this.canvasElement = null;
    this.canvas = null;
    this.loadingMessage = null;
    this.outputContainer = null;
    this.outputMessage = null;
    this.outputData = null;
    this.findByFacingCamButton = null;
    this.stopFacingCamButton = null;
    this._setVars();
    this._bindEvent();
  }

  _setVars() {
    this.video = document.createElement("video");
    this.canvasElement = document.getElementById("canvas");
    this.canvas = this.canvasElement.getContext("2d");
    this.loadingMessage = document.getElementById("loadingMessage");
    this.outputContainer = document.getElementById("output");
    this.outputMessage = document.getElementById("outputMessage");
    this.outputData = document.getElementById("outputData");
    this.findByFacingCamButton = document.getElementById("findByFacingCam");
    this.stopFacingCamButton = document.getElementById("stopFacingCam");
  }

  _bindEvent() {
    this.findByFacingCamButton.onclick = () => {
      this.findByFacingCamButton.hidden = true;
      this.stopFacingCamButton.hidden = false;
      this._useFacingCam();
    };
    this.stopFacingCamButton.onclick = () => {
      this.findByFacingCamButton.hidden = false;
      this.stopFacingCamButton.hidden = true;
      this.loadingMessage.innerText = "";
      this.loadingMessage.hidden = false;
      this.canvasElement.hidden = true;
      this._stopFacingCam();
    };
  }

  _stopFacingCam() {
    this.video.srcObject.getVideoTracks()[0].stop();
    this.video.srcObject = null;
  }

  _drawLine(begin, end, color) {
    this.canvas.beginPath();
    this.canvas.moveTo(begin.x, begin.y);
    this.canvas.lineTo(end.x, end.y);
    this.canvas.lineWidth = 4;
    this.canvas.strokeStyle = color;
    this.canvas.stroke();
  }

  _useFacingCam() {
    this.loadingMessage.innerText = "⌛ Loading video...";

    // Use facingMode: environment to attempt to get the front camera on phones
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        this.video.srcObject = stream;
        this.video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        this.video.play();
        requestAnimationFrame(() => this._tick());
      });
  }

  _tick() {
    if (!this.video.srcObject) {
      return;
    }

    if (this.video.readyState !== this.video.HAVE_ENOUGH_DATA) {
      this.loadingMessage.innerText = "⌛ Loading video...";
      requestAnimationFrame(() => this._tick());
      return;
    }

    this.loadingMessage.hidden = true;
    this.canvasElement.hidden = false;
    this.outputContainer.hidden = false;

    this.canvasElement.height = this.video.videoHeight;
    this.canvasElement.width = this.video.videoWidth;
    this.canvas.drawImage(this.video, 0, 0, this.canvasElement.width, this.canvasElement.height);

    const imageData = this.canvas.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);
    const code = jsQR(
      imageData.data,
      imageData.width,
      imageData.height,
      { inversionAttempts: "dontInvert"}
    );

    if (code) {
      this._drawLine(code.location.topLeftCorner, code.location.topRightCorner, WifiPassword.QR_STROKE_COLOR());
      this._drawLine(code.location.topRightCorner, code.location.bottomRightCorner, WifiPassword.QR_STROKE_COLOR());
      this._drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, WifiPassword.QR_STROKE_COLOR());
      this._drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, WifiPassword.QR_STROKE_COLOR());
      this.outputMessage.hidden = true;
      this.outputData.parentElement.hidden = false;
      this.outputData.innerText = code.data;
    }
    else {
      this.outputMessage.hidden = false;
      this.outputData.parentElement.hidden = true;
    }

    requestAnimationFrame(() => this._tick());
  }
}

window.onload = () => new WifiPassword();
