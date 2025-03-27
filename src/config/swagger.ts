import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Visitor Counter API',
        version: '1.0.0',
        description: 'API documentation for the Real-Time Visitor Counter service',
        contact: {
            name: 'API Support',
            email: 'support@yourdomain.com',
        },
    },
    servers: [
        {
            url: 'http://localhost:5001',
            description: 'Development server',
        },
        {
            url: 'https://visitors.yourdomain.com',
            description: 'Production server',
        },
    ],
    tags: [
        {
            name: 'Visitors',
            description: 'Endpoints for visitor analytics',
        },
        {
            name: 'Analytics',
            description: 'Endpoints for detailed analytics and reporting',
        },
    ],
    components: {
        schemas: {
            VisitorCount: {
                type: 'object',
                properties: {
                    count: {
                        type: 'integer',
                        description: 'The total number of active visitors',
                        example: 5,
                    },
                },
            },
            VisitorDetails: {
                type: 'object',
                properties: {
                    count: {
                        type: 'integer',
                        description: 'The total number of active visitors',
                        example: 5,
                    },
                    clients: {
                        type: 'array',
                        description: 'List of connected clients',
                        items: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    description: 'Client socket ID',
                                    example: 'socket-id-1',
                                },
                                ip: {
                                    type: 'string',
                                    description: 'Client IP address',
                                    example: '127.0.0.1',
                                },
                                connectionTime: {
                                    type: 'string',
                                    format: 'date-time',
                                    description: 'When the client connected',
                                    example: '2023-03-26T12:30:45.123Z',
                                },
                                lastActive: {
                                    type: 'string',
                                    format: 'date-time',
                                    description: 'When the client was last active',
                                    example: '2023-03-26T12:35:45.123Z',
                                },
                                userAgent: {
                                    type: 'string',
                                    description: 'Client user agent string',
                                    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                                },
                                origin: {
                                    type: 'string',
                                    description: 'Origin of the request',
                                    example: 'https://example.com',
                                },
                            },
                        },
                    },
                },
            },
            AnalyticsOverview: {
                type: 'object',
                properties: {
                    totalVisitors: {
                        type: 'integer',
                        description: 'Total number of unique visitors',
                        example: 120
                    },
                    activeVisitors: {
                        type: 'integer',
                        description: 'Currently active visitors',
                        example: 8
                    },
                    popularPages: {
                        type: 'array',
                        description: 'Most viewed pages',
                        items: {
                            type: 'object',
                            properties: {
                                path: {
                                    type: 'string',
                                    description: 'Page URL path',
                                    example: '/about'
                                },
                                views: {
                                    type: 'integer',
                                    description: 'Number of page views',
                                    example: 45
                                },
                                avgDuration: {
                                    type: 'number',
                                    description: 'Average time spent on page (seconds)',
                                    example: 120.5
                                }
                            }
                        }
                    },
                    topEntryPages: {
                        type: 'array',
                        description: 'Top entry pages',
                        items: {
                            type: 'object',
                            properties: {
                                path: {
                                    type: 'string',
                                    example: '/'
                                },
                                count: {
                                    type: 'integer',
                                    example: 85
                                }
                            }
                        }
                    },
                    topExitPages: {
                        type: 'array',
                        description: 'Top exit pages',
                        items: {
                            type: 'object',
                            properties: {
                                path: {
                                    type: 'string',
                                    example: '/checkout'
                                },
                                count: {
                                    type: 'integer',
                                    example: 23
                                }
                            }
                        }
                    },
                    lastResetTime: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Last time analytics were reset',
                        example: '2023-03-26T12:00:00.000Z'
                    },
                    autoResetInterval: {
                        type: 'string',
                        description: 'How often analytics are auto-reset',
                        example: '60 dakika'
                    }
                }
            },
            PageAnalytics: {
                type: 'object',
                properties: {
                    pages: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                path: {
                                    type: 'string',
                                    description: 'Page URL path',
                                    example: '/products'
                                },
                                views: {
                                    type: 'integer',
                                    description: 'Number of page views',
                                    example: 35
                                },
                                avgDuration: {
                                    type: 'number',
                                    description: 'Average time spent on page (seconds)',
                                    example: 65.2
                                }
                            }
                        }
                    }
                }
            },
            VisitorJourneys: {
                type: 'object',
                properties: {
                    journeys: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                clientId: {
                                    type: 'string',
                                    description: 'Client identifier',
                                    example: 'client-123'
                                },
                                path: {
                                    type: 'array',
                                    description: 'Sequence of pages visited',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            path: {
                                                type: 'string',
                                                example: '/home'
                                            },
                                            timestamp: {
                                                type: 'string',
                                                format: 'date-time',
                                                example: '2023-03-26T12:10:45.123Z'
                                            },
                                            duration: {
                                                type: 'number',
                                                example: 45.2
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            ClientDetails: {
                type: 'object',
                properties: {
                    clients: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    description: 'Client identifier',
                                    example: 'client-123'
                                },
                                ip: {
                                    type: 'string',
                                    description: 'Client IP address',
                                    example: '127.0.0.1'
                                },
                                userAgent: {
                                    type: 'string',
                                    description: 'Browser user agent',
                                    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                                },
                                browser: {
                                    type: 'string',
                                    description: 'Browser name and version',
                                    example: 'Chrome 91'
                                },
                                device: {
                                    type: 'string',
                                    description: 'Device type',
                                    example: 'Desktop'
                                },
                                connectionTime: {
                                    type: 'string',
                                    format: 'date-time',
                                    description: 'When the client connected',
                                    example: '2023-03-26T12:05:45.123Z'
                                },
                                lastActive: {
                                    type: 'string',
                                    format: 'date-time',
                                    description: 'When the client was last active',
                                    example: '2023-03-26T12:35:45.123Z'
                                },
                                pagesVisited: {
                                    type: 'array',
                                    description: 'Pages the client visited',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            path: {
                                                type: 'string',
                                                example: '/products'
                                            },
                                            timestamp: {
                                                type: 'string',
                                                format: 'date-time',
                                                example: '2023-03-26T12:10:45.123Z'
                                            },
                                            referrer: {
                                                type: 'string',
                                                example: '/home'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string',
                        description: 'Error message',
                        example: 'An error occurred',
                    },
                    status: {
                        type: 'integer',
                        description: 'HTTP status code',
                        example: 500,
                    },
                },
            },
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec; 