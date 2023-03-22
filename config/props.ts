const props = {
  server: {
    port: process.env.SERVER_PORT || 3000,
  },
  auth: {
    secret: process.env.SECRET_KEY || '53CR3TK3Y',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '3306',
    name: process.env.DB_NAME || 'tasks',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'r00t',
  },
  rabbit: {
    port: parseInt(process.env.RABBITMQ_PORT) || 5672,
    host: process.env.RABBITMQ_HOST || 'localhost',
    exchanges: {
      task: {
        name: process.env.RABBIT_EXCHANGES_TASKS_NAME || 'tasks',
        deadLetterName:
          process.env.RABBIT_DL_EXCHANGES_TASK_CREATED || 'tasks.dlx',
        options: {
          durable: true,
        },
        routingKeys: {
          created: process.env.RABBIT_ROUTING_KEY_TASK_CREATED || 'created',
        },
        queues: {
          created: {
            name: process.env.RABBIT_QUEUE_TASK_CREATED || 'tasks.created',
            options: { durable: true },
          },
        },
      },
    },
  },
};

export { props };
