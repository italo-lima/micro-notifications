import { Injectable, Logger } from '@nestjs/common';
import { ClientProxySmartRanking } from './proxyrmq/client-proxy';
import { MailerService } from '@nestjs-modules/mailer';
import { RpcException } from '@nestjs/microservices';
import { IChallenge } from './interfaces/challenge.interface';
import { IPlayer } from './interfaces/player.interface';
import HTML_NOTIFICACAO_ADVERSARY from './static/html-notification-adversary';

@Injectable()
export class AppService {
  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking,
    private readonly mailService: MailerService,
  ) {}

  private readonly logger = new Logger(AppService.name);

  private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  async sendEmailForAdversary(challenge: IChallenge): Promise<void> {
    try {
      let idAdversary = '';

      challenge.players.map(player => {
        if (player != challenge.requester) {
          idAdversary = player;
        }
      });

      const adversary: IPlayer = await this.clientAdminBackend
        .send('get-players', idAdversary)
        .toPromise();

      const requester: IPlayer = await this.clientAdminBackend
        .send('get-players', challenge.requester)
        .toPromise();

      let markup = '';

      markup = HTML_NOTIFICACAO_ADVERSARY;
      markup = markup.replace(/#NOME_ADVERSARIO/g, adversary.name);
      markup = markup.replace(/#NOME_SOLICITANTE/g, requester.name);

      this.mailService
        .sendMail({
          to: adversary.email,
          from: `"SMART RANKING" <italolimaestudos@gmail.com>`,
          subject: 'Notificação de Desafio',
          html: markup,
        })
        .then(success => {
          this.logger.log(success);
        })
        .catch(err => {
          this.logger.error(err);
        });
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
