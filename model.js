class DeviceState {
  constructor() {
    this.state = false;
    this.mode; // 현재 모드
    this.windSpeed; // 바람 속도
    this.uv; // uv 램프
    this.humidifier; // 가습기
    this.petier; // 펠티어
    this.temperature; //온도
    this.humidity; // 습도
    this.dust={'1.0':null,'2.5':null,'10.0':null};

  }

  updata(json) {
    this.state = json.state;
    this.mode = json.mode;
    this.windSpeed = json.windSpeed;
    this.uv = json.uv;
    this.humidifier = json.humidifier;
    this.petier = json.petier;
    this.temperature = json.temperature;
    this.humidity = json.humidity;
    this.dust["1.0"] = json.dust['1.0'];
    this.dust['2.5'] = json.dust['2.5'];
    this.dust['10.0'] = json.dust['10.0'];
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