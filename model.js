class DeviceState {
  constructor() {
    this.state = false;
    this.mode; // 현재 모드
    this.windSpeed; // 바람 속도
    this.uv; // uv 램프
    this.humidifier; // 가습기
    this.petier; // 펠티어
  }

  updata(json) {
    this.state = json.state;
    this.mode = json.mode;
    this.windSpeed = json.windSpeed;
    this.uv = json.uv;
    this.humidifier = json.humidifier;
    this.petier = json.petier;
  }

  get data() {
    return {
      state: this.state,
      mode: this.mode,
      windSpeed: this.windSpeed,
      uv: this.uv,
      humidifier: this.humidifier,
      petier: this.petier,
    };
  }
}

module.exports = DeviceState;