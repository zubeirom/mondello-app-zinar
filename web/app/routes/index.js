import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class IndexRoute extends Route {
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, "login");
  }

  async model() {
    const res = await fetch("https://api-mondello.vercel.app/wk");
    return await res.json();
  }
}
