import { Product } from './product.model'
import { User, roles } from '../user/user.model'
import { AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}
//keys in the query object below have to be the same as the keys in the query object in product.gql
//have to also create mutation resolvers. Create a new product or udate based on id.

const products = () => {
  return Product.find({})
    .lean()
    .exec()
}

const product = (_, args, ctx) => {
  if (!ctx.user) throw new AuthenticationError()

  return Product.findById(args.id)
    .lean()
    .exec()
}

const newProduct = (_, args, ctx) => {
  if (!ctx.user) throw new AuthenticationError()

  return Product.create({ ...args.input, createdBy: ctx.user._id })
}

const updateProduct = (_, args, ctx) => {
  if (!ctx.user) throw new AuthenticationError()

  const update = args.input

  //passing in true means that the return vaue of the query is the product
  //after it was updated not before (which is the default).
  return Product.findByIdAndUpdate(args.id, update, { new: true })
    .lean()
    .exec()
}

const removeProduct = (_, args, ctx) => {
  if (!ctx.user) throw new AuthenticationError()

  return Product.findByIdAndRemove(args.id)
    .lean()
    .exec()
}

export default {
  Query: {
    products,
    product
  },
  Mutation: {
    newProduct,
    updateProduct,
    removeProduct
  },
  Product: {
    __resolveType(product) {},
    createdBy(product) {
      return User.findById(product.createdBy)
        .lean()
        .exec()
    }
  }
}
