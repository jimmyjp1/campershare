import Head from 'next/head'
import { SimpleLayout } from '@/components/SimpleLayout'
import { WishlistPage } from '@/components/StorageComponents'

export default function Wishlist() {
  return (
    <>
            <Head>
        <title>CamperShare</title>
        <meta name="description" content="Ihre gespeicherten Wohnmobile" />
      </Head>
      <SimpleLayout
        title="My Wishlist"
        intro="Keep track of your favorite camper vans and easily find them later."
      >
        <WishlistPage />
      </SimpleLayout>
    </>
  )
}
