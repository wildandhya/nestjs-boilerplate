# NestJS Boilerplate

## Description

This repository serves as a robust starting point for building secure and scalable applications using the NestJS framework. It is designed with modern development practices and features a suite of tools and patterns to enhance productivity, security, and maintainability.

## Features

- [x] Database
  - [x] Typeorm ([@nestjs/typeorm](https://www.npmjs.com/package/@nestjs/typeorm))
- [x] Config Service
  - [x] [@nestjs/config](https://www.npmjs.com/package/@nestjs/config)
- [x] Authentication
  - [x] JWT ([@nestjs/jwt](https://www.npmjs.com/package/@nestjs/jwt))
  - [x] Bcrypt
- [x] Authorization
  - [x] Role-Based Access Control (RBAC)
  - [x] Claim-Based Authorization
- [x] Documentation
  - [x] Swagger ([@nestjs/swagger](https://www.npmjs.com/package/@nestjs/swagger))
  - [x] Scalar ([@scalar/nestjs-api-reference](https://www.npmjs.com/package/@scalar/nestjs-api-reference))
- [ ] Message Broker
  - [ ] Kafka
- [ ] Cache
  - [ ] Redis
- [x] Docker


## Getting Started

Follow the steps below to set up and run the codebase on your local machine.

### Prerequisites

- Node.js (v16.x or later)
- npm or yarn for dependency management
- Docker (optional, for running the application in a containerized environment)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/wildandhya/nestjs-boilerplate.git
cd nestjs-boilerplate
```

2. Install dependencies:

```bash
npm install
```

3. Set up the environment variables by creating a .env file:

```bash
cp .env.example .env
```

### Running the Application

1. Start the application in development mode:

```bash
npm run start:dev
```

2. Access the API documentation at http://localhost:3000/docs

3. To build for production:

```bash
npm run build
npm run start:prod
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
