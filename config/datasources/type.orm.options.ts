import { Injectable } from '@nestjs/common';
import { props } from '../props';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { User } from '../../src/modules/auth/models/user.model';

@Injectable()
export class TypeOrmOptions implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const database = props.database;
    const entities = [User];

    return {
      type: 'mysql',
      host: database.host,
      port: parseInt(database.port),
      username: database.user,
      password: database.password,
      database: database.name,
      entities,
      synchronize: true,
    };
  }
}
