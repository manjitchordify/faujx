// File: data/roadmapData.js
import { Position } from 'reactflow';

export const moduleDetails = {
  'module-1': {
    title: 'Module 1: JavaScript, Node.js & Git Basics',
    content: [
      'Modern JavaScript (ES6+)',
      'Node.js Fundamentals',
      'Git & GitHub Essentials',
    ],
    assignment: 'Create a weather CLI app using Node.js and an open API',
  },
  'module-2': {
    title: 'Module 2: Databases (SQL & NoSQL)',
    content: [
      'PostgreSQL & Relational DBs',
      'PostgreSQL + Node.js',
      'MongoDB (Optional)',
    ],
    assignment: 'Build a Task Manager API with PostgreSQL and Express.js',
  },
  'module-3': {
    title: 'Module 3: Express.js & REST API Development',
    content: ['Express Fundamentals', 'REST API Design'],
    assignment:
      'Enhance Task Manager API with filtering, sorting, and error middleware',
  },
  'module-4': {
    title: 'Module 4: Authentication & Security',
    content: ['JWT Authentication', 'Security Practices'],
    assignment: 'Add JWT authentication to Task Manager API',
  },
  'module-5': {
    title: 'Module 5: File Uploads & Emailing',
    content: ['File Uploads with Multer', 'Sending Emails with Nodemailer'],
    assignment: 'Add file upload to tasks and email notifications',
  },
  'module-6': {
    title: 'Module 6: Payment Integration with Stripe',
    content: ['Stripe Basics', 'Implementation'],
    assignment: 'Create a simple payment route using Stripe',
  },
  'module-7': {
    title: 'Module 7: API Documentation & Testing',
    content: ['Postman for Testing', 'Swagger / OpenAPI'],
    assignment: 'Document all endpoints with Swagger and test with Postman',
  },
  'module-8': {
    title: 'Module 8: Real-Time Updates with WebSockets',
    content: ['WebSocket Basics', 'Socket.io Implementation'],
    assignment: 'Add real-time notifications for task status updates',
  },
  'module-9': {
    title: 'Module 9: Docker Essentials',
    content: ['Docker Fundamentals', 'Docker Compose (Optional)'],
    assignment: 'Dockerize your Task Manager API',
  },
  'module-10': {
    title: 'Module 10: Beyond Basics - Optional Skills I',
    content: [
      'Cloud & DevOps Foundations',
      'Docker & Container Orchestration',
      'Serverless & Deployment',
    ],
    assignment: 'Deploy app using Docker + Railway or Netlify functions',
  },
  'module-11': {
    title: 'Module 11: Beyond Basics - Optional Skills II',
    content: [
      'ORM & Advanced Data Handling',
      'GraphQL & API Gateways',
      'Microservices & Messaging',
      'Monitoring & Scaling',
    ],
    assignment: 'Set up message queue or refactor service using GraphQL',
  },
  capstone: {
    title: 'Final Capstone Project: "Simple Invoicy"',
    content: [
      'Complete backend SaaS invoicing system',
      'Node.js + Express + PostgreSQL + Prisma',
      'JWT Auth + Stripe + Socket.io',
      'Swagger docs + Dockerized deployment',
    ],
    assignment:
      'Build a full-featured invoicing system with all learned technologies',
  },
  // Sub-branch details
  'js-es6': {
    title: 'Modern JavaScript (ES6+)',
    content: [
      'Variables: let, const, block scope',
      'Arrow functions, template literals',
      'Destructuring, spread/rest operators',
      'Promises and async/await',
      'Try/catch and async error handling',
      'JS Modules (ESM & CommonJS)',
    ],
    assignment: null,
  },
  'nodejs-fundamentals': {
    title: 'Node.js Fundamentals',
    content: [
      'What is Node.js? Event loop, non-blocking I/O',
      'Setting up a project (npm init)',
      'Installing dependencies',
      'Using built-in modules: fs, http, path, os',
      'Managing .env variables',
      'Logging and debugging',
    ],
    assignment: null,
  },
  'git-basics': {
    title: 'Git & GitHub Essentials',
    content: [
      'What is Git and GitHub?',
      'Basic commands: init, add, commit, status, log',
      'Pushing to GitHub, cloning repos',
      'Branching and pull requests',
      'Writing a README using Markdown',
    ],
    assignment: null,
  },
  'postgresql-basics': {
    title: 'PostgreSQL & Relational DBs',
    content: [
      'What is a relational DB?',
      'Tables, rows, columns',
      'Basic SQL: SELECT, INSERT, UPDATE, DELETE',
      'One-to-many relationships (Users → Tasks)',
      'Schema design and normalization (1NF-3NF)',
    ],
    assignment: null,
  },
  'postgresql-nodejs': {
    title: 'PostgreSQL + Node.js',
    content: [
      'Connect PostgreSQL using pg package',
      'Write parameterized queries',
      'Prevent SQL injection',
      'Migrations using basic SQL or Prisma',
    ],
    assignment: null,
  },
  'mongodb-basics': {
    title: 'MongoDB (Optional)',
    content: [
      'NoSQL vs SQL: Key differences',
      'MongoDB basics: documents, collections',
      'Using Mongoose for schema modeling',
      'CRUD with Mongoose',
    ],
    assignment: null,
  },
  'express-fundamentals': {
    title: 'Express Fundamentals',
    content: [
      'Setting up an Express server',
      'CRUD routes: GET, POST, PUT, DELETE',
      'Parsing req.body, handling routes',
      'Error-handling middleware',
      'Serving static files',
    ],
    assignment: null,
  },
  'rest-api-design': {
    title: 'REST API Design',
    content: [
      'RESTful principles and HTTP methods',
      'Status codes, request/response formats',
      'Route structuring and nesting',
      'Basic pagination, sorting, and filtering',
      'Versioning (/api/v1)',
    ],
    assignment: null,
  },
  'jwt-auth': {
    title: 'JWT Authentication',
    content: [
      'Signup/login flow',
      'Hashing passwords using bcrypt',
      'Generating and verifying JWT tokens',
      'Protected routes and middleware',
    ],
    assignment: null,
  },
  'security-practices': {
    title: 'Security Practices',
    content: [
      'Input validation (express-validator)',
      'Using Helmet and enabling CORS',
      'Rate limiting basics',
      'Managing secrets in .env',
    ],
    assignment: null,
  },
  'file-uploads': {
    title: 'File Uploads with Multer',
    content: [
      'Upload files (e.g. images, PDFs)',
      'Validate file types and sizes',
      'Store files locally',
    ],
    assignment: null,
  },
  'email-sending': {
    title: 'Sending Emails',
    content: [
      'Send emails with Nodemailer',
      'Setup with Gmail SMTP',
      'Email template customization',
    ],
    assignment: null,
  },
  'stripe-basics': {
    title: 'Stripe Basics',
    content: [
      'How Stripe works (checkout flow, tokens)',
      'Setup Stripe account + API keys',
      'Creating payment intents',
      'Handling success/failure',
      'Webhook basics for confirmation',
    ],
    assignment: null,
  },
  'stripe-implementation': {
    title: 'Stripe Implementation',
    content: [
      'Create invoices/payments via API',
      'Confirm and store payment details',
      'Store webhook logs in MongoDB (optional)',
    ],
    assignment: null,
  },
  'postman-testing': {
    title: 'Postman for Testing',
    content: [
      'Creating collections and requests',
      'Using environments and variables',
      'Writing test scripts (basic)',
      'Exporting and sharing collections',
    ],
    assignment: null,
  },
  'swagger-docs': {
    title: 'Swagger / OpenAPI',
    content: [
      'What is Swagger?',
      'Auto-generate OpenAPI docs using swagger-jsdoc',
      'Serve docs with swagger-ui-express',
      'Add examples and descriptions to each endpoint',
    ],
    assignment: null,
  },
  'websocket-basics': {
    title: 'WebSocket Basics',
    content: [
      'What is real-time communication?',
      'Intro to Socket.io',
      'Broadcast events to clients',
      'Listen for actions (e.g., "task updated")',
    ],
    assignment: null,
  },
  'docker-fundamentals': {
    title: 'Docker Fundamentals',
    content: [
      'What is Docker and why use it?',
      'Writing a simple Dockerfile for Node.js',
      'What is .dockerignore?',
      'Docker commands: build, run, exec, logs',
    ],
    assignment: null,
  },
  'docker-compose': {
    title: 'Docker Compose (Optional)',
    content: [
      'Set up backend + DB containers',
      'Use docker-compose.yml for service configuration',
      'Link Express API with PostgreSQL via Docker network',
    ],
    assignment: null,
  },
  'cloud-devops': {
    title: 'Cloud & DevOps Foundations',
    content: [
      'What is cloud computing?',
      'Intro to Render, Railway, Netlify',
      'Awareness of AWS/GCP/Azure (EC2, S3, basic deployment)',
    ],
    assignment: null,
  },
  'docker-orchestration': {
    title: 'Docker & Container Orchestration',
    content: [
      'Why containers matter',
      'Multi-container apps with Docker Compose',
      'Local development using services like PostgreSQL in Docker',
    ],
    assignment: null,
  },
  'serverless-deployment': {
    title: 'Serverless & Deployment Strategies',
    content: [
      'Serverless functions (e.g., AWS Lambda, Netlify Functions)',
      'Use cases and trade-offs',
      'When to use vs avoid serverless',
    ],
    assignment: null,
  },
  'orm-advanced': {
    title: 'ORM & Advanced Data Handling',
    content: [
      'ORM tools: Prisma, Sequelize, TypeORM',
      'Differences between ORM and raw SQL',
      'Using an ORM for fast prototyping',
    ],
    assignment: null,
  },
  'graphql-api': {
    title: 'GraphQL & API Gateways',
    content: ['What is GraphQL?', 'REST vs GraphQL', 'Intro to Apollo Server'],
    assignment: null,
  },
  'microservices-messaging': {
    title: 'Microservices & Messaging',
    content: [
      'Monolith vs Microservice basics',
      'Messaging patterns with Redis Pub/Sub or RabbitMQ',
      'Basic producer/consumer queue flows',
    ],
    assignment: null,
  },
  'monitoring-scaling': {
    title: 'Monitoring & Scaling',
    content: [
      'Process management with PM2',
      'App performance monitoring (New Relic, DataDog)',
      'Load balancing basics',
      'Horizontal vs vertical scaling',
    ],
    assignment: null,
  },
};

export const nodeStyles = {
  module: {
    background: '#e3f2fd',
    border: '2px solid #1976d2',
    borderRadius: '12px',
    width: 280,
    minHeight: 80,
  },
  assignment: {
    background: '#e8f5e8',
    border: '2px solid #4caf50',
    borderRadius: '8px',
    width: 160,
  },
  optional: {
    background: '#f3e5f5',
    border: '2px solid #7b1fa2',
    borderRadius: '12px',
    width: 280,
    minHeight: 80,
  },
  optionalBranch: {
    background: '#f3e5f5',
    border: '2px solid #7b1fa2',
    borderRadius: '8px',
    width: 180,
  },
  capstone: {
    background: '#ffebee',
    border: '3px solid #d32f2f',
    borderRadius: '12px',
    width: 280,
    minHeight: 80,
  },
  subBranch: {
    background: '#f8f9fa',
    border: '1.5px solid #6c757d',
    borderRadius: '8px',
    width: 200,
    minHeight: 60,
  },
};

export const edgeStyles = {
  main: { stroke: '#1976d2', strokeWidth: 2 },
  assignment: { stroke: '#4caf50', strokeDasharray: '5,5' },
  optional: { stroke: '#7b1fa2', strokeWidth: 2 },
  optionalDashed: { stroke: '#7b1fa2', strokeDasharray: '5,5' },
  capstone: { stroke: '#d32f2f', strokeWidth: 3 },
  capstoneOptional: {
    stroke: '#d32f2f',
    strokeWidth: 2,
    strokeDasharray: '5,5',
  },
  subBranch: { stroke: '#6c757d', strokeWidth: 1.5, strokeDasharray: '3,3' },
};

export const initialNodes = [
  // Core Modules
  {
    id: 'module-1',
    type: 'default',
    position: { x: 250, y: 250 },
    data: {
      label: (
        <div className="p-4 text-center">
          <div className="font-bold text-blue-700">Module 1</div>
          <div className="text-sm text-black">JavaScript, Node.js & Git</div>
          <div className="text-xs mt-1 text-gray-600">
            ES6+, Node.js Fundamentals, Git Basics
          </div>
        </div>
      ),
    },
    style: nodeStyles.module,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  // Module 1 Sub-branches - ALL ON LEFT SIDE
  {
    id: 'js-es6',
    type: 'default',
    position: { x: 0, y: 280 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-gray-700 text-sm">
            Modern JavaScript
          </div>
          <div className="text-xs text-gray-600">ES6+</div>
        </div>
      ),
    },
    style: nodeStyles.subBranch,
    targetPosition: Position.Top,
  },
  {
    id: 'nodejs-fundamentals',
    type: 'default',
    position: { x: 0, y: 330 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-gray-700 text-sm">Node.js</div>
          <div className="text-xs text-gray-600">Fundamentals</div>
        </div>
      ),
    },
    style: nodeStyles.subBranch,
    targetPosition: Position.Top,
  },
  {
    id: 'git-basics',
    type: 'default',
    position: { x: 0, y: 380 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-gray-700 text-sm">
            Git & GitHub
          </div>
          <div className="text-xs text-gray-600">Essentials</div>
        </div>
      ),
    },
    style: nodeStyles.subBranch,
    targetPosition: Position.Top,
  },

  {
    id: 'module-2',
    type: 'default',
    position: { x: 250, y: 500 },
    data: {
      label: (
        <div className="p-4 text-center">
          <div className="font-bold text-blue-700">Module 2</div>
          <div className="text-sm text-black">Databases (SQL & NoSQL)</div>
          <div className="text-xs mt-1 text-gray-600">PostgreSQL, MongoDB</div>
        </div>
      ),
    },
    style: nodeStyles.module,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  // Module 2 Sub-branches - ALL ON LEFT SIDE
  {
    id: 'postgresql-basics',
    type: 'default',
    position: { x: 0, y: 530 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-gray-700 text-sm">PostgreSQL</div>
          <div className="text-xs text-gray-600">Relational DBs</div>
        </div>
      ),
    },
    style: nodeStyles.subBranch,
    targetPosition: Position.Top,
  },
  {
    id: 'postgresql-nodejs',
    type: 'default',
    position: { x: 0, y: 580 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-gray-700 text-sm">PostgreSQL</div>
          <div className="text-xs text-gray-600">+ Node.js</div>
        </div>
      ),
    },
    style: nodeStyles.subBranch,
    targetPosition: Position.Top,
  },
  {
    id: 'mongodb-basics',
    type: 'default',
    position: { x: 0, y: 630 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-gray-700 text-sm">MongoDB</div>
          <div className="text-xs text-gray-600">Optional</div>
        </div>
      ),
    },
    style: nodeStyles.subBranch,
    targetPosition: Position.Top,
  },

  {
    id: 'module-3',
    type: 'default',
    position: { x: 250, y: 750 },
    data: {
      label: (
        <div className="p-4 text-center">
          <div className="font-bold text-blue-700">Module 3</div>
          <div className="text-sm text-black">Express.js & REST API</div>
          <div className="text-xs mt-1 text-gray-600">
            Express Fundamentals, REST Design
          </div>
        </div>
      ),
    },
    style: nodeStyles.module,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  // Module 3 Sub-branches - ALL ON LEFT SIDE
  {
    id: 'express-fundamentals',
    type: 'default',
    position: { x: 0, y: 780 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-gray-700 text-sm">Express</div>
          <div className="text-xs text-gray-600">Fundamentals</div>
        </div>
      ),
    },
    style: nodeStyles.subBranch,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'rest-api-design',
    type: 'default',
    position: { x: 0, y: 830 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-gray-700 text-sm">REST API</div>
          <div className="text-xs text-gray-600">Design</div>
        </div>
      ),
    },
    style: nodeStyles.subBranch,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  {
    id: 'module-4',
    type: 'default',
    position: { x: 250, y: 1000 },
    data: {
      label: (
        <div className="p-4 text-center">
          <div className="font-bold text-blue-700">Module 4</div>
          <div className="text-sm text-black">Authentication & Security</div>
          <div className="text-xs mt-1 text-gray-600">
            JWT, bcrypt, Security Practices
          </div>
        </div>
      ),
    },
    style: nodeStyles.module,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  // Module 4 Sub-branches - ALL ON LEFT SIDE
  {
    id: 'jwt-auth',
    type: 'default',
    position: { x: 0, y: 1030 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-gray-700 text-sm">JWT</div>
          <div className="text-xs text-gray-600">Authentication</div>
        </div>
      ),
    },
    style: nodeStyles.subBranch,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'security-practices',
    type: 'default',
    position: { x: 0, y: 1080 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-gray-700 text-sm">Security</div>
          <div className="text-xs text-gray-600">Practices</div>
        </div>
      ),
    },
    style: nodeStyles.subBranch,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  {
    id: 'module-5',
    type: 'default',
    position: { x: 250, y: 1250 },
    data: {
      label: (
        <div className="p-4 text-center">
          <div className="font-bold text-blue-700">Module 5</div>
          <div className="text-sm text-black">File Uploads & Emailing</div>
          <div className="text-xs mt-1 text-gray-600">Multer, Nodemailer</div>
        </div>
      ),
    },
    style: nodeStyles.module,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  // Module 5 Sub-branches - ALL ON LEFT SIDE
  {
    id: 'file-uploads',
    type: 'default',
    position: { x: 0, y: 1280 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-gray-700 text-sm">
            File Uploads
          </div>
          <div className="text-xs text-gray-600">Multer</div>
        </div>
      ),
    },
    style: nodeStyles.subBranch,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'email-sending',
    type: 'default',
    position: { x: 0, y: 1330 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-gray-700 text-sm">
            Sending Emails
          </div>
          <div className="text-xs text-gray-600">Nodemailer</div>
        </div>
      ),
    },
    style: nodeStyles.subBranch,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  {
    id: 'module-6',
    type: 'default',
    position: { x: 250, y: 1500 },
    data: {
      label: (
        <div className="p-4 text-center">
          <div className="font-bold text-blue-700">Module 6</div>
          <div className="text-sm text-black">Payment Integration</div>
          <div className="text-xs mt-1 text-gray-600">Stripe, Webhooks</div>
        </div>
      ),
    },
    style: nodeStyles.module,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  // Module 6 Sub-branches - ALL ON LEFT SIDE
  {
    id: 'stripe-basics',
    type: 'default',
    position: { x: 0, y: 1530 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-gray-700 text-sm">Stripe</div>
          <div className="text-xs text-gray-600">Basics</div>
        </div>
      ),
    },
    style: nodeStyles.subBranch,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'stripe-implementation',
    type: 'default',
    position: { x: 0, y: 1580 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-gray-700 text-sm">Stripe</div>
          <div className="text-xs text-gray-600">Implementation</div>
        </div>
      ),
    },
    style: nodeStyles.subBranch,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  {
    id: 'module-7',
    type: 'default',
    position: { x: 250, y: 1750 },
    data: {
      label: (
        <div className="p-4 text-center">
          <div className="font-bold text-blue-700">Module 7</div>
          <div className="text-sm text-black">API Documentation & Testing</div>
          <div className="text-xs mt-1 text-gray-600">Postman, Swagger</div>
        </div>
      ),
    },
    style: nodeStyles.module,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  // Module 7 Sub-branches - ALL ON LEFT SIDE
  {
    id: 'postman-testing',
    type: 'default',
    position: { x: 0, y: 1780 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-gray-700 text-sm">Postman</div>
          <div className="text-xs text-gray-600">Testing</div>
        </div>
      ),
    },
    style: nodeStyles.subBranch,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'swagger-docs',
    type: 'default',
    position: { x: 0, y: 1830 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-gray-700 text-sm">Swagger</div>
          <div className="text-xs text-gray-600">OpenAPI</div>
        </div>
      ),
    },
    style: nodeStyles.subBranch,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  {
    id: 'module-8',
    type: 'default',
    position: { x: 250, y: 2000 },
    data: {
      label: (
        <div className="p-4 text-center">
          <div className="font-bold text-blue-700">Module 8</div>
          <div className="text-sm text-black">Real-Time with WebSockets</div>
          <div className="text-xs mt-1 text-gray-600">Socket.io</div>
        </div>
      ),
    },
    style: nodeStyles.module,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  // Module 8 Sub-branch - ON LEFT SIDE
  {
    id: 'websocket-basics',
    type: 'default',
    position: { x: 0, y: 2030 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-gray-700 text-sm">WebSocket</div>
          <div className="text-xs text-gray-600">Basics</div>
        </div>
      ),
    },
    style: nodeStyles.subBranch,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  {
    id: 'module-9',
    type: 'default',
    position: { x: 250, y: 2250 },
    data: {
      label: (
        <div className="p-4 text-center">
          <div className="font-bold text-blue-700">Module 9</div>
          <div className="text-sm text-black">Docker Essentials</div>
          <div className="text-xs mt-1 text-gray-600">
            Containerization, Docker Compose
          </div>
        </div>
      ),
    },
    style: nodeStyles.module,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  // Module 9 Sub-branches - ALL ON LEFT SIDE
  {
    id: 'docker-fundamentals',
    type: 'default',
    position: { x: 0, y: 2280 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-gray-700 text-sm">Docker</div>
          <div className="text-xs text-gray-600">Fundamentals</div>
        </div>
      ),
    },
    style: nodeStyles.subBranch,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'docker-compose',
    type: 'default',
    position: { x: 0, y: 2330 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-gray-700 text-sm">Docker</div>
          <div className="text-xs text-gray-600">Compose</div>
        </div>
      ),
    },
    style: nodeStyles.subBranch,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  // Assignment Nodes - ALL ON RIGHT SIDE
  {
    id: 'assignment-1',
    type: 'default',
    position: { x: 600, y: 300 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-green-700">📝 Assignment 1</div>
          <div className="text-xs mt-1 text-black">Weather CLI App</div>
        </div>
      ),
    },
    style: nodeStyles.assignment,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'assignment-2',
    type: 'default',
    position: { x: 600, y: 550 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-green-700">📝 Assignment 2</div>
          <div className="text-xs mt-1 text-black">Task Manager API</div>
        </div>
      ),
    },
    style: nodeStyles.assignment,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'assignment-3',
    type: 'default',
    position: { x: 600, y: 800 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-green-700">📝 Assignment 3</div>
          <div className="text-xs mt-1 text-black">Enhanced Task API</div>
        </div>
      ),
    },
    style: nodeStyles.assignment,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'assignment-4',
    type: 'default',
    position: { x: 600, y: 1050 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-green-700">📝 Assignment 4</div>
          <div className="text-xs mt-1 text-black">JWT Authentication</div>
        </div>
      ),
    },
    style: nodeStyles.assignment,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'assignment-5',
    type: 'default',
    position: { x: 600, y: 1300 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-green-700">📝 Assignment 5</div>
          <div className="text-xs mt-1 text-black">File Upload & Email</div>
        </div>
      ),
    },
    style: nodeStyles.assignment,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'assignment-6',
    type: 'default',
    position: { x: 600, y: 1550 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-green-700">📝 Assignment 6</div>
          <div className="text-xs mt-1 text-black">Stripe Payment Route</div>
        </div>
      ),
    },
    style: nodeStyles.assignment,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'assignment-7',
    type: 'default',
    position: { x: 600, y: 1800 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-green-700">📝 Assignment 7</div>
          <div className="text-xs mt-1 text-black">Swagger Docs</div>
        </div>
      ),
    },
    style: nodeStyles.assignment,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'assignment-8',
    type: 'default',
    position: { x: 600, y: 2050 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-green-700">📝 Assignment 8</div>
          <div className="text-xs mt-1 text-black">Real-time Notifications</div>
        </div>
      ),
    },
    style: nodeStyles.assignment,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'assignment-9',
    type: 'default',
    position: { x: 600, y: 2300 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-green-700">📝 Assignment 9</div>
          <div className="text-xs mt-1 text-black">Dockerize Task API</div>
        </div>
      ),
    },
    style: nodeStyles.assignment,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  // Optional Branch
  {
    id: 'optional-branch',
    type: 'default',
    position: { x: 800, y: 2400 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-bold text-purple-700">🔀 Optional Skills</div>
          <div className="text-xs mt-1 text-black">Advanced Topics</div>
        </div>
      ),
    },
    style: nodeStyles.optionalBranch,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  // Optional Modules
  {
    id: 'module-10',
    type: 'default',
    position: { x: 750, y: 2500 },
    data: {
      label: (
        <div className="p-4 text-center">
          <div className="font-bold text-purple-700">Module 10</div>
          <div className="text-sm text-black">Optional Skills I</div>
          <div className="text-xs mt-1 text-gray-600">
            Cloud, Docker, Serverless
          </div>
        </div>
      ),
    },
    style: nodeStyles.optional,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  // Module 10 Sub-branches - ALL ON LEFT SIDE OF MODULE 10
  {
    id: 'cloud-devops',
    type: 'default',
    position: { x: 500, y: 2530 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-purple-700 text-sm">
            Cloud & DevOps
          </div>
          <div className="text-xs text-gray-600">Foundations</div>
        </div>
      ),
    },
    style: {
      ...nodeStyles.subBranch,
      border: '1.5px solid #7b1fa2',
      background: '#fce4ec',
    },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'docker-orchestration',
    type: 'default',
    position: { x: 500, y: 2580 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-purple-700 text-sm">Container</div>
          <div className="text-xs text-gray-600">Orchestration</div>
        </div>
      ),
    },
    style: {
      ...nodeStyles.subBranch,
      border: '1.5px solid #7b1fa2',
      background: '#fce4ec',
    },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'serverless-deployment',
    type: 'default',
    position: { x: 500, y: 2630 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-purple-700 text-sm">
            Serverless
          </div>
          <div className="text-xs text-gray-600">Deployment</div>
        </div>
      ),
    },
    style: {
      ...nodeStyles.subBranch,
      border: '1.5px solid #7b1fa2',
      background: '#fce4ec',
    },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  {
    id: 'module-11',
    type: 'default',
    position: { x: 750, y: 2800 },
    data: {
      label: (
        <div className="p-4 text-center">
          <div className="font-bold text-purple-700">Module 11</div>
          <div className="text-sm text-black">Optional Skills II</div>
          <div className="text-xs mt-1 text-gray-600">
            ORM, GraphQL, Microservices
          </div>
        </div>
      ),
    },
    style: nodeStyles.optional,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  // Module 11 Sub-branches - ALL ON LEFT SIDE OF MODULE 11
  {
    id: 'orm-advanced',
    type: 'default',
    position: { x: 500, y: 2830 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-purple-700 text-sm">ORM &</div>
          <div className="text-xs text-gray-600">Advanced Data</div>
        </div>
      ),
    },
    style: {
      ...nodeStyles.subBranch,
      border: '1.5px solid #7b1fa2',
      background: '#fce4ec',
    },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'graphql-api',
    type: 'default',
    position: { x: 500, y: 2880 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-purple-700 text-sm">GraphQL</div>
          <div className="text-xs text-gray-600">API Gateways</div>
        </div>
      ),
    },
    style: {
      ...nodeStyles.subBranch,
      border: '1.5px solid #7b1fa2',
      background: '#fce4ec',
    },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'microservices-messaging',
    type: 'default',
    position: { x: 500, y: 2930 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-purple-700 text-sm">
            Microservices
          </div>
          <div className="text-xs text-gray-600">Messaging</div>
        </div>
      ),
    },
    style: {
      ...nodeStyles.subBranch,
      border: '1.5px solid #7b1fa2',
      background: '#fce4ec',
    },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  {
    id: 'monitoring-scaling',
    type: 'default',
    position: { x: 500, y: 2980 },
    data: {
      label: (
        <div className="p-3 text-center">
          <div className="font-semibold text-purple-700 text-sm">
            Monitoring
          </div>
          <div className="text-xs text-gray-600">& Scaling</div>
        </div>
      ),
    },
    style: {
      ...nodeStyles.subBranch,
      border: '1.5px solid #7b1fa2',
      background: '#fce4ec',
    },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },

  // Capstone Project
  {
    id: 'capstone',
    type: 'default',
    position: { x: 250, y: 3200 },
    data: {
      label: (
        <div className="p-4 text-center">
          <div className="font-bold text-red-700">🎯 Final Capstone</div>
          <div className="text-sm text-black">Simple Invoicy</div>
          <div className="text-xs mt-1 text-gray-600">
            Complete SaaS Backend
          </div>
        </div>
      ),
    },
    style: nodeStyles.capstone,
    targetPosition: Position.Top,
  },
];

// CORRECTED EDGES - Sub-modules LEFT, Assignments RIGHT
export const initialEdges = [
  // Main flow connections (vertical flow - keep these the same)
  {
    id: 'e1-2',
    source: 'module-1',
    target: 'module-2',
    animated: false,
    style: edgeStyles.main,
  },
  {
    id: 'e2-3',
    source: 'module-2',
    target: 'module-3',
    animated: false,
    style: edgeStyles.main,
  },
  {
    id: 'e3-4',
    source: 'module-3',
    target: 'module-4',
    animated: false,
    style: edgeStyles.main,
  },
  {
    id: 'e4-5',
    source: 'module-4',
    target: 'module-5',
    animated: false,
    style: edgeStyles.main,
  },
  {
    id: 'e5-6',
    source: 'module-5',
    target: 'module-6',
    animated: false,
    style: edgeStyles.main,
  },
  {
    id: 'e6-7',
    source: 'module-6',
    target: 'module-7',
    animated: false,
    style: edgeStyles.main,
  },
  {
    id: 'e7-8',
    source: 'module-7',
    target: 'module-8',
    animated: false,
    style: edgeStyles.main,
  },
  {
    id: 'e8-9',
    source: 'module-8',
    target: 'module-9',
    animated: false,
    style: edgeStyles.main,
  },

  // Sub-branch connections - ALL SUB-MODULES FROM LEFT SIDE
  // Module 1 sub-branches (all from left side)
  {
    id: 'esub1-1',
    source: 'module-1',
    target: 'js-es6',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },
  {
    id: 'esub1-2',
    source: 'module-1',
    target: 'nodejs-fundamentals',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },
  {
    id: 'esub1-3',
    source: 'module-1',
    target: 'git-basics',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },

  // Module 2 sub-branches (all from left side)
  {
    id: 'esub2-1',
    source: 'module-2',
    target: 'postgresql-basics',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },
  {
    id: 'esub2-2',
    source: 'module-2',
    target: 'postgresql-nodejs',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },
  {
    id: 'esub2-3',
    source: 'module-2',
    target: 'mongodb-basics',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },

  // Module 3 sub-branches (all from left side)
  {
    id: 'esub3-1',
    source: 'module-3',
    target: 'express-fundamentals',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },
  {
    id: 'esub3-2',
    source: 'module-3',
    target: 'rest-api-design',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },

  // Module 4 sub-branches (all from left side)
  {
    id: 'esub4-1',
    source: 'module-4',
    target: 'jwt-auth',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },
  {
    id: 'esub4-2',
    source: 'module-4',
    target: 'security-practices',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },

  // Module 5 sub-branches (all from left side)
  {
    id: 'esub5-1',
    source: 'module-5',
    target: 'file-uploads',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },
  {
    id: 'esub5-2',
    source: 'module-5',
    target: 'email-sending',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },

  // Module 6 sub-branches (all from left side)
  {
    id: 'esub6-1',
    source: 'module-6',
    target: 'stripe-basics',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },
  {
    id: 'esub6-2',
    source: 'module-6',
    target: 'stripe-implementation',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },

  // Module 7 sub-branches (all from left side)
  {
    id: 'esub7-1',
    source: 'module-7',
    target: 'postman-testing',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },
  {
    id: 'esub7-2',
    source: 'module-7',
    target: 'swagger-docs',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },

  // Module 8 sub-branch (from left side)
  {
    id: 'esub8-1',
    source: 'module-8',
    target: 'websocket-basics',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },

  // Module 9 sub-branches (all from left side)
  {
    id: 'esub9-1',
    source: 'module-9',
    target: 'docker-fundamentals',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },
  {
    id: 'esub9-2',
    source: 'module-9',
    target: 'docker-compose',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },

  // Module 10 sub-branches (all from left side)
  {
    id: 'esub10-1',
    source: 'module-10',
    target: 'cloud-devops',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },
  {
    id: 'esub10-2',
    source: 'module-10',
    target: 'docker-orchestration',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },
  {
    id: 'esub10-3',
    source: 'module-10',
    target: 'serverless-deployment',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },

  // Module 11 sub-branches (all from left side)
  {
    id: 'esub11-1',
    source: 'module-11',
    target: 'orm-advanced',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },
  {
    id: 'esub11-2',
    source: 'module-11',
    target: 'graphql-api',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },
  {
    id: 'esub11-3',
    source: 'module-11',
    target: 'microservices-messaging',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },
  {
    id: 'esub11-4',
    source: 'module-11',
    target: 'monitoring-scaling',
    sourceHandle: 'left',
    targetHandle: 'target-right',
    style: edgeStyles.subBranch,
  },

  // Assignment connections - ALL FROM RIGHT SIDE
  {
    id: 'ea1',
    source: 'module-1',
    target: 'assignment-1',
    sourceHandle: 'right',
    targetHandle: 'target-left',
    style: edgeStyles.assignment,
  },
  {
    id: 'ea2',
    source: 'module-2',
    target: 'assignment-2',
    sourceHandle: 'right',
    targetHandle: 'target-left',
    style: edgeStyles.assignment,
  },
  {
    id: 'ea3',
    source: 'module-3',
    target: 'assignment-3',
    sourceHandle: 'right',
    targetHandle: 'target-left',
    style: edgeStyles.assignment,
  },
  {
    id: 'ea4',
    source: 'module-4',
    target: 'assignment-4',
    sourceHandle: 'right',
    targetHandle: 'target-left',
    style: edgeStyles.assignment,
  },
  {
    id: 'ea5',
    source: 'module-5',
    target: 'assignment-5',
    sourceHandle: 'right',
    targetHandle: 'target-left',
    style: edgeStyles.assignment,
  },
  {
    id: 'ea6',
    source: 'module-6',
    target: 'assignment-6',
    sourceHandle: 'right',
    targetHandle: 'target-left',
    style: edgeStyles.assignment,
  },
  {
    id: 'ea7',
    source: 'module-7',
    target: 'assignment-7',
    sourceHandle: 'right',
    targetHandle: 'target-left',
    style: edgeStyles.assignment,
  },
  {
    id: 'ea8',
    source: 'module-8',
    target: 'assignment-8',
    sourceHandle: 'right',
    targetHandle: 'target-left',
    style: edgeStyles.assignment,
  },
  {
    id: 'ea9',
    source: 'module-9',
    target: 'assignment-9',
    sourceHandle: 'right',
    targetHandle: 'target-left',
    style: edgeStyles.assignment,
  },

  // Optional path connections (keep these the same)
  {
    id: 'e9-opt',
    source: 'module-9',
    target: 'optional-branch',
    style: { stroke: '#7b1fa2', strokeDasharray: '10,10' },
  },
  {
    id: 'eopt-10',
    source: 'optional-branch',
    target: 'module-10',
    style: edgeStyles.optionalDashed,
  },
  {
    id: 'e10-11',
    source: 'module-10',
    target: 'module-11',
    animated: false,
    style: edgeStyles.optional,
  },

  // To capstone connections (keep these the same)
  {
    id: 'e9-cap',
    source: 'module-9',
    target: 'capstone',
    animated: false,
    style: edgeStyles.capstone,
  },
  {
    id: 'e11-cap',
    source: 'module-11',
    target: 'capstone',
    style: edgeStyles.capstoneOptional,
  },
];
