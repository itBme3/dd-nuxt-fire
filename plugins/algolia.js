import {algoliaSearchClient} from '~/utils/algolia'

export default function (context, inject) {
      console.log({ context })
      inject('algolia', algoliaSearchClient)
}