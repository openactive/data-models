# Model file format

## Model

Each model should have a file corresponding to it in `src/models`. The name of the file should correspond to the name of the object the model is describing.

e.g. for model **Event**, the file name should be **Event.json**.

### Properties

#### type

The type of object that this model describes. The name of the file should correspond to the name of the object the model is describing.

```json
{
  "type": "Event"
}
```

#### sameAs

TODO

#### derivedFrom

A url pointing to any external objects that this model derives from.

```json
{
  "derivedFrom": "http://schema.org/Event"
}
```

#### hasId

A `boolean` indicating whether this model has an `id` field.

```json
{
  "hasId": true
}
```

#### idFormat

The format that the id should be represented as.

```json
{
  "idFormat": "http://schema.org/url"
}
```

#### sampleId

An example `id`.

```json
{
  "sampleId": "https://example.com/event/"
}
```

#### requiredFields

An array of field names that are **REQUIRED** in the specification. This should only include fields that are explicitly mentioned in the OpenActive spec.

```json
{
  "requiredFields": [
    "id",
    "@context",
    "type"
  ]
}
```

#### requiredOptions

Where one of a collection of fields are required (e.g. an Event must have a `schema:startDate` or `oa:eventSchedule`), this can be specified here.

```json
{
  "requiredOptions": [
    {
      "description": [
        "While these properties are marked as optional, a data publisher must provide either a schema:startDate or specify a oa:eventSchedule for an event."
      ],
      "options": [
        "startDate",
        "eventSchedule"
      ]
    }
  ]
}
```

#### recommendedFields

An array of field names that are **RECOMMENDED** in the specification. This should only include fields that are explicitly mentioned in the OpenActive spec.

```json
{
  "recommendedFields": [
    "description",
    "image",
    "organizer"
  ]
}
```

#### inSpec

An array of field names that are defined in the specification. This should only include fields that are explicitly mentioned in the OpenActive spec.

This **MUST** include **ALL** required, recommended and optional fields.

```json
{
  "inSpec": [
    "id",
    "@context",
    "name"
  ]
}
```

#### commonTypos

An key-value object of common typos for field names.

```json
{
  "commonTypos": {
    "offer": "offers"
  }
}
```

#### fields

An key-value object of Fields (see below).

```json
{
  "fields": {
    "description": {
      "fieldName": "description",
      "requiredType": "http://schema.org/Text",
      "example": "An fast paced game that incorporates netball, handball and football.",
      "description": [
        "A free text description of the event"
      ]
    }
  }
}
```

#### betaFields

TODO

#### description

TODO

#### namedExamples

TODO

## Field

### Properties

#### fieldName

The name of the field. In the `Model.fields` or `Model.betaFields` layout, this should match the key of the field.

```json
{
  "fieldName": "description"
}
```

#### model

The name of the model this field should conform to. This should reference another model that we have a local definition for.

```json
{
  "model": "#Event"
}
```

If this is an array of models, you can represent it as below:

```json
{
  "model": "ArrayOf#Event"
}
```

#### alternativeModels

Alternative models this field should conform to. This should reference another model that we have a local definition for.

```json
{
  "model": "#Event",
  "alternativeModels": [
    "ArrayOf#Event"
  ]
}
```

#### requiredType

The schema.org type this field should conform to.

```json
{
  "requiredType": "http://schema.org/url"
}
```

If this is an array of values, you can represent it as below:

```json
{
  "requiredType": "ArrayOf#http://schema.org/url"
}
```

#### alternativeTypes

Alternative schema.org types this field can conform to.

```json
{
  "requiredType": "http://schema.org/url",
  "alternativeTypes": [
    "ArrayOf#http://schema.org/url"
  ]
}
```

#### requiredContent

If this property must be set to a specific value, this can be specified here.

```json
{
  "fieldName": "type",
  "requiredType": "http://schema.org/Text",
  "requiredContent": "Event",
  "description": "",
  "example": "Event"
}
```

#### description

An array of strings (one per paragraph), describing this field.

```json
{
  "description": [
    "A URL to a web page (or section of a page) that describes the event."
  ]
}
```

#### example

An example value of this field, for documentation.

```json
{
  "fieldName": "url",
  "requiredType": "http://schema.org/url",
  "description": [
    "A URL to a web page (or section of a page) that describes the event."
  ],
  "example": "https://example.com/event/1234"
}
```

#### context

TODO

#### options

If this property must be set to a specific value picked from a list (e.g. an `enum`), the list values can be specified here.

```json
{
  "fieldName": "eventStatus",
  "requiredType": "http://schema.org/url",
  "description": [
    "The status of an event. Can be used to indicate rescheduled or cancelled events"
  ],
  "options": [
    "http://schema.org/EventCancelled",
    "http://schema.org/EventPostponed",
    "http://schema.org/EventRescheduled",
    "http://schema.org/EventScheduled"
  ],
  "example": "http://schema.org/EventScheduled"
}
```

#### inheritsTo

If this property allows an object to pass values down for inheritance by the child, you can specify this in a number of ways.

If all fields are inheritable:

```json
{
  "fieldName": "subEvent",
  "inheritsTo": "*"
}
```

To specify a blacklist of fields:

```json
{
  "fieldName": "subEvent",
  "inheritsTo": {
    "exclude": ["id", "identifier", "subEvent", "superEvent"]
  }
}
```

To specify a whitelist of fields:

```json
{
  "fieldName": "subEvent",
  "inheritsTo": {
    "include": ["name", "description", "startDate", "endDate"]
  }
}
```

`exclude` takes precedence over `include`.

#### inheritsFrom

If this property allows an object to inherit properties from it, you can specify this in a number of ways.

If all fields are inheritable:

```json
{
  "fieldName": "superEvent",
  "inheritsFrom": "*"
}
```

To specify a blacklist of fields (anything not in this list will be inheritable):

```json
{
  "fieldName": "superEvent",
  "inheritsFrom": {
    "exclude": ["id", "identifier", "subEvent", "superEvent"]
  }
}
```

To specify a whitelist of fields (anything not in this list will not be inheritable):

```json
{
  "fieldName": "subEvent",
  "inheritsFrom": {
    "include": ["name", "description", "startDate", "endDate"]
  }
}
```

`exclude` takes precedence over `include`.
