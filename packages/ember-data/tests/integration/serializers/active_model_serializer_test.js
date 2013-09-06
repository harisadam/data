var get = Ember.get, set = Ember.set;
var SuperFramework, framework, Person, person, SuperMinion, env;

module("integration/serializer/active_model - ActiveModelSerializer", {
  setup: function() {
    Person = DS.Model.extend({
      firstName:      DS.attr('string'),
      lastName:       DS.attr('string'),
      superFramework: DS.belongsTo("superFramework"),
      superMinions:   DS.hasMany("superMinion")
    });
    SuperFramework = DS.Model.extend({
      name: DS.attr('string'),
      people: DS.hasMany('person'),
      superMinions: DS.hasMany('superMinion')
    });
    SuperMinion = DS.Model.extend({
      name: DS.attr('string')
    });
    env = setupStore({
      person:         Person,
      superFramework: SuperFramework,
      superMinion:    SuperMinion
    });
    env.store.modelFor('person');
    env.store.modelFor('superFramework');
    env.store.modelFor('superMinion');
    env.container.register('serializer:ams', DS.ActiveModelSerializer);
    env.container.register('adapter:ams', DS.ActiveModelAdapter);
    env.amsSerializer = env.container.lookup("serializer:ams");
    env.amsAdapter    = env.container.lookup("adapter:ams");
  },

  teardown: function() {
    env.store.destroy();
  }
});

test("serialize", function() {
  framework = env.store.createRecord(SuperFramework, { name: "Umber", id: "123" });
  person    = env.store.createRecord(Person, { firstName: "Tom", lastName: "Dale", superFramework: framework });

  var json = env.amsSerializer.serialize(person);

  deepEqual(json, {
    first_name:   "Tom",
    last_name:    "Dale",
    super_framework_id: get(framework, "id")
  });
});

test("serializeIntoHash", function() {
  framework = env.store.createRecord(SuperFramework, { name: "Umber", id: "123" });
  var json = {};

  env.amsSerializer.serializeIntoHash(json, SuperFramework, framework);

  deepEqual(json, {
    super_framework: {
      name:   "Umber"
    }
  });
});

test("normalize", function() {
  var person_hash = {first_name: "Tom", last_name: "Dale", super_framework_id: "123", super_minion_ids: [1,2]};

  var json = env.amsSerializer.normalize(Person, person_hash, "person");

  deepEqual(json, {
    firstName:      "Tom",
    lastName:       "Dale",
    superFramework: "123",
    superMinions:   [1,2]
  });
});
