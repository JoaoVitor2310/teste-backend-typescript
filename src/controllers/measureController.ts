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
      if (!measure_value) throw 'Error 500 from Gemini, try again later (eu garanto que está funcionando, mas a API do GEMINI me retorna esse erro sem nenhum detalhe as vezes, espera uns 5 min e tenta de novo :/))';

      const measure_uuid = uuidv4();

      const measureDatetime = new Date(measure_datetime);

      const measure = await Measure.create({
        uuid: measure_uuid,
        type: measure_type.toLowerCase() as 'gas' | 'water',
        value: measure_value,
        imageUrl: image_url,
        idClient: client.id,
        hasConfirmed: false,
        measure_datetime: measureDatetime
      });

      return res.status(200).json({
        image_url,
        measure_value,
        measure_uuid,
      });

    } catch (error) {
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
        "error_code": "CONFIRMATION_DUPLICATE",
        "error_description": "Leitura do mês já realizada" // Deveria ser: "Leitura do mês já confirmada"
      });
    }

    measure.hasConfirmed = true;
    await measure.save();

    return res.status(200).json({
      success: true
    });
  }

  async list(req: Request, res: Response): Promise<Response> {

    const { customer_code } = req.params;
    const { measure_type } = req.query;

    const client = await Client.findOne({ where: { customer_code } });

    if (!client) {
      return res.status(404).json({
        error_code: "MEASURES_NOT_FOUND",
        error_description: `Nenhuma leitura encontrada`
      });
    }

    let filter: any = { where: { idClient: client.id } };

    if (measure_type) {
      const type = String(measure_type).toUpperCase(); // Converte para maiúsculas para case insensitive
      if (type === 'WATER' || type === 'GAS') {
        filter.where.type = type; // Filtra pelo tipo específico
      } else {
        return res.status(400).json({
          error_code: "INVALID_TYPE",
          error_description: `Tipo de medição não permitida`
        });
      }
    }

    const measures = await Measure.findAll(filter);

    if (measures.length === 0) {
      return res.status(404).json({
        error_code: "MEASURES_NOT_FOUND",
        error_description: `Nenhuma leitura encontrada`
      });
    }

    const transformedMeasures = measures.map((measure: any) => ({
      measure_uuid: measure.uuid,
      measure_datetime: measure.measure_datetime,
      measure_type: measure.type,
      has_confirmed: measure.hasConfirmed,
      image_url: measure.imageUrl
    }));

    return res.status(200).json({
      customer_code,
      measures: transformedMeasures
    });
  }
}

export default MeasureController;