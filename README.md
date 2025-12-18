# FS-Pro: Full-Stack Lesson Management Platform

A full-stack web application for browsing, searching, and managing online lessons with a shopping cart and checkout system.

---

## 📋 Project Overview

**FS-Pro** is a full-stack lesson management platform built with:
- **Frontend**: Vue.js 3 + Vite
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **Deployment**: GitHub Pages (Frontend) + Render (Backend)

The application allows users to:
- Browse and search available lessons
- View lesson details including pricing and available spaces
- Add lessons to a shopping cart
- Manage cart items (increment, decrement, remove)
- Checkout and place orders
- View lesson images and descriptions

---

## 🔗 Important Links

### Frontend
- **[Vue.js App (GitHub Repository)](https://github.com/preciousgit/fs-pro-front-end)** - Frontend source code
- **[Vue.js App (GitHub Pages - Live App)](https://preciousgit.github.io/fs-pro-front-end/)** - Deployed frontend (live application)

***It takes few seconds to load
- LOG IN EMAIL: preciousonyechere3@gmail.com
- PASSWORD: pre123cious

### Backend
- **[Express.js App (GitHub Repository)](https://github.com/preciousgit/fs-pro-back-end)** - Backend source code
- **[Express.js App (Render Deployment)](https://fs-pro-back-end.onrender.com)** - Deployed backend service
- **[Lessons API Endpoint](https://fs-pro-back-end.onrender.com/lessons)** - Returns all lessons from MongoDB

---

## 📁 Project Structure

```
FS-Pro/
├── FS-Pro-BE/                    # Backend (Node.js + Express)
│   ├── server.js                 # Main Express server
│   ├── package.json              # Backend dependencies
│   ├── seed.js                   # MongoDB seed script
│   ├── Config/
│   │   └── db.js                 # Database configuration
│   └── public/images/            # Lesson images
│       ├── mths1.jpg
│       ├── sci-lab2.jpg
│       ├── music3.jpg
│       ├── pgm1.jpg
│       └── ... (11 total images)
│
└── FS-Pro-FE/                    # Frontend (Vue.js + Vite)
    ├── src/
    │   ├── App.vue               # Root component
    │   ├── main.js               # Application entry point
    │   ├── services/
    │   │   └── api.js            # API service layer
    │   ├── components/
    │   │   ├── Navbar.vue        # Navigation bar
    │   │   ├── LessonList.vue    # Lesson listing with search/sort
    │   │   ├── LessonCard.vue    # Individual lesson card
    │   │   ├── CartPage.vue      # Shopping cart
    │   │   ├── ChatBot.vue       # Chatbot component
    │   │   ├── LoginPopup.vue    # Login modal
    │   │   └── FooterSection.vue # Footer
    │   └── assets/
    │       ├── style.css         # Global styles
    │       └── images/           # Static images
    ├── public/                   # Public static files
    ├── .github/workflows/
    │   └── deploy-pages.yml      # GitHub Actions workflow
    ├── package.json              # Frontend dependencies
    ├── vite.config.mjs           # Vite configuration
    └── index.html                # HTML entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (database already configured)

### Frontend Setup

```sh
cd FS-Pro-FE

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The frontend will be available at `http://localhost:5173` (default Vite port).

### Backend Setup

```sh
cd FS-Pro-BE

# Install dependencies
npm install

# Run development server (requires MongoDB connection)
node server.js

# Seed database with lesson data
node seed.js
```

The backend API will be available at `http://localhost:3000`.

---

## 🔌 Backend API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/lessons` | Fetch all lessons |
| GET | `/lessons/:id` | Fetch lesson by ID |
| GET | `/search?q=keyword` | Search lessons by title, location, category |
| PUT | `/lessons/:id` | Update lesson (e.g., available spaces) |
| POST | `/orders` | Create a new order |

### Example API Calls

**Get all lessons:**
```
GET https://fs-pro-back-end.onrender.com/lessons
```

**Search lessons:**
```
GET https://fs-pro-back-end.onrender.com/search?q=math
```

**Get lesson images:**
```
GET https://fs-pro-back-end.onrender.com/images/mths1.jpg
```

---

## 📊 Database Collections

### MongoDB Atlas Collections

The application uses two main collections in the **CourseApp** database:

#### 1. **lessons** Collection
Contains all available lessons with details like title, description, price, available spaces, instructor, location, and image URL.

**Export**: [Download lessons.json](./exports/lessons.json)

**Example Document:**
```json
{
  "_id": { "$oid": "..." },
  "title": "Advanced Mathematics",
  "topic": "Math",
  "description": "Learn advanced mathematical concepts",
  "price": 29.99,
  "spaces": 15,
  "instructor": "Dr. Smith",
  "location": "Room 101",
  "category": "STEM",
  "img": "adv-mths.jpg"
}
```

#### 2. **orders** Collection
Stores all orders placed by users with items, total price, and order date.

**Export**: [Download orders.json](./exports/orders.json)

**Example Document:**
```json
{
  "_id": { "$oid": "..." },
  "items": [
    {
      "id": "lesson-123",
      "title": "Advanced Mathematics",
      "price": 29.99,
      "count": 1
    }
  ],
  "totalPrice": 29.99,
  "date": "2025-11-27T10:30:00Z"
}
```

**How to Export Collections:**
1. Open MongoDB Compass
2. Connect to your MongoDB Atlas cluster
3. Navigate to the **CourseApp** database
4. Right-click on the **lessons** collection → Export Collection
5. Choose JSON format and save the file
6. Repeat for **orders** collection

See [MongoDB Compass Export Guide](https://docs.mongodb.com/compass/current/import-export#export-data-from-a-collection) for detailed instructions.

---

##  Postman Collection

### Requests Exported from Postman

All API requests used during development have been exported from Postman for easy testing and documentation.

**Export**: [Download FS-Pro-API.postman_collection.json](./exports/FS-Pro-API.postman_collection.json)

**Included Requests:**
- GET /lessons - Fetch all lessons
- GET /lessons/:id - Fetch single lesson
- GET /search - Search lessons by keyword
- PUT /lessons/:id - Update lesson spaces
- POST /orders - Create new order

**How to Import into Postman:**
1. Open Postman
2. Click **Import** (top-left)
3. Select **Upload Files** and choose the `.postman_collection.json` file
4. The collection will appear in your Postman workspace
5. Update the base URL to `https://fs-pro-back-end.onrender.com` for production

See [Postman Import/Export Guide](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#exporting-collections) for detailed instructions.

---

##  Key Features

### Shopping Cart
- **Immutable State**: Cart operations don't mutate lesson objects
- **Real-time Availability**: Shows available spaces dynamically based on cart
- **Persistent Cart**: Cart data maintained during user session
- **Checkout**: Places orders to MongoDB and updates lesson availability

### Search & Filter
- **Full-text Search**: Search by lesson title, location, or category
- **Sort Options**: Sort by price, availability, or date added
- **Dynamic Filtering**: Filters update in real-time

### Image Serving
- **Backend Serving**: Lesson images served from `https://fs-pro-back-end.onrender.com/images/`
- **Static Optimization**: Images cached and optimized for performance

### Responsive Design
- **Mobile-Friendly**: Works on desktop, tablet, and mobile devices
- **Vue.js Components**: Modular, reusable component architecture

---

##  Environment Configuration

### Frontend (.env)
```
VITE_API_URL=https://fs-pro-back-end.onrender.com
```

### Backend (server.js)
```javascript
// const uri = 'private';
```

---

## 📝 Development Workflow

1. **Frontend Development**:
   ```sh
   npm run dev          # Start dev server on localhost:5173
   npm run build        # Build for production
   ```

2. **Backend Development**:
   ```sh
   node server.js       # Start server on localhost:3000
   node seed.js         # Seed MongoDB with initial data
   ```

3. **Database Management**:
   - MongoDB Atlas Console: Manage collections and data
   - MongoDB Compass: Local GUI for database exploration

4. **Deployment**:
   - **Frontend**: GitHub Actions automatically builds and deploys to GitHub Pages
   - **Backend**: Render automatically redeploys on `git push` to main branch

---

## 📦 Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | Vue.js 3 + Vite |
| Styling | CSS3 |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| Version Control | Git + GitHub |
| CI/CD | GitHub Actions |
| Hosting | GitHub Pages (FE) + Render (BE) |

---

##  Author

**Precious Onyechere**
- GitHub: [@preciousgit](https://github.com/preciousgit)
- Email: preciousonyechere3@gmail.com

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

##  Support

For issues, questions, or suggestions, please open an issue on the GitHub repository or contact the author.

---

**Last Updated**: November 27, 2025
