import { TerraformVariable } from "cdktf";
import { Construct } from "constructs";

export interface AppVariables {
  awsRegion: TerraformVariable;
  appName: TerraformVariable;
  environment: TerraformVariable;
  containerPort: TerraformVariable;
  desiredCount: TerraformVariable;
  cpu: TerraformVariable;
  memory: TerraformVariable;
  imageTag: TerraformVariable;
}

export function createVariables(scope: Construct): AppVariables {
  const awsRegion = new TerraformVariable(scope, "aws_region", {
    type: "string",
    description: "AWS region for deployment",
    default: "us-east-1",
  });

  const appName = new TerraformVariable(scope, "app_name", {
    type: "string",
    description: "Application name",
    default: "tv-devops-app",
  });

  const environment = new TerraformVariable(scope, "environment", {
    type: "string",
    description: "Deployment environment",
    default: "dev",
  });

  const containerPort = new TerraformVariable(scope, "container_port", {
    type: "number",
    description: "Container port exposed by the app",
    default: 3000,
  });

  const desiredCount = new TerraformVariable(scope, "desired_count", {
    type: "number",
    description: "Desired number of ECS tasks",
    default: 1,
  });

  const cpu = new TerraformVariable(scope, "cpu", {
    type: "number",
    description: "Fargate task CPU units",
    default: 256,
  });

  const memory = new TerraformVariable(scope, "memory", {
    type: "number",
    description: "Fargate task memory in MiB",
    default: 512,
  });

  const imageTag = new TerraformVariable(scope, "image_tag", {
    type: "string",
    description: "Docker image tag to deploy",
    default: "latest",
  });

  return {
    awsRegion,
    appName,
    environment,
    containerPort,
    desiredCount,
    cpu,
    memory,
    imageTag,
  };
}
