const serverlessConfiguration = {
    service: "aula-04-serverless",
    frameworkVersion: "3",
    plugins: ["serverless-esbuild", "serverless-dynamodb-local", "serverless-offline"],
    provider: {
        name: "aws",
        region: "sa-east-1",
        runtime: "nodejs14.x",
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
            NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
        },
        iamRoleStatements: [
            {
                Effect: "Allow",
                Action: ["dynamodb:*"],
                Resource: ["*"],
            },
        ],
    },
    functions: {
        generateCertificate: {
            handler: "src/functions/generateCertificate.handler",
            events: [
                {
                    http: {
                        path: "generateCertificate",
                        method: "post",
                        cors: true,
                    },
                },
            ],
        },
    },
    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ["aws-sdk"],
            target: "node14",
            define: { "require.resolve": undefined },
            platform: "node",
            concurrency: 10,
            external: ["chrome-aws-lambda"],
        },
        dynamodb: {
            stages: ["dev", "local"],
            start: {
                port: 8000,
                inMemory: true,
                migrate: true,
            },
        },
    },
    resources: {
        Resources: {
            dbCertificateUsers: {
                Type: "AWS::DynamoDB::Table",
                Properties: {
                    TableName: "users_certificate",
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 5,
                        WriteCapacityUnits: 5,
                    },
                    AttributeDefinitions: [
                        {
                            AttributeName: "id",
                            AttributeType: "S",
                        },
                    ],
                    KeySchema: [
                        {
                            AttributeName: "id",
                            KeyType: "HASH",
                        },
                    ],
                },
            },
        },
    },
};
module.exports = serverlessConfiguration;
export {};
//# sourceMappingURL=serverless.js.map