import { createHmac } from 'crypto'
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
indexRouter.post('/', (req, res) => {
  const PAYJP_WEBHOOK_SECRET = process.env.PAYJP_WEBHOOK_SECRET

  console.log({ PAYJP_WEBHOOK_SECRET })
  console.log(req)

  const signature = req.headers['payjp-signature']
  if (!signature) {
    console.error('Missing signature header')
    return res.status(400).send('Missing signature header')
  }

  if (!PAYJP_WEBHOOK_SECRET) {
    throw new Error('it has not webhook secret')
  }
  // Tạo HMAC để xác thực
  const body = req.body.toString() // req.body là Buffer vì sử dụng bodyParser.raw
  const hmac = createHmac('sha256', PAYJP_WEBHOOK_SECRET).update(body).digest('hex')

  if (hmac !== signature) {
    console.error('Invalid webhook signature')
    return res.status(403).send('Invalid signature')
  }

  let event
  try {
    event = JSON.parse(body)
  } catch (err) {
    console.error('Error parsing webhook body:', err)
    return res.status(400).send('Invalid JSON')
  }

  console.log('Webhook received:', event)

  switch (event.type) {
    case 'charge.succeeded':
      console.log('Charge succeeded:', event.data)
      break
    case 'customer.created':
      console.log('Customer created:', event.data)
      break
    default:
      console.log('Unhandled event type:', event.type)
  }

  // Trả về HTTP 200 để xác nhận webhook đã được xử lý
  res.status(200).send('Webhook handled successfully')
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
