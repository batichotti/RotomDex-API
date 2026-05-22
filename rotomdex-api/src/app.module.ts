import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PokemonModule } from './pokemon/pokemon.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MovesModule } from './moves/moves.module';
import { AbilitiesModule } from './abilities/abilities.module';
import { PokemonMovesModule } from './pokemon-moves/pokemon-moves.module';
import { PokemonAbilitiesModule } from './pokemon-abilities/pokemon-abilities.module';
import { ItemsModule } from './items/items.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: parseInt(config.get<string>('DATABASE_PORT') || '5432'),
        username: config.get<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: false, // só em produção
      }),
    }),

    PokemonModule,

    MovesModule,

    AbilitiesModule,

    PokemonMovesModule,

    PokemonAbilitiesModule,

    ItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}