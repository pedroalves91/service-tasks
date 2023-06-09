import { Injectable } from '@nestjs/common';
import { props } from '../props';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Task } from '../../src/modules/tasks/models/task.model';

@Injectable()
export class MongoOrmOptions implements TypeOrmOptionsFactory {
    createTypeOrmOptions(): TypeOrmModuleOptions {
        const mongodb = props.mongo;
        const entities = [Task];

        return {
            type: 'mongodb',
            host: mongodb.host,
            port: parseInt(mongodb.port),
            database: mongodb.name,
            entities,
            synchronize: true,
        };
    }
}
