import { Express, Router } from 'express'

import brandsRouter from './BrandsRouter'
import dashboardRouter from './DashboardRouter'
import forgotPasswordRouter from './ForgotPasswordRouter'
import loginRouter from './LoginRouter'
import logoutRouter from './LogoutRouter'
import mainCategoriesRouter from './MainCategoriesRouter'
import newletterRouter from './NewletterRouter'
import ordersRouter from './OrdersRouter'
import productRouter from './ProductRouter'
import refreshTokenRouter from './RefreshTokenRouter'
import registerRouter from './RegisterRouter'
import settingsRouter from './SettingsRouter'
import slideRouter from './SlideRouter'
import subCategoriesRouter from './SubCategoriesRouter'
import usersRouter from './UsersRouter'

const indexRouter = Router()
indexRouter.get('/', (req, res) => {
  res.json({
    message: 'This is the Ecommerce shop backend',
  })
})

// ROUTE
function Route(app: Express) {
  app.use('/', indexRouter)

  app.use('/', registerRouter)

  app.use('/', loginRouter)

  app.use('/', forgotPasswordRouter)

  app.use('/', dashboardRouter)

  app.use('/', refreshTokenRouter)

  app.use('/', logoutRouter)

  app.use('/', mainCategoriesRouter)

  app.use('/', subCategoriesRouter)

  app.use('/', brandsRouter)

  app.use('/', productRouter)

  app.use('/', ordersRouter)

  app.use('/', usersRouter)

  app.use('/', newletterRouter)

  app.use('/', slideRouter)

  app.use('/', settingsRouter)
}

export default Route
