import mongoose from 'mongoose'

function ConnectMongoDB() {
  mongoose
    .connect(process.env.MONGODB_URL as string)
    .then(() => {
      console.log('Connected to MongoDB successfully')
    })
    .catch((e) => {
      console.log(e)
      console.log('Failed to connect to MongoDB')
    })
}

export default ConnectMongoDB
