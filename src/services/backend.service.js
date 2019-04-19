import * as data from "../assets/stories.json";

export default class BackendService {
  constructor() {}

  getDrafts() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(data.stories);
      }, 200);
    });
  }

  postToServer(payload) {
    console.log(`sending payload to server: ${payload}`);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          status: 200,
          data: {
            someData: "someData"
          }
        });
      }, 500);
    });
  }
}
