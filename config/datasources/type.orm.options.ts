import { Injectable } from '@nestjs/common';
import { getMetadataArgsStorage } from 'typeorm';
import { props } from '../props';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmOptions implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const database = props.database;
    const entities = getMetadataArgsStorage().tables.map((tbl) => tbl.target);

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
