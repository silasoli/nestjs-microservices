import { Module } from '@nestjs/common';
import { ClientProxySmartRanking } from './client-proxy';

@Module({
  imports: [ClientProxySmartRanking],
  exports: [ClientProxySmartRanking],
})
export class ProxyRMQModule {}
