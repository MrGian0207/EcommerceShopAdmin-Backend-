import registerRouter from './RegisterRouter';
import loginRouter from './LoginRouter';
import dashboardRouter from './DashboardRouter';
import refreshTokenRouter from './RefreshTokenRouter';
import logoutRouter from './LogoutRouter';
import mainCategoriesRouter from './MainCategoriesRouter';
import subCategoriesRouter from './SubCategoriesRouter';
import brandsRouter from './BrandsRouter';
import productRouter from './ProductRouter';

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
}
export default Route;
