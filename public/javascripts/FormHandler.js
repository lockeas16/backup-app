class FormHandler {
  constructor(baseUrl = "http://localhost:3000") {
    this.baseUrl = baseUrl;
  }
  createZone(data) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${this.baseUrl}/zones/new`, data)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
