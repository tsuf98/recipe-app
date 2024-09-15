export class CreateUserDto {
  name: string;

  email: string;

  preferedTags?: string[];

  maxPreferedPreperationTimeMinutes?: number;
}
