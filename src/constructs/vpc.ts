import {
  Vpc,
  SubnetType,
  SecurityGroup,
  Peer,
  Port,
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export class VPC extends Construct {
  public vpc: Vpc;
  public securityGroup: SecurityGroup;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.vpc = new Vpc(this, "VPC", {
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "Private",
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
        {
          cidrMask: 24,
          name: "Public",
          subnetType: SubnetType.PUBLIC,
        },
      ],
    });

    this.securityGroup = new SecurityGroup(this, "QuerySecurityGroup", {
      vpc: this.vpc,
      description: "Security Group for Database Queries",
      allowAllOutbound: true,
    });
    this.securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(5432));
  }
}
