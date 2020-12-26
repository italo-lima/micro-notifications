import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ProxyrmqModule,
    MailerModule.forRoot({
      transport: {
        host: 'email-smtp.us-east-1.amazonaws.com',
        port: 587,
        secure: false,
        tls: {
          ciphers: 'SSLv3',
        },
        auth: {
          user: 'AKIAQP2YWLUXWFVNZOSV',
          pass: 'BGpYvJgyY7k9yxYbuRgRiIljO+HIp4FT4qOEX4StUtff',
        },
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
