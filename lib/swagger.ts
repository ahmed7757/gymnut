import { OpenAPIV3 } from 'openapi-types';

export const swaggerConfig: OpenAPIV3.Document = {
    openapi: '3.0.0',
    info: {
        title: 'GymNut API',
        version: '1.0.0',
        description: 'AI-Powered Fitness & Nutrition Tracker API',
        contact: {
            name: 'GymNut Team',
            email: 'support@gymnut.com'
        }
    },
    servers: [
        {
            url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            description: 'Development server'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            },
            sessionAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'authjs.session-token'
            }
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    name: { type: 'string' },
                    gender: { type: 'string', enum: ['MALE', 'FEMALE'] },
                    location: { type: 'string' },
                    height: { type: 'number' },
                    weight: { type: 'number' },
                    goal: { type: 'string', enum: ['LOSE', 'MAINTAIN', 'GAIN'] },
                    diseases: {
                        type: 'array',
                        items: { type: 'string', enum: ['DIABETES', 'HYPERTENSION', 'HEART_DISEASE', 'ASTHMA', 'NONE'] }
                    },
                    age: { type: 'number' },
                    image: { type: 'string', format: 'uri' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            MealLog: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    userId: { type: 'string' },
                    foodName: { type: 'string' },
                    foodImage: { type: 'string', format: 'uri' },
                    category: { type: 'string', enum: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] },
                    quantity: { type: 'number' },
                    portion: { type: 'string' },
                    calories: { type: 'number' },
                    protein: { type: 'number' },
                    carbs: { type: 'number' },
                    fat: { type: 'number' },
                    fiber: { type: 'number' },
                    sugar: { type: 'number' },
                    sodium: { type: 'number' },
                    loggedAt: { type: 'string', format: 'date-time' }
                }
            },
            Workout: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    userId: { type: 'string' },
                    method: { type: 'string' },
                    plan: { type: 'object' },
                    createdAt: { type: 'string', format: 'date-time' }
                }
            },
            MealPlan: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    userId: { type: 'string' },
                    plan: { type: 'object' },
                    createdAt: { type: 'string', format: 'date-time' }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    error: { type: 'string' },
                    message: { type: 'string' },
                    statusCode: { type: 'number' }
                }
            },
            RateLimitError: {
                type: 'object',
                properties: {
                    error: { type: 'string' },
                    message: { type: 'string' },
                    retryAfter: { type: 'number' }
                }
            }
        }
    },
    paths: {
        '/api/auth/register': {
            post: {
                tags: ['Authentication'],
                summary: 'Register a new user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name', 'email', 'password', 'confirmPassword', 'gender'],
                                properties: {
                                    name: { type: 'string', minLength: 2, maxLength: 100 },
                                    email: { type: 'string', format: 'email' },
                                    password: { type: 'string', minLength: 8 },
                                    confirmPassword: { type: 'string' },
                                    gender: { type: 'string', enum: ['MALE', 'FEMALE'] }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'User registered successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        success: { type: 'boolean' },
                                        data: { $ref: '#/components/schemas/User' },
                                        message: { type: 'string' },
                                        statusCode: { type: 'number' }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Validation error',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    },
                    '409': {
                        description: 'Email already exists',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    }
                }
            }
        },
        '/api/meals': {
            post: {
                tags: ['Meals'],
                summary: 'Log a new meal',
                security: [{ sessionAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['foodName', 'calories', 'protein', 'carbs', 'fat'],
                                properties: {
                                    foodName: { type: 'string', maxLength: 200 },
                                    foodImage: { type: 'string', format: 'uri' },
                                    category: { type: 'string', enum: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'], default: 'LUNCH' },
                                    quantity: { type: 'number', minimum: 0, maximum: 10000 },
                                    portion: { type: 'string', maxLength: 100 },
                                    calories: { type: 'number', minimum: 0, maximum: 10000 },
                                    protein: { type: 'number', minimum: 0, maximum: 1000 },
                                    carbs: { type: 'number', minimum: 0, maximum: 1000 },
                                    fat: { type: 'number', minimum: 0, maximum: 1000 },
                                    fiber: { type: 'number', minimum: 0, maximum: 1000 },
                                    sugar: { type: 'number', minimum: 0, maximum: 1000 },
                                    sodium: { type: 'number', minimum: 0, maximum: 10000 },
                                    foodData: { type: 'object' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Meal logged successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MealLog' }
                            }
                        }
                    },
                    '400': {
                        description: 'Invalid input data',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    },
                    '429': {
                        description: 'Rate limit exceeded',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/RateLimitError' }
                            }
                        }
                    }
                }
            },
            get: {
                tags: ['Meals'],
                summary: 'Get user meal history',
                security: [{ sessionAuth: [] }],
                parameters: [
                    {
                        name: 'date',
                        in: 'query',
                        description: 'Filter meals by date (YYYY-MM-DD)',
                        schema: { type: 'string', format: 'date' }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Meal history retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/MealLog' }
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    }
                }
            }
        },
        '/api/meals/plan': {
            post: {
                tags: ['Meals'],
                summary: 'Generate AI-powered meal plan',
                security: [{ sessionAuth: [] }],
                requestBody: {
                    required: false,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    dietType: { type: 'string', maxLength: 50, default: 'balanced' },
                                    mealDays: { type: 'number', minimum: 1, maximum: 30, default: 7 }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Meal plan generated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        mealPlan: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    day: { type: 'string' },
                                                    meals: {
                                                        type: 'array',
                                                        items: {
                                                            type: 'object',
                                                            properties: {
                                                                type: { type: 'string' },
                                                                name: { type: 'string' },
                                                                description: { type: 'string' },
                                                                calories: { type: 'number' },
                                                                protein: { type: 'number' },
                                                                carbs: { type: 'number' },
                                                                fat: { type: 'number' }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Invalid input data',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    },
                    '429': {
                        description: 'Rate limit exceeded',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/RateLimitError' }
                            }
                        }
                    }
                }
            }
        },
        '/api/meals/save-plan': {
            post: {
                tags: ['Meals'],
                summary: 'Save a generated meal plan',
                security: [{ sessionAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['plan'],
                                properties: {
                                    dietType: { type: 'string', maxLength: 50 },
                                    mealDays: { type: 'number', minimum: 1, maximum: 30 },
                                    plan: {
                                        type: 'object',
                                        properties: {
                                            mealPlan: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        day: { type: 'string' },
                                                        meals: {
                                                            type: 'array',
                                                            items: {
                                                                type: 'object',
                                                                properties: {
                                                                    type: { type: 'string' },
                                                                    name: { type: 'string' },
                                                                    calories: { type: 'number' },
                                                                    protein: { type: 'number' },
                                                                    carbs: { type: 'number' },
                                                                    fat: { type: 'number' }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Meal plan saved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' },
                                        plan: { $ref: '#/components/schemas/MealPlan' }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Invalid meal plan data',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    }
                }
            },
            get: {
                tags: ['Meals'],
                summary: 'Get saved meal plans',
                security: [{ sessionAuth: [] }],
                parameters: [
                    {
                        name: 'latest',
                        in: 'query',
                        description: 'Get only the latest meal plan',
                        schema: { type: 'boolean' }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Meal plans retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    oneOf: [
                                        { $ref: '#/components/schemas/MealPlan' },
                                        {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/MealPlan' }
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    },
                    '404': {
                        description: 'No meal plans found',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    }
                }
            }
        },
        '/api/workouts/plan': {
            post: {
                tags: ['Workouts'],
                summary: 'Generate AI-powered workout plan',
                security: [{ sessionAuth: [] }],
                requestBody: {
                    required: false,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    fitnessLevel: { type: 'string', maxLength: 20, default: 'beginner' },
                                    workoutDays: { type: 'number', minimum: 1, maximum: 7, default: 5 },
                                    method: { type: 'string', maxLength: 100, default: 'Push/Pull/Legs (PPL) Split' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Workout plan generated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        plan: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    day: { type: 'string' },
                                                    type: { type: 'string' },
                                                    duration: { type: 'number' },
                                                    exercises: {
                                                        type: 'array',
                                                        items: {
                                                            type: 'object',
                                                            properties: {
                                                                name: { type: 'string' },
                                                                sets: { type: 'number' },
                                                                reps: { type: 'number' },
                                                                duration: { type: 'string' }
                                                            }
                                                        }
                                                    },
                                                    warmup: { type: 'string' },
                                                    cooldown: { type: 'string' }
                                                }
                                            }
                                        },
                                        nutritionalGuidance: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Invalid input data',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    },
                    '429': {
                        description: 'Rate limit exceeded',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/RateLimitError' }
                            }
                        }
                    }
                }
            }
        },
        '/api/workouts/save-plan': {
            post: {
                tags: ['Workouts'],
                summary: 'Save a generated workout plan',
                security: [{ sessionAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['plan'],
                                properties: {
                                    fitnessLevel: { type: 'string', maxLength: 20 },
                                    workoutDays: { type: 'number', minimum: 1, maximum: 7 },
                                    method: { type: 'string', maxLength: 100 },
                                    plan: {
                                        type: 'object',
                                        properties: {
                                            plan: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        day: { type: 'string' },
                                                        type: { type: 'string' },
                                                        duration: { type: 'number' },
                                                        exercises: {
                                                            type: 'array',
                                                            items: {
                                                                type: 'object',
                                                                properties: {
                                                                    name: { type: 'string' },
                                                                    sets: { type: 'number' },
                                                                    reps: { type: 'number' },
                                                                    duration: { type: 'string' }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            nutritionalGuidance: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Workout plan saved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' },
                                        plan: { $ref: '#/components/schemas/Workout' }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Invalid workout plan data',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    }
                }
            },
            get: {
                tags: ['Workouts'],
                summary: 'Get saved workout plans',
                security: [{ sessionAuth: [] }],
                parameters: [
                    {
                        name: 'latest',
                        in: 'query',
                        description: 'Get only the latest workout plan',
                        schema: { type: 'boolean' }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Workout plans retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    oneOf: [
                                        { $ref: '#/components/schemas/Workout' },
                                        {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/Workout' }
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    },
                    '404': {
                        description: 'No workout plans found',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    }
                }
            }
        },
        '/api/food': {
            get: {
                tags: ['Food'],
                summary: 'Search for food items',
                parameters: [
                    {
                        name: 'q',
                        in: 'query',
                        required: true,
                        description: 'Search query for food items',
                        schema: { type: 'string', minLength: 1, maxLength: 100 }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Food items found',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'string' },
                                            name: { type: 'string' },
                                            image: { type: 'string', format: 'uri' },
                                            calories: { type: 'number' },
                                            protein: { type: 'number' },
                                            carbs: { type: 'number' },
                                            fat: { type: 'number' }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Query parameter required',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    },
                    '404': {
                        description: 'No food items found',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' }
                            }
                        }
                    }
                }
            }
        }
    }
};

// Generate Swagger JSON
export function generateSwaggerJSON(): string {
    return JSON.stringify(swaggerConfig, null, 2);
}
