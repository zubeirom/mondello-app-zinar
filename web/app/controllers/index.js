import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
export default class IndexController extends Controller {
  @service session;
  @service toast;

  @action
  async save() {
    const response = await fetch("http://localhost:3000/wk", {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.session.data.authenticated.access_token}`,
      },
      body: JSON.stringify(this.model), // body data type must match "Content-Type" header
    });
    if (response.status === 401) {
      this.session.invalidate();
      this.toast.error("Nicht Erlaubt");
    }

    if (response.status === 200) {
      this.toast.success("Änderungen gespeichert", "Fertig!");
    }
  }
}
