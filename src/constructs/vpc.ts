import {
  Vpc,
  SubnetType,
  SecurityGroup,
  NatInstanceProvider,
  InstanceType,
  InstanceClass,
  InstanceSize,
  LookupMachineImage,
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
          name: "PrivateWithEgress",
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 24,
          name: "Public",
          subnetType: SubnetType.PUBLIC,
        },
      ],

      // Sourced from the wonderful CDK FckNat at https://github.com/AndrewGuenther/cdk-fck-nat
      natGatewayProvider: new NatInstanceProvider({
        instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO),
        machineImage: new LookupMachineImage({
          name: "fck-nat-amzn2-*-arm64-ebs",
          owners: ["568608671756"],
        }),
      }),

      // This also controls the number of NAT instances to be added!
      natGateways: 1,
    });

    this.securityGroup = new SecurityGroup(this, "LambdaSecurityGroup", {
      vpc: this.vpc,
      description:
        "Allow inbound HTTP traffic from API Gateway and all outbound",
      allowAllOutbound: true,
    });
    this.securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(80));
    this.securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(443));
  }
}
