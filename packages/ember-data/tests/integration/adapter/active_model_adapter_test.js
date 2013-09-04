var env, store, adapter, SuperUser;
var originalAjax, passedUrl, passedVerb, passedHash;
module("integration/adapter/active_model_adapter - AMS Adapter", {
  setup: function() {
    SuperUser = DS.Model.extend();

    env = setupStore({
      superUser: SuperUser,
      adapter: DS.ActiveModelAdapter
    });

    store = env.store;
    adapter = env.adapter;

    passedUrl = passedVerb = passedHash = null;
  }
});

function ajaxResponse(value) {
  adapter.ajax = function(url, verb, hash) {
    passedUrl = url;
    passedVerb = verb;
    passedHash = hash;

    return Ember.RSVP.resolve(value);
  };
}

test('buildURL - decamelizes names', function() {
  ajaxResponse({ superUsers: [{ id: 1 }] });

  store.find('superUser', 1).then(async(function(post) {
    equal(passedUrl, "/super_users/1");
  }));
});