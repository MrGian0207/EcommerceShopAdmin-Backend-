export interface Product {
  _id?: string
  name?: string
  title?: string
  slug?: string
  description?: string
  category?: string
  subCategory?: string
  brand?: string
  gender?: string
  status?: string
  productCode?: string
  tags?: string
  featureProduct?: string
  defaultVariant?: string
  variants?: Variant[]
}

export interface Variant {
  variantID: string
  variantName: string
  variantSize: string
  variantColor: string
  variantProductSKU: string
  variantQuantity: number
  variantRegularPrice: string
  variantSalePrice: string
  variantImages?: string[]
  product: Product
}

export interface productPayload {
  name: string
  title: string
  slug: string
  description: string
  category: string
  subCategory: string
  brand: string
  gender: string
  status: string
  productCode: string
  tags: string[]
  featureProduct: string
  defaultVariant: string
  variants: [
    {
      variantID: string
      variantName: string
      variantSize: string
      variantColor: string
      variantProductSKU: string
      variantQuantity: string
      variantRegularPrice: string
      variantSalePrice: string
      numberOfImages: number
    },
  ]
}
