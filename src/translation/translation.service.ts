import { Injectable } from '@nestjs/common';
import { AwsS3Service } from "../s3/s3.service";
import { FileObject } from './dto/file-object.dto';



@Injectable()
export class TranslationService {
    constructor(private readonly awsS3Service: AwsS3Service
    ) {}

    async getTranslationUrl(languageId: String, folderName: String): Promise<String | null> {
        const s3 = await this.awsS3Service.generatePresignedUrl(process.env.AWS_BUCKET_NAME, folderName + "/i18n_"+languageId+".json", 3600);
        return s3; 
    }
    async getLatestVersionInformation(languageId: string, folderName: string): Promise<FileObject>{
        return this.awsS3Service.getLatestVersionInformation(process.env.AWS_BUCKET_NAME, folderName+"/i18n_"+languageId+".json");

    }

    async uploadFile(fileData: Buffer, languageId: string, folderName: string): Promise<boolean>{
        // console.log("uploading file " + process.env.AWS_BUCKET_NAME, folderName+ "/i18n_"+languageId+".json");
        // return false
        //         const jsonDataBuffer: Buffer = fileData; // Your buffer data
        // const jsonDataString: string = jsonDataBuffer.toString('utf-8');

        // console.log(JSON.stringify(jsonDataString));
    // return false;
        return this.awsS3Service.uploadFile( process.env.AWS_BUCKET_NAME, folderName+ "/i18n_"+languageId+".json", fileData );

    }

    getLanguageNameById(langId: string):string{
        var language = "N/A";
        switch(langId){
            case "en":
                language = "English";
                break;
            case "hi":
                language = "Hindi";
                break;
            case "te":
                language = "Telugu";
                break;
            case "mr":
                language = "Marathi";
                break;
            case "sp":
                language = "Spanish";
                break;
            default:
                language = "N/A";
                break;
        }
        return language;
    }

    }

