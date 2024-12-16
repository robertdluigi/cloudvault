# CloudVault

CloudVault is a secure cloud storage solution that allows users to upload, store, and share files with ease.

This project was built to help me learn Golang and enhance my backend development skills.

---

## Tech Stack

- **Frontend:** React, Next.js, TailwindCSS, Shadcn UI  
- **Backend:** Golang (1.28), GraphQL  
- **Database:** PostgreSQL 17 @ NeonDB (using GORM)  

---

## Features

- **User Authentication**: Secure login and signup with JWT.  
- **File Upload & Storage**: Upload and store files in the cloud.  
- **File Sharing**: Share files easily with others via secure links.  
- **Responsive UI**: Clean, modern, and responsive user interface.  

---

## Prerequisites

Before setting up the app, ensure you have the following installed:

1. **Docker** (to build and run the application)  
2. **kubectl** (for Kubernetes management, if deploying to a cluster)  
3. **IBM Cloud CLI** (for managing IBM Kubernetes cluster)  
4. **Node.js** (latest version, compatible with Next.js)  
5. **Golang 1.28**  

---

## Setup Instructions

Follow the steps below to set up CloudVault locally or on a Kubernetes cluster:

---

### Local Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/cloudvault.git
cd cloudvault
```

### 2. Backend Setup

#### 1. Navigate to the backend directory

```bash
cd backend
```

#### 2. Create a .env file to store environment variables. Use the .env.example as reference

```bash
cp .env.example .env
```

#### 3. Update the .env file with your PostgreSQL connection string, JWT SECRET and other settings

#### 4. Run the backend locally

```bash
go mod tidy
go run server.go
```

#### The backend will be available at http://localhost:8080

### 3. Frontend Setup

#### 1. Navigate to the frontend directory

```bash
cd frontend
```

#### 2. Instal dependencies

```bash
npm install
```

#### 3. Run the frontend

```bash
npm run dev
```

#### The frontend will be available at http://localhost:3000

