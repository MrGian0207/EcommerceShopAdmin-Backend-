export interface Product {
   _id?: string;
   name?: string;
   title?: string;
   slug?: string;
   description?: string;
   category?: string;
   subCategory?: string;
   brand?: string;
   gender?: string;
   status?: string;
   productCode?: string;
   tag?: string;
   featureProduct?: string;
   defaultVariant?: string;
   variants?: Variant[];
}

export interface Variant {
   variantName?: string;
   variantSize?: string;
   variantColor?: string;
   variantProductSKU?: string;
   variantQuantity?: string;
   variantRegularPrice?: string;
   variantSalePrice?: string;
   variantImagesFile?: string[];
   product?: Product;
}
