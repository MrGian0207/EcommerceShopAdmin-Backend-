import SettingsController from '../admin/controllers/Settings/SettingsController';
import { Router } from 'express';

const settingsController = new SettingsController();
const settingsRouter = Router();

settingsRouter.get('/settings', settingsController.getUser);
settingsRouter.post('/settings', settingsController.addUserWithRole);
settingsRouter.put(
  '/settings/update-password',
  settingsController.changePassword,
);

export default settingsRouter;
