class WifiPassword {

  static QR_STROKE_COLOR() {
    return "#FF3B58";
  }

  static WIFI_DELIMITER() {
    return ";";
  }

  static WIFI_PASSWORD_PREFIX() {
    return "P:";
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
    this.loadingMessage = document.getElementById("loading-message");
    this.outputContainer = document.getElementById("output");
    this.outputMessage = document.getElementById("output-message");
    this.outputData = document.getElementById("output-data");
    this.findByFacingCamButton = document.getElementById("find-by-facing-cam");
    this.stopFacingCamButton = document.getElementById("stop-facing-cam");
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

  _noticeVideoLoading() {
    this.loadingMessage.innerText = "⌛ Loading video...";
  }

  _useFacingCam() {
    this._noticeVideoLoading();

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
      this._noticeVideoLoading();
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
      { inversionAttempts: "dontInvert" }
    );

    if (code) {
      this._drawLine(code.location.topLeftCorner, code.location.topRightCorner, WifiPassword.QR_STROKE_COLOR());
      this._drawLine(code.location.topRightCorner, code.location.bottomRightCorner, WifiPassword.QR_STROKE_COLOR());
      this._drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, WifiPassword.QR_STROKE_COLOR());
      this._drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, WifiPassword.QR_STROKE_COLOR());
      this.outputData.parentElement.hidden = false;

      const data = code.data;
      try {
        const wifiPassword = this._extractQrPassword(code.data);
        if (wifiPassword) {
          this._stopFacingCam();
          this._goToResultPage(wifiPassword);
        }
      }
      catch (e) {
        this.outputMessage.innerText = "올바른 와이파이 QR 이 아닙니다";
        this.outputData.innerText = data;
      }
    }
    else {
      this.outputMessage.hidden = false;
      this.outputData.parentElement.hidden = true;
    }

    requestAnimationFrame(() => this._tick());
  }

  _goToResultPage(pw) {
    location.href = `/wifi-password/show?pw=${pw}`;
  }

  _extractQrPassword(value) {
    const separatedByDelimiter = value.split(WifiPassword.WIFI_DELIMITER())[2];
    return separatedByDelimiter.split(WifiPassword.WIFI_PASSWORD_PREFIX())[1];
  }
}

window.onload = () => new WifiPassword();
