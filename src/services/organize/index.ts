import { OrganizePort } from './port';
import { mockOrganizeService } from './mock';
// import { firestoreOrganizeService } from './real'; // 後で作成

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export const organizeService: OrganizePort = USE_MOCKS 
  ? mockOrganizeService 
  : mockOrganizeService; // 実装ができるまでは両方mockにしておく