import axios from 'axios';
import https from 'https';


export async function getSampleImportFileApi(bearerToken: string): Promise<FileDataAsString> {

  const baseUrl = process.env.REACT_APP_API_URL;

  const endpoint = `/api/v1/document/sample-import-file`;

  const response = await axios.get(baseUrl + endpoint, { timeout: 60000, headers: { 'Authorization': `Bearer ${bearerToken}` } });

  return response.data as FileDataAsString;



export interface FileDataAsString {

    name: string,

    mimeType: string,

    data: string,

    ext?: string

}



export async function importMembersApi(bearerToken: string, orgSeasonId: string, importData: ImportCommand): Promise<ImportResult> {

  const baseUrl = process.env.REACT_APP_API_URL;

  const endpoint = `/api/v1/orgSeason/${orgSeasonId}/import`;

  const response = await axios.post(baseUrl + endpoint, importData, { timeout: 60000, headers: { 'Authorization': `Bearer ${bearerToken}` } });

  return response.data as ImportResult;



export interface ImportCommand {

    csv: string,

    usePreviousProfiles?: boolean

}



export function convertBlobToBase64Url(file: Blob){

    return new Promise((resolve, reject) => {

        const fileReader = new FileReader();

        fileReader.readAsDataURL(file)

        fileReader.onload = () => {

            resolve(fileReader.result);

        }

        fileReader.onerror = (error) => {

            reject(error);

        }

    })

}




export function downloadBase64AsFile(data: string, filename: string){

    const downloadLink = document.createElement("a");

    downloadLink.href = data;

    downloadLink.download = filename;




    document.body.appendChild(downloadLink);

    downloadLink.click();

    document.body.removeChild(downloadLink);

}




export function  downloadStringAsFile(data: string, filename: string){

    const downloadLink = document.createElement("a");

    const file = new Blob([data], { type: 'text/plain' });

    downloadLink.href = URL.createObjectURL(file);;

    downloadLink.download = filename;




    document.body.appendChild(downloadLink);

    downloadLink.click();

    document.body.removeChild(downloadLink);

}







  const onFileSelected = async ({ target }: any) => {




    try {

      const thisFile = target.files[0] as File;

      setDataFile(thisFile);

      setPageState('fileSelected');

      setOpenDialog(true);

      target.value = null;

    }

    catch (error: any) {

      console.log(error);

    }




  }



    if (dataFile) {

      const fileAsString = await convertBlobToBase64Url(dataFile) as string;

      props.onChange(fileAsString, dataFile.name, dataFile.type, dataFile.size, documentType);

    }