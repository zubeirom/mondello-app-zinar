import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { set, action } from "@ember/object";

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
    set(this, "loader", true);
    try {
      await this.session
        .authenticate("authenticator:oauth2", this.username, this.password)
        .catch((reason) => {
          console.log(reason);
          set(this, "loader", false);
          this.toast.error("Kennwort oder Benutzername ist falsch", "Error");
        });
      set(this, "loader", false);
    } catch (error) {
      console.log(error);
      set(this, "loader", false);
      if (error) {
        this.toast.error("Kennwort oder Benutzername ist falsch", "Error");
      }
    }
  }

  @action
  redirect() {
    this.send("authenticate");
  }
}
