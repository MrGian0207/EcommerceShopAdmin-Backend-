import registerRouter from './RegisterRouter';
import loginRouter from './LoginRouter';
import dashboardRouter from './DashboardRouter';
import refreshTokenRouter from './RefreshTokenRouter';
import logoutRouter from './LogoutRouter';

import { Express } from 'express';

function Route(app: Express) {
    app.use('/auth', registerRouter, loginRouter);

    app.use('/', dashboardRouter, refreshTokenRouter, logoutRouter);
}

export default Route;
