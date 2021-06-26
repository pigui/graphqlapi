import { Module } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Module({
  imports: [GqlAuthGuard],
  exports: [GqlAuthGuard],
})
export class CoreModule {}
