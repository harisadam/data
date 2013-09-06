require('ember-data/serializers/rest_serializer');

/**
  @module ember-data
*/

var get = Ember.get, isNone = Ember.isNone;

DS.ActiveModelSerializer = DS.RESTSerializer.extend({
  keyForAttribute: function(attr) {
    return Ember.String.decamelize(attr);
  },

  keyForRelationship: function(key, kind) {
    key = Ember.String.decamelize(key);
    if (kind === "belongsTo") {
      return key + "_id";
    } else if (kind === "hasMany") {
      return Ember.String.singularize(key) + "_ids";
    } else {
      return key;
    }
  },

  serializeHasMany: Ember.K,

  serializeBelongsTo: function(record, json, relationship) {
    this._super(record, json, relationship);
    var attribute = relationship.key;
    var serializedKey = this.keyForRelationship(attribute, "belongsTo");
    if (serializedKey !== attribute) {
      json[serializedKey] = json[attribute];
      delete json[attribute];
    }
  },

  serializeAttribute: function(record, json, key, attribute) {
    var attrs = get(this, 'attrs');
    var value = get(record, key), type = attribute.type;

    if (type) {
      var transform = this.transformFor(type);
      value = transform.serialize(value);
    }

    // if provided, use the mapping provided by `attrs` in
    // the serializer
    key = attrs && attrs[key] || this.keyForAttribute(key);

    json[key] = value;
  },

  serializeIntoHash: function(data, type, record, options) {
    var root = this.rootForType(type.typeKey);
    data[root] = this.serialize(record, options);
  },

  rootForType: function(type) {
    return Ember.String.decamelize(type);
  }
});

