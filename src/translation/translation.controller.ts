import {
    Controller,
    Get,
    Res,
    // Post,
    // Put,
    // Delete,
    Body,
    Param,
    Post,
    Query,
    HttpStatus,
    UsePipes,
    UseInterceptors,
     UploadedFile
} from '@nestjs/common';
import { json } from 'express';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';



import {TranslationService} from "./translation.service";
import {FileObject} from "./dto/file-object.dto"
// import { QueryValidationPipe } from '../pipes/query-validation.pipe';
const availableLangIds: string[] = ['en', 'sp', 'hi', 'te', 'mr'];



@Controller('translation')
export class TransalationController {
    constructor(private readonly translationService: TranslationService, ) {}

    @Get()
    async getTranslation(@Query('id') id: string, @Query('appVersionId') appVersionId: string, @Query('backendVersionId') backendVersionId: string, @Res() res: Response) { 

        if(!id){
            return res.status(HttpStatus.BAD_REQUEST).send({
                "message": "Language id is required",
                "data": {
                }
            });
        }
     
        if(!availableLangIds.includes(id)){
            return res.status(HttpStatus.BAD_REQUEST).send({
                "message": "Language is not available for this id",
                "data": {
                }
            });
        }
        let appLanguageObject = {};
        let backendLanguageObject = {};


        //getting language for backend
        const latestFileInforVersionBackend: FileObject= await this.translationService.getLatestVersionInformation(id, "language");
        if(latestFileInforVersionBackend.versionId != backendVersionId && latestFileInforVersionBackend.isLatest == true){
            const translation = await this.translationService.getTranslationUrl(id, "language");
            backendLanguageObject = {
                "url": translation,
                "lang_id": id,
                "version_id": latestFileInforVersionBackend.versionId,
                "update_available": true
             }
        }else{
            backendLanguageObject =  {
                "url": "",
                "lang_id": id,
                "version_id": latestFileInforVersionBackend.versionId,
                "update_available": false
             }
        }

        //getting language for mobile app
        const latestFileVersionInfoApp: FileObject= await this.translationService.getLatestVersionInformation(id, "language_app");
        console.log("latest File verstion info" + latestFileVersionInfoApp.versionId);
        if(latestFileVersionInfoApp.versionId != appVersionId && latestFileVersionInfoApp.isLatest == true){
            const translation = await this.translationService.getTranslationUrl(id, "language_app");
            appLanguageObject = {
                "url": translation,
                "lang_id": id,
                "version_id": latestFileVersionInfoApp.versionId,
                "update_available": true
             }
        }else{
            appLanguageObject =  {
                "url": "",
                "lang_id": id,
                "version_id": latestFileVersionInfoApp.versionId,
                "update_available": false
             }
        }

        return res.status(HttpStatus.OK).send({
            "message": "Fetched Succesfully",
            "data": {
              "app_language": appLanguageObject,
              "backend_language": backendLanguageObject,
            }
           })
    }


    

    @Post()
    @UseInterceptors(FileInterceptor('fileData'))
    async uploadFile(
        @UploadedFile() file,
      @Body('languageId') languageId: string,
      @Body('type') type: string // app or backend

    ): Promise<any> {
        let paramNotFound:string = "";
        let folderName = "language";
        if(type == "app"){
            folderName = "language_app";
        }
        if(!file){
            paramNotFound = "fileData is required";

        }else if(!languageId){
            paramNotFound = "lanaugeId is required";
        }


        if(paramNotFound != ""){
            return paramNotFound;
        }

      return this.translationService.uploadFile(file.buffer, languageId, folderName);
    }

    @Get('getAllTranslation')
    async getAllTranslation(@Query('type') type: string) {
        let folderName = type == "app" ? "language_app" : "language";
        
        try {
            const dataList = [
               
            ];
            for (const i in availableLangIds) {
                const langId = availableLangIds[i];
                const translationFileUrl = await this.translationService.getTranslationUrl(langId, folderName);
                const languageName = this.translationService.getLanguageNameById(langId);
                const dataItem = {name: languageName, language_id: langId, fileUrl: translationFileUrl};
                dataList.push(dataItem);
            }
            console.log("dataList" + JSON.stringify(dataList));
            return dataList;
        } catch (error) {
            console.error('Error fetching translations:', error);
            throw new Error('Failed to fetch translations');
        }
    }

   
}
