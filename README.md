# Pankart - E-Commerce Backend API

A Node.js backend API for the Pankart e-commerce platform that handles authentication, product management, order processing, and payment integration.

**Live API:** [https://pankart-backend.vercel.app](https://pankart-backend.vercel.app)

## Features

- **User Authentication**

  - JWT-based authentication
  - Role-based access control (Admin, User)
  - Secure registration and login

- **Product Management**

  - CRUD operations for products
  - Search and filter capabilities
  - Stock management

- **Order Processing**

  - Create and manage orders
  - Order history for users
  - Stock validation to prevent overselling

- **Payment Integration**
  - Stripe payment processing
  - Secure checkout
  - Payment verification

## Technology Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Stripe API** - Payment processing
- **bcrypt** - Password hashing
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing support

## Project Structure

```
C:.
├───models              # Database models
│       Order.js        # Order model definition
│       Product.js      # Product model definition
│       User.js         # User model definition
│
├───routes              # API route definitions
│       authRoutes.js   # Authentication routes
│       orderRoutes.js  # Order management routes
│       productRoutes.js # Product management routes
│       stripeRoutes.js # Payment processing routes
│
└───server              # Server configuration
    ├───config          # Configuration files
    │       db.js       # Database connection setup
    │
    ├───controllers     # Route controllers
    │       authController.js    # Authentication logic
    │       orderController.js   # Order processing logic
    │       productController.js # Product management logic
    │       stripeController.js  # Payment processing logic
    │
    └───middleware      # Express middleware
            auth.js     # Authentication middleware
            error.js    # Error handling middleware
```

## API Endpoints

### Base Routes

- `GET /` - Basic route that confirms the backend is running
- `GET /api/health` - Health check endpoint

### Authentication Routes

- `/api/auth` - Authentication routes (registration, login, etc.)

### Product Routes

- `/api/products` - Product management routes

### Order Routes

- `/api/orders` - Order processing routes

### Payment Routes

- `/api/stripe` - Stripe payment integration routes

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB
- Stripe account

### Installation

1. Clone the repository

```
git clone https://github.com/lucky7xx/pankart_backend.git
cd pankart_backend
```

2. Install dependencies

```
npm install
```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_URL=http://localhost:3000
```

4. Start the development server

```
npm run dev
```

5. The API will be available at `http://localhost:5000`

### Order Model

```javascript
{
  user: ObjectId (ref: 'User'),
  products: [
    {
      product: ObjectId (ref: 'Product'),
      quantity: Number,
      price: Number
    }
  ],
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  paymentMethod: String,
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  totalPrice: Number,
  isPaid: Boolean,
  paidAt: Date,
  isDelivered: Boolean,
  deliveredAt: Date,
  createdAt: Date
}
```

## Error Handling

The API uses a centralized error handling middleware that:

- Catches all exceptions thrown in controllers
- Formats error responses consistently
- Includes appropriate HTTP status codes
- Provides detailed error messages in development

## Deployment

The API is deployed on Vercel and can be accessed at:
[https://pankart-backend.vercel.app](https://pankart-backend.vercel.app)

### Deployment Configuration

- **Platform:** Vercel
- **Production Branch:** main
- **Build Command:** `npm install`
- **Output Directory:** N/A (Serverless Functions)
- **Environment Variables:** Configured in Vercel dashboard

### Testing the Deployment

You can verify the API is running by accessing:

- Base URL: [https://pankart-backend.vercel.app](https://pankart-backend.vercel.app)
- Health Check: [https://pankart-backend.vercel.app/api/health](https://pankart-backend.vercel.app/api/health)

## Security Measures

- Password hashing with bcrypt
- JWT authentication with expiration
- Middleware for route protection
- MongoDB injection prevention
- CORS configuration for frontend access

## Acknowledgements

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [JWT Documentation](https://jwt.io/)
- [Stripe API Documentation](https://stripe.com/docs/api)
