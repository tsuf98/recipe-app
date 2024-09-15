import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag } from './schemas/tag.schema';
import { Model } from 'mongoose';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private TagModel: Model<Tag>) {}

  findAll() {
    // the proper way of doing that is by either some sort of pagination, or auto complete,
    // because potentially I can get thousends of them and the mui controller in the ui will crash-
    // this is just an excercise with a small dataset, which need to be done pretty soon- so I left it raw.
    return this.TagModel.find({});
  }
}
