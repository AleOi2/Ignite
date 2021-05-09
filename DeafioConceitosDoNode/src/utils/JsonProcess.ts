import { promises as fs } from 'fs'

export const reWriteFile = (filename: string, data: object[]): void =>{
    fs.writeFile(filename, JSON.stringify(data));

}

export const readJsonFile = async (filename: string) =>{
    let result = await fs.readFile(filename, 'utf8');
    return JSON.parse(result);
}