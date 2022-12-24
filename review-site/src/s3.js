import {
  S3Client,
  CreateBucketCommand,
  DeleteBucketCommand,
} from "@aws-sdk/client-s3";

import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";



const region = "us-east-1";
const client = new S3Client({
  region,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region }),
    identityPoolId: "us-east-1:c7c5632d-f694-4055-9d64-0fbfda5c01b0",
  }),
});

const bucketName = 'test-image-store-weviews'