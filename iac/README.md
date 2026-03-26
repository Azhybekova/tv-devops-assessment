# Infrastructure as Code - TurboVets DevOps Assessment

This folder contains the AWS infrastructure code for deploying the Express application using **CDK for Terraform (CDKTF) in TypeScript**.

## What this stack creates

The stack provisions the following AWS resources:

- ECR repository for storing the Docker image
- VPC
- Public subnets
- Internet Gateway
- Route table and associations
- Security group for ECS
- ECS Cluster
- ECS Task Execution Role
- ECS Task Role
- ECS Task Definition
- ECS Service running on AWS Fargate

## Requirements

Before deploying, make sure you have:

- AWS account access
- AWS CLI installed and configured
- Node.js installed
- npm installed
- Terraform installed
- CDKTF CLI installed

## Install dependencies

From the `iac` directory:

```bash
npm install
