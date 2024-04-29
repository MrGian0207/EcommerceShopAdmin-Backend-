import registerRouter from './RegisterRouter';
import loginRouter from './LoginRouter';
import dashboardRouter from './DashboardRouter';
import refreshTokenRouter from './RefreshTokenRouter';
import logoutRouter from './LogoutRouter';
import mainCategoriesRouter from './MainCategoriesRouter';
import subCategoriesRouter from './SubCategoriesRouter';
import brandsRouter from './BrandsRouter';
import productRouter from './ProductRouter';
import ordersRouter from './OrdersRouter';
import usersRouter from './UsersRouter';
import newletterRouter from './NewletterRouter';
import slideRouter from './SlideRouter';
import settingsRouter from './SettingsRouter';
import googleRouter from './GoogleRouter';

import { Express } from 'express';

function Route(app: Express) {
  app.use('/', registerRouter);

  app.use('/', loginRouter);

  app.use('/', dashboardRouter);

  app.use('/', refreshTokenRouter);

  app.use('/', logoutRouter);

  app.use('/', mainCategoriesRouter);

  app.use('/', subCategoriesRouter);

  app.use('/', brandsRouter);

  app.use('/', productRouter);

  app.use('/', ordersRouter);

  app.use('/', usersRouter);

  app.use('/', newletterRouter);

  app.use('/', slideRouter);

  app.use('/', settingsRouter);

  app.use('/', googleRouter);
}
export default Route;
