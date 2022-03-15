import {FireDb} from '~/utils/firebase'

export default function (context, inject) {
      inject('db', new FireDb({$fire: context.$fire}))
}