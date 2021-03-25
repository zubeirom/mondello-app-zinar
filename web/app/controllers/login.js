import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { set, action, get } from "@ember/object";

export default class LoginController extends Controller {
  @service toast;
  @service session;

  isValid(username, password) {
    if (
      username === undefined ||
      (username === "" && password === undefined) ||
      password === ""
    ) {
      this.toastr.warning("Please enter something", "Warning");
      return false;
    }
    return true;
  }

  @action
  async authenticate() {
    this.toastr.info(
      "Server (heroku) is starting up, this might take few seconds",
      "Important Info"
    );
    set(this, "loader", true);
    try {
      if (this.isValid(this.username, this.password)) {
        await get("session")
          .authenticate("authenticator:oauth2", this.username, this.password)
          .catch((reason) => {
            set(this, "loader", false);
            this.set("errorMessage", reason.error || reason);
            this.toast.error("Password or username is wrong", "Error");
          });
      }
      set(this, "loader", false);
    } catch (error) {
      set(this, "loader", false);
      if (error) {
        this.toast.error("Password or username is wrong", "Error");
      }
    }
  }

  @action
  redirect() {
    this.send("authenticate");
  }
}
