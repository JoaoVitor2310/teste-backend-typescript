import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class ImageService {
    async saveImageLocally(base64Image: string): Promise<string> {
        // Gerar um UUID para o nome da imagem
        const imageId = uuidv4();
        const imagePath = path.join(__dirname, '..', 'uploads', `${imageId}.png`);
        
        // Criar o buffer a partir da string base64
        const buffer = Buffer.from(base64Image, 'base64');
        
        // Salvar a imagem na pasta local
        fs.writeFileSync(imagePath, buffer);

        // Retornar o caminho da imagem para poder usá-lo
        return imagePath;
    }
}
