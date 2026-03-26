# TurboVets DevOps Assessment

This project demonstrates a full DevOps workflow including:

- Docker containerization
- Local development with Docker Compose
- Infrastructure as Code using CDK for Terraform (TypeScript)
- CI/CD pipeline using GitHub Actions
- Deployment to AWS ECS (Fargate)
- Public application endpoint

---

## Project Structure
.
├── app/ # Application + Docker + Compose
├── iac/ # Infrastructure (CDKTF)
├── .github/ # CI/CD pipeline
└── README.md

---

## Local Development

### Run application locally

```bash
cd app
docker compose up --build

Test endpoint

Open in browser:
cd app
docker compose up --build

Test endpoint

Open in browser:
http://52.90.175.25:3000/health

Expected response:
{"status":"ok"}

Infrastructure (AWS)

Infrastructure is defined using CDK for Terraform (TypeScript).

Resources include:

VPC
Public subnets
Internet Gateway
Security groups
ECS Cluster (Fargate)
ECS Service
Task Definition
IAM roles
ECR repository (existing)
CI/CD Pipeline

GitHub Actions pipeline:

Trigger: push to main
Builds Docker image
Pushes image to Amazon ECR
Deploys infrastructure using CDKTF
Required GitHub Secrets
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
ECR_URI
TF_STATE_BUCKET
TF_LOCK_TABLE

Deployment

Deployment is automated via GitHub Actions.

Manual deployment:
cd iac
npm install
npx cdktf get
npx cdktf deploy --auto-approve

Public Endpoint

The application is deployed and accessible at:
http://52.90.175.25:3000/health

Destroy Infrastructure
cd iac
npx cdktf destroy --auto-approve

Expected response:
{"status":"ok"}

Infrastructure (AWS)

Infrastructure is defined using CDK for Terraform (TypeScript).

Resources include:

VPC
Public subnets
Internet Gateway
Security groups
ECS Cluster (Fargate)
ECS Service
Task Definition
IAM roles
ECR repository (existing)
CI/CD Pipeline

GitHub Actions pipeline:

Trigger: push to main
Builds Docker image
Pushes image to Amazon ECR
Deploys infrastructure using CDKTF
Required GitHub Secrets
AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY
ECR_URI
TF_STATE_BUCKET
TF_LOCK_TABLE

Deployment

Deployment is automated via GitHub Actions.

Manual deployment:
cd iac
npm install
npx cdktf get
npx cdktf deploy --auto-approve

Public Endpoint

The application is deployed and accessible at:
http://52.90.175.25:3000/health

Destroy Infrastructure
cd iac
npx cdktf destroy --auto-approve
