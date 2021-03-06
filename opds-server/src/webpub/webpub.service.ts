/*
 * File: webpub.service.ts
 * Project: VoiceAssistant
 * File Created: Monday, 4th February 2019 9:50:05 am
 * Author: pierre (p.leroux@gmx.com)
 * -----
 * Last Modified: Monday, 4th February 2019 10:08:40 am
 * Modified By: pierre (p.leroux@gmx.com>)
 * -----
 * Copyright 2019 - 2019 EDRLab.org
 * Use of this source code is governed by a BSD-style license
 */

import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { WEBPUB_MODEL_PROVIDER, NAME_SERVER } from '../constants';
import { IWebpub } from './interfaces/webpub.inteface';
import { WebpubDto } from './dto/webpub.dto';
import { plainToClass } from 'class-transformer';
import { JSON } from 'ta-json-x';

@Injectable()
export class WebpubService {
  constructor(
    @Inject(WEBPUB_MODEL_PROVIDER) private readonly webpubModel: Model<IWebpub>) {}

  async delete(title: string): Promise<void> {
    await this.webpubModel.deleteOne({ 'metadata.identifier': title }).exec();
  }

  async create(webpubDto: WebpubDto): Promise<IWebpub> {
    const created = new this.webpubModel(webpubDto);
    return await created.save();
  }

  async find(title: string): Promise<WebpubDto[]> {
    const manifest = await this.webpubModel.find({$text: {$search: title}}).lean().exec();
    if (manifest) {
      const object = plainToClass(WebpubDto, JSON.parse(JSON.stringify(manifest)));
      return JSON.serialize(object);
    }
    return [] as WebpubDto[];
  }

  async findLang(lang: string, numberOfItem: number = 5, sort: number = 1, page: number = 0): Promise<WebpubDto[]> {
    const manifest: IWebpub[] = await this.webpubModel.find({ 'metadata.language': lang })
    .sort({'metadata.dateModified': sort})
    .limit(numberOfItem)
    .skip(page * numberOfItem)
    .lean()
    .exec();
    if (manifest) {
      const object = plainToClass(WebpubDto, JSON.parse(JSON.stringify(manifest)));
      return JSON.serialize(object);
    }
    return [] as WebpubDto[];
  }

  async findCollection(collection: string, numberOfItem: number = 5, sort: number = 1, page: number = 0): Promise<WebpubDto[]> {
    const manifest: IWebpub[] = await this.webpubModel.find({ 'metadata.corpus': collection})
    .sort({'metadata.dateModified': sort})
    .limit(numberOfItem)
    .skip(page * numberOfItem)
    .lean()
    .exec();
    if (manifest) {
      const object = plainToClass(WebpubDto, JSON.parse(JSON.stringify(manifest)));
      return JSON.serialize(object);
    }
    return [] as WebpubDto[];
  }

  async findGenre(genre: string, numberOfItem: number = 5, sort: number = 1, page: number = 0): Promise<WebpubDto[]> {
    const manifest: IWebpub[] = await this.webpubModel.find({ 'metadata.genre': genre})
    .sort({'metadata.dateModified': sort})
    .limit(numberOfItem)
    .skip(page * numberOfItem)
    .lean()
    .exec();
    if (manifest) {
      const object = plainToClass(WebpubDto, JSON.parse(JSON.stringify(manifest)));
      return JSON.serialize(object);
    }
    return [] as WebpubDto[];
  }

  async findGroup(group: string, numberOfItem: number = 5, sort: number = 1, page: number = 0): Promise<WebpubDto[]> {
    const manifest: IWebpub[] = await this.webpubModel.find({})
    .sort({'metadata.dateModified': sort})
    .limit(numberOfItem)
    .skip(page * numberOfItem)
    .lean()
    .exec();
    if (manifest) {
      const object = plainToClass(WebpubDto, JSON.parse(JSON.stringify(manifest)));
      return JSON.serialize(object);
    }
    return [] as WebpubDto[];
  }

  async update(webpubDto: WebpubDto): Promise<void> {
    await this.webpubModel.updateOne({ 'metadata.identifier': webpubDto.metadata.identifier }, webpubDto).exec();
  }
}
