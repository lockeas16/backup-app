class ZoneHandler {
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
  getZone(id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.baseUrl}/zones/${id}/getJSON`)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  updateZone(id, data) {
    return new Promise((resolve, reject) => {
      axios
        .patch(`${this.baseUrl}/zones/${id}/update`, data)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
