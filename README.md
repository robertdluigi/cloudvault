# CloudVault

CloudVault is a secure cloud storage solution that allows users to upload, store, and share files with ease.

This project was built to help me learn Golang and enhance my backend development skills.

---

## Tech Stack

- **Frontend:** React, Next.js, TailwindCSS, Shadcn UI  
- **Backend:** Golang (1.22), GraphQL  
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
5. **Golang 1.22**  

---

## Setup Instructions

Follow the steps below to set up CloudVault locally or on a Kubernetes cluster:

---

### Local Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/robertdluigi/cloudvault.git
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

The backend will be available at http://localhost:8080

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
The frontend will be available at http://localhost:3000

## Docker Setup

To containerize and rup the app using Docker

### 1. Build Docker Images

**Backend:**

```bash
docker build -t cloudvault-backend ./backend
```

**Frontend:**

```bash
docker build -t cloudvault-frontend ./frontend
```

### 2. Run Docker Containers

```bash
docker network create cloudvault-network

docker run -d --name cloudvault-backend --network cloudvault-network -o 8080:8080 cloudvault-backend

docker run -d --name cloudvault-frontend --network cloudvault-network -o 3000:3000 cloudvault-frontend
```

Access the app at http://localhost:3000

## Kubernetes Deployment (IBM Cloud)

### 1. Kubernetes Cluster

#### 1. Login to IBM Cloud

```bash
ibmcloud login
```

#### 2. Create a free-tier Kubernetes cluster

```bash
ibmcloud ks create cluster free --name cloudvault-cluster --zone <zone-name>
```

#### 3. Configure kubectl for the cluster

```bash
ibmcloud ks config --cluster cloudvault-cluster
```

### 2. Apply Kubernetes Resources

#### 1. Build Docker Images and push them to a container registry (e.g. Docker Hub or IBM Container Registry):

```bash
docker tag cloudvault-backend <your-registry>/cloudvault-backend:latest
docker push <your registry>/cloudvault-backend:latest

docker tag cloudvault-frontend <your-registry>/cloudvault-frontend:latest
docker push <your registry>/cloudvault-frontend:latest
```

#### 2. Deploy the backend and frontend to Kubernetes using the provided manifests

*Before running this, open the files and edit the registry name and the environment variables*

```bash
kubectl apply -f k8s/backend=deployment.yml
kubectl apply -f k8s/backend-service.yml

kubectl apply -f k8s/frontend-deployment.yml
kubectl apply -f k8s/frontend-service.yml
```


#### 3. Verify the deployments

```bash
kubectl get pods
kubectl get svc
```

#### 4. Access the app via the EXTERNAL-IP or YOUR-DOMAIN provided by the frontend service

```bash
http://<EXTERNAL-IP>
```

```bash
http://<YOUR-DOMAIN>
```

## Future Improvements

- **Third-Party Cloud Storage**
- **User activity and file usage**
- **Real-time collaboration on shared files**
- **File Encryption**
