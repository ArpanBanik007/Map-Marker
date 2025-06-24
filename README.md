# Map-Marker
Tag your favorite places. Anytime. Anywhere.
📍 Map Marker API

A secure and modular RESTful API built with Node.js, Express, and MongoDB that allows authenticated users to create, update, search, and manage location markers based on categories, keywords, and geolocation.

-----------------------------------

🚀 Features

- ✅ JWT Authentication
- 📌 CRUD operations for map markers
- 🧭 Location-based search (by proximity)
- 🔍 Category & keyword filtering
- 🧵 Rate limiting to prevent abuse
- 📋 Robust input validation
- 🔐 User-specific data isolation
- 🛠️ Built using ESModules, asyncHandler, and custom ApiError/ApiResponse

-----------------------------------

📁 Folder Structure

📦 Backend
├── controllers/
│   └── marker.controller.js
├── models/
│   ├── user.model.js
│   └── marker.model.js
├── routes/
│   └── marker.routes.js
├── middlewares/
│   └── auth.middleware.js
├── utils/
│   ├── asyncHandler.js
│   ├── ApiError.js
│   └── ApiResponse.js
├── server.js
└── .env

-----------------------------------

🛠️ Setup Instructions

1. Clone the repository
   git clone https://github.com/your-username/map-marker-api.git
   cd map-marker-api

2. Install dependencies
   npm install

3. Configure environment variables (.env file)
   PORT=8000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dbname
   JWT_SECRET=your_jwt_secret

4. Run the server
   npm run dev

You should see:
MongoDB connected !!
Server is running on port 8000

-----------------------------------

🔐 Authentication

All protected routes require a JWT token in headers:
Authorization: Bearer <your_token>

You must first register/login and get a token to access marker routes.

-----------------------------------

📌 Marker API Routes

Method | Route                 | Description                       | Auth
-------|----------------------|-----------------------------------|-----
POST   | /api/markers          | Create a new marker               | ✅
GET    | /api/markers          | Get all user markers              | ✅
GET    | /api/markers/:id      | Get a marker by ID                | ✅
PATCH  | /api/markers/:id      | Update marker by ID               | ✅
DELETE | /api/markers/:id      | Delete marker by ID               | ✅
GET    | /api/markers/search   | Search markers (category, keyword, geo) | ✅

-----------------------------------

🔎 Search & Filter Markers

Endpoint:
GET /api/markers/search

Query Parameters:
- category: Filter by category
- keyword: Search title or description
- lat: Latitude (optional)
- lng: Longitude (optional)
- radius: Radius in meters (optional)
- page: Page number for pagination (default = 1)
- limit: Results per page (default = 10, max = 100)

Note: If lat, lng, and radius are used, they must all be provided together.

-----------------------------------

🧪 Testing in Postman

1. Login or register and copy the token
   - Set Authorization tab:
     Bearer <your_token>

2. Create Marker
   POST /api/markers

   Request Body:
   {
     "title": "Awesome Restaurant",
     "description": "Best biryani in town!",
     "latitude": 22.5726,
     "longitude": 88.3639,
     "category": "restaurant",
     "tags": ["biryani", "halal"]
   }

3. Search Marker
   GET /api/markers/search?category=restaurant&keyword=biryani&lat=22.5726&lng=88.3639&radius=1000

-----------------------------------

🌍 MongoDB Indexing

To enable proximity search, add this in your schema:
markerSchema.index({ location: "2dsphere" });

-----------------------------------

⚠️ Rate Limiting (Optional)

To add basic rate limiting, install express-rate-limit and apply:

import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests/min
});

-----------------------------------

🧠 Future Improvements

- ✅ Unit tests using Jest or Mocha
- 🧭 Frontend map integration (e.g. Leaflet.js)
- 📦 Export markers as GeoJSON
- 🧾 Admin user for moderation

-----------------------------------

📃 License

This project is licensed under the MIT License.

-----------------------------------

👤 Author

Developed by Arpan Banik – https://github.com/your-username

-----------------------------------
