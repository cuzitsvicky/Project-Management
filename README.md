# Project Management System

A full-stack project management application with an admin panel for managing projects, clients, contact forms, and newsletter subscriptions.

## Features

### Landing Page
- Modern, responsive design with interactive background effects
- Contact form submission
- Newsletter subscription
- Project showcase
- Client testimonials

### Admin Panel (`/admin`)
- **Project Management**: Add, edit, delete projects with image upload and cropping (450x350 ratio)
- **Client Management**: Add, edit, delete clients with image upload and cropping (450x350 ratio)
- **Contact Form Management**: View and delete contact form submissions
- **Newsletter Management**: View and delete newsletter subscriptions

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router DOM
- React Image Crop
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Multer (File upload)
- Sharp (Image processing)

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/project-management
```

4. Make sure MongoDB is running locally, or update `MONGODB_URI` with your MongoDB Atlas connection string.

5. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or the port Vite assigns)

## Usage

1. **Access Landing Page**: Navigate to `http://localhost:5173/`
2. **Access Admin Panel**: Navigate to `http://localhost:5173/admin`

### Admin Panel Features

#### Adding a Project
1. Click on "Projects" tab
2. Click "Add Project"
3. Fill in project name and description
4. Upload an image (will be cropped to 450x350 ratio)
5. Crop the image using the interactive crop tool
6. Click "Save"

#### Adding a Client
1. Click on "Clients" tab
2. Click "Add Client"
3. Fill in client name, designation, and description
4. Upload an image (will be cropped to 450x350 ratio)
5. Crop the image using the interactive crop tool
6. Click "Save"

#### Viewing Contact Forms
1. Click on "Contact Forms" tab
2. View all submitted contact forms with details
3. Delete entries as needed

#### Viewing Newsletter Subscriptions
1. Click on "Newsletters" tab
2. View all subscribed email addresses
3. Delete entries as needed

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get single client
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Contacts
- `GET /api/contacts` - Get all contact submissions
- `POST /api/contacts` - Create contact submission
- `DELETE /api/contacts/:id` - Delete contact submission

### Newsletters
- `GET /api/newsletters` - Get all newsletter subscriptions
- `POST /api/newsletters` - Create newsletter subscription
- `DELETE /api/newsletters/:id` - Delete newsletter subscription

## Image Processing

Images uploaded for projects and clients are automatically:
1. Cropped to maintain a 450x350 aspect ratio
2. Resized to 450x350 pixels
3. Stored in the `backend/uploads/` directory
4. Served statically at `/uploads/` endpoint

## Notes

- Make sure MongoDB is running before starting the backend server
- The uploads directory is created automatically
- Images are processed server-side using Sharp
- The frontend uses React Image Crop for client-side preview before upload

