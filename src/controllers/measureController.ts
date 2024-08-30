import { Request, Response } from 'express';
import { UploadMeasure, uploadMeasureSchema } from '../schemas/uploadMeasureSchema';
import { ConfirmMeasure, confirmMeasureSchema } from '../schemas/confirmMeasureSchema';
import { GeminiService } from '../services/GeminiService';
import { ImageService } from '../services/ImageService';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

import Measure from '../../models/measure.model';
import Client from '../../models/client.model';




class MeasureController {
  private geminiService: GeminiService;
  private imageService: ImageService;

  constructor() {
    this.geminiService = new GeminiService();
    this.imageService = new ImageService();

    this.upload = this.upload.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  async upload(req: Request<{}, {}, UploadMeasure>, res: Response): Promise<Response> {
    const validation = uploadMeasureSchema.safeParse(req.body);

    // Se a validação falhar, retorne um erro
    if (!validation.success) {
      return res.status(400).json({
        "error_code": "INVALID_DATA",
        "error_description": validation.error.errors[0].code
      });
    }

    const { image, customer_code, measure_datetime, measure_type } = validation.data;

    let client = await Client.findOne({ where: { customer_code } });

    if (!client) {
      client = await Client.create({
        uuid: uuidv4(),
        customer_code,
      });
    }

    const startOfMonth = new Date(new Date(measure_datetime).getFullYear(), new Date(measure_datetime).getMonth(), 1);
    const endOfMonth = new Date(new Date(measure_datetime).getFullYear(), new Date(measure_datetime).getMonth() + 1, 0);

    const existingMeasure = await Measure.findOne({
      where: {
        idClient: client.id,
        type: measure_type.toLowerCase() as 'gas' | 'water',
        createdAt: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      },
    });

    if (existingMeasure) {
      return res.status(409).json({
        "error_code": "DOUBLE_REPORT",
        "error_description": "Leitura do mês já realizada"
      });
    }

    const image_url = await this.imageService.saveImageLocally(image);

    try {
      const measure_value = await this.geminiService.fetchGeminiData(image);
      if (!measure_value) throw 'Failed to fetch Gemini data';

      const measure_uuid = uuidv4();

      // Salvar no banco
      const measure = await Measure.create({
        uuid: measure_uuid,
        type: measure_type.toLowerCase() as 'gas' | 'water',
        value: measure_value,
        imageUrl: image_url,
        idClient: client.id,
        hasConfirmed: false,
      });

      return res.status(200).json({
        image_url,
        measure_value,
        measure_uuid,
      });

    } catch (error) {
      console.log('inicio');
      console.log(error);
      console.log('fim');
      return res.status(500).json({
        "error_code": "GEMINI_ERROR",
        "error_description": error
      });
    }
  }

  async confirm(req: Request<{}, {}, ConfirmMeasure>, res: Response): Promise<Response> {
    const validation = confirmMeasureSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        "error_code": "INVALID_DATA",
        "error_description": validation.error.errors[0].code
      });
    }

    const { measure_uuid, confirmed_value } = validation.data;

    const measure = await Measure.findOne({ where: { uuid: measure_uuid, value: confirmed_value } });

    if (!measure) {
      return res.status(404).json({
        "error_code": "MEASURE_NOT_FOUND",
        "error_description": "Leitura do mês já realizada" // Deveria ser: "Leitura do mês não encontrada"
      });
    }

    if (measure.hasConfirmed) {
      return res.status(409).json({
        "error_code": "MEASURE_ALREADY_CONFIRMED",
        "error_description": "Leitura do mês já realizada" // Deveria ser: "Leitura do mês já confirmada"
      });
    }

    measure.hasConfirmed = true;
    await measure.save();

    return res.status(200).json({
      success: true
    });
  }
}

export default MeasureController;