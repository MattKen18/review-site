
import ReactS3Client from 'react-aws-s3-typescript';

// const config = {
//   bucketName: S3_BUCKET,
//   dirName: '', 
//   region: REGION,
//   accessKeyId: ACCESS_ID,
//   secretAccessKey: SECRET_ACCESS_KEY,
// }

// const s3 = new ReactS3Client(config);

const s3Client = (config) => {
  return new ReactS3Client(config)
}

export default s3Client




// import {
//   S3Client,
//   CreateBucketCommand,
//   DeleteBucketCommand,
// } from "@aws-sdk/client-s3";

// import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
// import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";



// const region = "us-east-1";
// const client = new S3Client({
//   region,
//   credentials: fromCognitoIdentityPool({
//     client: new CognitoIdentityClient({ region }),
//     identityPoolId: "us-east-1:c7c5632d-f694-4055-9d64-0fbfda5c01b0",
//   }),
// });

// const bucketName = 'test-image-store-weviews'