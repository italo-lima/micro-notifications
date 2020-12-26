import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { IChallenge } from './interfaces/challenge.interface';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';

const ackErrors: string[] = ['E11000'];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @EventPattern('notification-new-challenge')
  async sendEmailAdversary(
    @Payload() challenge: IChallenge,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      this.logger.log(`challenge: ${JSON.stringify(challenge)}`);
      await this.appService.sendEmailForAdversary(challenge);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter(ackError =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }
}
