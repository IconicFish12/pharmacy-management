export class CreateActivityLogDto {
  action: string;
  userId: string;
  resourceType: string;
  resourceId: string;
  payloadData: Record<string, any>;
}
