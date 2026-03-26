import { App, TerraformStack } from "cdktf";
import { AwsProvider, ecr, ecs, vpc } from "@cdktf/provider-aws";
import { Construct } from "constructs";

class DevOpsStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AwsProvider(this, "aws", {
      region: process.env.AWS_REGION || "us-east-1"
    });

    const repo = new ecr.EcrRepository(this, "repo", {
      name: "tv-devops-app"
    });

    const myVpc = new vpc.Vpc(this, "vpc", {
      cidrBlock: "10.0.0.0/16"
    });

  }
}

const app = new App();
new DevOpsStack(app, "tv-devops");
app.synth();
