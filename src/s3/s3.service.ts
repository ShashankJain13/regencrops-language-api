import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { FileObject } from 'src/translation/dto/file-object.dto';

@Injectable()
export class AwsS3Service {
  private readonly s3: S3;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY, 
      secretAccessKey: process.env.AWS_SECRET_KEY, 
      region: process.env.AWS_REGION, 
    });
  }

  getS3Client(): S3 {
    return this.s3;
  }

  async getLatestVersionInformation(bucketName: string, key: string): Promise<FileObject>{
    
    let fileObject = await this.getLatestFileVersionAsString(bucketName, key);
    const latestVersionObject = JSON.parse(fileObject);
    const finalObject: FileObject = {
      versionId: latestVersionObject['VersionId'],
      isLatest: latestVersionObject['IsLatest']
    };
    return finalObject;
  }

  async generatePresignedUrl(bucketName: string, key: string, expirySeconds: number): Promise<String> {
    // const params: S3.Types.GetObjectRequest = {
    //   Bucket: bucketName,
    //   Key: key,
    //   Expires: expirySeconds

    // };


    let params = {
        Bucket: bucketName,
        Key: key,
        Expires: expirySeconds
    };
    return this.s3.getSignedUrlPromise('getObject', params);
  }

  private async getLatestFileVersionAsString(bucketName: string, key: string): Promise<string> {
    const latestVersion = await this.getLatestFileVersion(bucketName, key);
    
    // Return the entire object as a string
    return JSON.stringify(latestVersion);
  }

  async getLatestFileVersion(bucketName: string, key: string): Promise<AWS.S3.Object> {
    const params: AWS.S3.Types.ListObjectVersionsRequest = {
      Bucket: bucketName,
      Prefix: key,
    };

    // Get object versions from S3
    const versions = await this.s3.listObjectVersions(params).promise();

    // Sort the versions by last modified date in descending order
    const sortedVersions = versions.Versions.sort((a, b) => {
      return b.LastModified.getTime() - a.LastModified.getTime();
    });

    // Return the latest version
    return sortedVersions[0];
  }

  
  async uploadFile(bucketName: string, fileKey: string, fileData: Buffer): Promise<boolean> {
   try{
    await this.s3   
    .upload({
      Bucket: bucketName,
      Key: fileKey,
      Body: fileData,
    })
    .promise();
    return true;
   }catch(e){
    return false;
   }
  }
  
}
