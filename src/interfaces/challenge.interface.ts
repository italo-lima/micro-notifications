import { ChallengeStatus } from '../challenge-status.enum';

export interface IChallenge {
  dateHourChallenge: Date;
  status: ChallengeStatus;
  dateHourRequester: Date;
  dateHourResponse?: Date;
  requester: string;
  category: string;
  game?: string;
  players: string[];
}
