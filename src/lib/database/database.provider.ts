import { User } from 'src/modules/v1/user/user.entity';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'ep-silent-term-a1o61k6h.ap-southeast-1.aws.neon.tech',
        port: 5432,
        username: 'emr_owner',
        password: 'fmBoqlK3ch2e',
        database: 'emr',
        entities: [
            // __dirname + '../../modules/**/**/*.entity{.ts,.js}',
            User
        ],
        ssl:true
        // synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];