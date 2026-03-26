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
    default: "us-east-1",
    description: "AWS region",
  });

  const appName = new TerraformVariable(scope, "app_name", {
    type: "string",
    default: "tv-devops-app",
    description: "Application name",
  });

  const environment = new TerraformVariable(scope, "environment", {
    type: "string",
    default: "dev",
    description: "Environment name",
  });

  const containerPort = new TerraformVariable(scope, "container_port", {
    type: "number",
    default: 3000,
    description: "Container port",
  });

  const desiredCount = new TerraformVariable(scope, "desired_count", {
    type: "number",
    default: 1,
    description: "Desired ECS task count",
  });

  const cpu = new TerraformVariable(scope, "cpu", {
    type: "number",
    default: 256,
    description: "Task CPU",
  });

  const memory = new TerraformVariable(scope, "memory", {
    type: "number",
    default: 512,
    description: "Task memory",
  });

  const imageTag = new TerraformVariable(scope, "image_tag", {
    type: "string",
    default: "latest",
    description: "Docker image tag",
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
