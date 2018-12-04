export const userSchema = {
    validator: {
        $jsonSchema: {
            bsonType:   'object',
            required:   ['email', 'password', 'permission', 'created'],
            properties: {
                email:      {
                    bsonType:    'string',
                    pattern:     '[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?',
                    description: 'must be a string in pattern and is required'
                },
                password:   {
                    bsonType:    'string',
                    minLength:   4,
                    maxLength:   255,
                    description: 'must be a string in [6, 255] and is required'
                },
                permission: {
                    enum:        [0, 1, 2],
                    description: 'must be an integer on [0 - 2] and is required'
                },
                created:    {
                    bsonType:    'date',
                    description: 'must be an timestamp format and is required'
                }
            }
        }
    }
};
