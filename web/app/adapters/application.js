import RESTAdapter from "@ember-data/adapter/rest";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";

export default class ApplicationAdapter extends RESTAdapter {
  @service session;

  // eslint-disable-next-line ember/require-computed-property-dependencies
  @computed("session.data.authenticated.access_token")
  get headers() {
    let headers = {};
    if (this.session.isAuthenticated) {
      // OAuth 2
      headers[
        "Authorization"
      ] = `Bearer ${this.session.data.authenticated.access_token}`;
    }

    return headers;
  }
}
