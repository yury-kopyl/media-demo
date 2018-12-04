export const mediaSchema = {
    validator: {
        $jsonSchema: {
            bsonType:   'object',
            required:   ['name', 'originalName', 'type', 'genre', 'year', 'premiere'],
            properties: {
                id:           {
                    bsonType:    'int',
                    minLength:   1,
                    description: 'must be a number of [1, ...]'
                },
                name:         {
                    bsonType:    'string',
                    minLength:   3,
                    maxLength:   255,
                    description: 'must be a string and is required'
                },
                originalName: {
                    bsonType:    'string',
                    minLength:   3,
                    maxLength:   255,
                    description: 'must be a string and is required'
                },
                type:         {
                    bsonType:    'string',
                    minLength:   3,
                    maxLength:   255,
                    description: 'must be a string and is required'
                },
                genre:        {
                    bsonType:    'array',
                    minItems:    1,
                    items:       {
                        bsonType: 'string'
                    },
                    description: 'must be an array of string and is required'
                },
                year:         {
                    bsonType:    'int',
                    minimum:     1888,
                    maximum:     new Date().getFullYear(),
                    description: `must be a number of [1988, ${new Date().getFullYear()  }] and is required`
                },
                duration:     {
                    bsonType:    'string',
                    minLength:   4,
                    maxLength:   5,
                    description: 'must be a string of 5 symbols and is required'
                },
                description:  {
                    bsonType:    'string',
                    minLength:   3,
                    maxLength:   2000,
                    description: 'must be a string of [3, 255] symbols'
                },
                rating:       {
                    bsonType:    ['double', 'int'],
                    minimum:     0,
                    maximum:     10,
                    description: 'must be a number of [0, 10]'
                },
                country:      {
                    bsonType:    'array',
                    minItems:    1,
                    items:       {
                        bsonType: 'string'
                    },
                    description: 'must be an array of string and is required'
                },
                premiere:     {
                    bsonType:    'string',
                    minLength:   10,
                    description: 'must be a string of 5 symbols and is required'
                },
                director:     {
                    bsonType:    'array',
                    minItems:    0,
                    items:       {
                        bsonType: 'string'
                    },
                    description: 'must be an array of string and is required'
                },
                writers:      {
                    bsonType:    'array',
                    minItems:    0,
                    items:       {
                        bsonType: 'string'
                    },
                    description: 'must be an array of string and is required'
                },
                images:       {
                    bsonType:    'array',
                    minItems:    1,
                    items:       {
                        bsonType: 'string'
                    },
                    description: 'must be an array of string and is required'
                }
            }
        }
    }
};
