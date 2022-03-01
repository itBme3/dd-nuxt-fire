<template>
  <Card class="w-full overflow-visible"
      card-style="media-left">
      <template #media>
        <Media :media="doc" />
      </template>
      <MediaAttributes 
        :current="attributes"
        @update="updateAttributes"
      />
    </Card>
</template>

<script>
import { FireDb } from '~/utils/firebase'
import { objectsAreTheSame } from '~/utils/funcs'
import { blankAttributes, attributeKeys } from '~/models/media.model'

export default {
  props: {
    bulkAttributes: {
      type: Object,
      default: () => JSON.parse(JSON.stringify(blankAttributes))
    },
    doc: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      attributes: attributeKeys.reduce((acc, key) => {
        return {
          ...acc,
          [key]: Array.isArray(this.bulkAttributes[key]) 
            ? this.bulkAttributes[key] 
            : [] 
          }
      }, {}),
      db: new FireDb({$fire: this.$fire}),
      attributeKeys
    }
  },
  methods: {
    updateAttributes(value) {
      this.attributes = value;
      if(this.shouldUpdate()) { 
        this.db.updateAt(this.doc.docPath, value)
            .catch(err => alert(err))
      }
    },
    shouldUpdate() {
      const docAttributes = attributeKeys.reduce((acc, key) => {
        return {
        ...acc,
        [key]: Array.isArray(this.doc[key]) 
          ? this.doc[key] 
          : [] 
        }
      }, {});
      return objectsAreTheSame(docAttributes, this.attributes) === false;
    }
  }
}
</script>