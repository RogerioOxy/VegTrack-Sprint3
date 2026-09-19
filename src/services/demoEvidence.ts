import { Asset } from 'expo-asset';

// Foto de exemplo licenciada, sem alteração. Créditos em PhotoCredit e docs/CREDITOS.md.
export const demoPhotoAsset = Asset.fromModule(require('../../assets/evidence-demo.jpg'));
export const demoPhotoUri = demoPhotoAsset.uri;
