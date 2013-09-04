var get = Ember.get, set = Ember.set;
var SuperFramework, framework, Person, person, SuperMinion, env;

module("integration/serializer/active_model - ActiveModelSerializer", {
  setup: function() {
    Person = DS.Model.extend({
      firstName:      DS.attr('string'),
      lastName:       DS.attr('string'),
      superFramework: DS.belongsTo("super_framework"),
      superMinions:   DS.hasMany("super_minion")
    });
    SuperFramework = DS.Model.extend({
      name: DS.attr('string'),
      people: DS.hasMany('person')
    });
    SuperMinion = DS.Model.extend({
      name: DS.attr('string')
    });
    env = setupStore({
      person:         Person,
      super_framework: SuperFramework,
      super_minion:    SuperMinion
    });
    env.store.modelFor('person');
    env.store.modelFor('super_framework');
    env.container.register('serializer:person', DS.ActiveModelSerializer);
    env.personSerializer = env.container.lookup("serializer:person");
  },

  teardown: function() {
    env.store.destroy();
  }
});

test("serialize", function() {
  framework = env.store.createRecord(SuperFramework, { name: "Umber", id: "123" });
  person    = env.store.createRecord(Person, { firstName: "Tom", lastName: "Dale", superFramework: framework });

  var json = env.personSerializer.serialize(person);

  deepEqual(json, {
    first_name:   "Tom",
    last_name:    "Dale",
    super_framework_id: get(framework, "id")
  });
});

test("normalize", function() {
  var person_hash = {first_name: "Tom", last_name: "Dale", super_framework_id: "123", super_minion_ids: [1,2]};

  var json = env.personSerializer.normalize(Person, "person", person_hash);

  deepEqual(json, {
    firstName:      "Tom",
    lastName:       "Dale",
    superFramework: "123",
    superMinions:   [1,2]
  });
});
