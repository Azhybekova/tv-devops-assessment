import { App, TerraformStack } from "cdktf";
import { Construct } from "constructs";

import { AwsProvider } from "@cdktf/provider-aws/lib/provider";
import { DataAwsCallerIdentity } from "@cdktf/provider-aws/lib/data-aws-caller-identity";
import { EcrRepository } from "@cdktf/provider-aws/lib/ecr-repository";
import { Vpc } from "@cdktf/provider-aws/lib/vpc";
import { Subnet } from "@cdktf/provider-aws/lib/subnet";
import { InternetGateway } from "@cdktf/provider-aws/lib/internet-gateway";
import { RouteTable } from "@cdktf/provider-aws/lib/route-table";
import { Route } from "@cdktf/provider-aws/lib/route";
import { RouteTableAssociation } from "@cdktf/provider-aws/lib/route-table-association";
import { SecurityGroup } from "@cdktf/provider-aws/lib/security-group";
import { EcsCluster } from "@cdktf/provider-aws/lib/ecs-cluster";
import { IamRole } from "@cdktf/provider-aws/lib/iam-role";
import { IamRolePolicyAttachment } from "@cdktf/provider-aws/lib/iam-role-policy-attachment";
import { EcsTaskDefinition } from "@cdktf/provider-aws/lib/ecs-task-definition";
import { EcsService } from "@cdktf/provider-aws/lib/ecs-service";

import { createVariables } from "./variables";

class DevOpsStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vars = createVariables(this);

    new AwsProvider(this, "aws", {
      region: vars.awsRegion.stringValue,
    });

    const caller = new DataAwsCallerIdentity(this, "current", {});

    const ecrRepo = new EcrRepository(this, "ecrRepo", {
      name: `${vars.appName.stringValue}-${vars.environment.stringValue}`,
      imageTagMutability: "MUTABLE",
      forceDelete: true,
    });

    const vpc = new Vpc(this, "vpc", {
      cidrBlock: "10.0.0.0/16",
      enableDnsHostnames: true,
      enableDnsSupport: true,
      tags: {
        Name: `${vars.appName.stringValue}-${vars.environment.stringValue}-vpc`,
      },
    });

    const subnet1 = new Subnet(this, "subnet1", {
      vpcId: vpc.id,
      cidrBlock: "10.0.1.0/24",
      availabilityZone: `${vars.awsRegion.stringValue}a`,
      mapPublicIpOnLaunch: true,
      tags: {
        Name: `${vars.appName.stringValue}-${vars.environment.stringValue}-subnet-1`,
      },
    });

    const subnet2 = new Subnet(this, "subnet2", {
      vpcId: vpc.id,
      cidrBlock: "10.0.2.0/24",
      availabilityZone: `${vars.awsRegion.stringValue}b`,
      mapPublicIpOnLaunch: true,
      tags: {
        Name: `${vars.appName.stringValue}-${vars.environment.stringValue}-subnet-2`,
      },
    });

    const igw = new InternetGateway(this, "igw", {
      vpcId: vpc.id,
      tags: {
        Name: `${vars.appName.stringValue}-${vars.environment.stringValue}-igw`,
      },
    });

    const routeTable = new RouteTable(this, "routeTable", {
      vpcId: vpc.id,
      tags: {
        Name: `${vars.appName.stringValue}-${vars.environment.stringValue}-rt`,
      },
    });

    new Route(this, "defaultRoute", {
      routeTableId: routeTable.id,
      destinationCidrBlock: "0.0.0.0/0",
      gatewayId: igw.id,
    });

    new RouteTableAssociation(this, "rta1", {
      subnetId: subnet1.id,
      routeTableId: routeTable.id,
    });

    new RouteTableAssociation(this, "rta2", {
      subnetId: subnet2.id,
      routeTableId: routeTable.id,
    });

    const ecsSecurityGroup = new SecurityGroup(this, "ecsSecurityGroup", {
      name: `${vars.appName.stringValue}-${vars.environment.stringValue}-sg`,
      vpcId: vpc.id,
      ingress: [
        {
          fromPort: vars.containerPort.numberValue,
          toPort: vars.containerPort.numberValue,
          protocol: "tcp",
          cidrBlocks: ["0.0.0.0/0"],
        },
      ],
      egress: [
        {
          fromPort: 0,
          toPort: 0,
          protocol: "-1",
          cidrBlocks: ["0.0.0.0/0"],
        },
      ],
    });

    const ecsCluster = new EcsCluster(this, "ecsCluster", {
      name: `${vars.appName.stringValue}-${vars.environment.stringValue}-cluster`,
    });

    const executionRole = new IamRole(this, "executionRole", {
      name: `${vars.appName.stringValue}-${vars.environment.stringValue}-execution-role`,
      assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "ecs-tasks.amazonaws.com",
            },
          },
        ],
      }),
    });

    new IamRolePolicyAttachment(this, "executionRolePolicy", {
      role: executionRole.name,
      policyArn:
        "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
    });

    const taskRole = new IamRole(this, "taskRole", {
      name: `${vars.appName.stringValue}-${vars.environment.stringValue}-task-role`,
      assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "ecs-tasks.amazonaws.com",
            },
          },
        ],
      }),
    });

    const imageUri = `${caller.accountId}.dkr.ecr.${vars.awsRegion.stringValue}.amazonaws.com/${ecrRepo.name}:${vars.imageTag.stringValue}`;

    const taskDefinition = new EcsTaskDefinition(this, "taskDefinition", {
      family: `${vars.appName.stringValue}-${vars.environment.stringValue}`,
      networkMode: "awsvpc",
      requiresCompatibilities: ["FARGATE"],
      cpu: String(vars.cpu.numberValue),
      memory: String(vars.memory.numberValue),
      executionRoleArn: executionRole.arn,
      taskRoleArn: taskRole.arn,
      containerDefinitions: JSON.stringify([
        {
          name: vars.appName.stringValue,
          image: imageUri,
          essential: true,
          portMappings: [
            {
              containerPort: vars.containerPort.numberValue,
              hostPort: vars.containerPort.numberValue,
              protocol: "tcp",
            },
          ],
        },
      ]),
    });

    new EcsService(this, "ecsService", {
      name: `${vars.appName.stringValue}-${vars.environment.stringValue}-service`,
      cluster: ecsCluster.id,
      taskDefinition: taskDefinition.arn,
      desiredCount: vars.desiredCount.numberValue,
      launchType: "FARGATE",
      networkConfiguration: {
        assignPublicIp: true,
        securityGroups: [ecsSecurityGroup.id],
        subnets: [subnet1.id, subnet2.id],
      },
    });
  }
}

const app = new App();
new DevOpsStack(app, "tv-devops");
app.synth();
