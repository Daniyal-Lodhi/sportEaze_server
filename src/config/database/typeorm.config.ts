import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envFilePath } from '../env.config';
import { SharedPost } from 'src/modules/user/user-posts/entities/shared-post.entity';
import { PostMedia } from 'src/modules/user/user-posts/entities/post-media.entity';
import { PostLikes } from 'src/modules/user/user-posts/entities/post-like.entity';



ConfigModule.forRoot({
    isGlobal: true,  
    envFilePath: envFilePath, 
});

const configService = new ConfigService();

const dataSourceOptions = {
    type: 'postgres', // explicitly typed as 'postgres'
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'), 
    database: configService.get('POSTGRES_DB'), 
    schema: configService.get('POSTGRES_SCHEMA'),
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'], 
    synchronize: false,
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    migrationsTableName: configService.get('POSTGRES_MIGRATION_TBL_NAME'),
};
const dataSource = new DataSource(dataSourceOptions as DataSourceOptions);


export default dataSource;
export { dataSourceOptions }
