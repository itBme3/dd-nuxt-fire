import {algoliaSearchClient} from '~/utils/algolia'

export default function (context, inject) {
      inject('algolia', algoliaSearchClient)
}