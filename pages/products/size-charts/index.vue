<template>
  <div class="product-size-charts max-w-lg mx-auto">
    <Title>Size Charts:</Title>

    <div class="charts flex flex-col gap-3">
      <template v-for="doc in docs">
        <nuxt-link 
          :key="doc.docId"
          :to="'/products/size-charts/' + doc.docId ">
          <Card
            card-style="media-left">
            <template #media>
              <gButton
                class="w-28 h-28 flex items-center content-center"
                :class="{'p-0': doc.image && doc.image.length}">
                <Media
                  v-if="doc.image && doc.image.length > 0"
                  :media="{downloadUrl: doc.image}"
                />
                <Icon v-else name="image" class="m-auto" />
              </gButton>
            </template>
            <h6>{{ doc.chart }}</h6>
          </Card>
        </nuxt-link>
      </template>
    </div>

    <template v-if="fetching === false && canLoadMore">
      <div v-view="nextPage">
        <Btn class="text-xs border-1 border-gray-400 border-opacity-20 bg-transparent"
          @click="nextPage" >
          Get Next Page
        </Btn>
      </div>
    </template>
  </div>
</template>

<script>

import _ from 'lodash'

export default {
  
  data() {
    const startAfterDefaults = {
      asc: -1,
      desc: new Date().getTime() + 1000 * 10,
    };
    const orderBy = [ 'updated_at', 'desc' ];
    return {
      startAfterDefaults,
      canLoadMore: false,
      fetching: false,
      orderBy,
      startAfter: startAfterDefaults[orderBy[1].toLowerCase()],
      docs: []
    }
  },
  mounted() {
    return this.getDocs().then(res => {
      this.docs = Array.isArray(res) ? res : null
    }).catch(err => alert(err))
  },
  methods: {
    nextPage: _.debounce(function () {
      if (this.canLoadMore && !!this.docs?.length) {
        const startAfter = this.docs[this.docs.length - 1][this.orderBy[0]];
        return this.getDocs({append:true, startAfter})
          .catch(err => console.error(err))
      }
    }, 500),
    async getDocs(params = {}) {
      const { append = false, startAfter = this.startAfterDefaults[this.orderBy[1].toLowerCase()] } = params === undefined ? {} : params
      // const { startAfter = this.orderBy[1] === 'desc' ? (new Date().getTime() * 10) : -1 } = params; 
      const limit = 10;
      const docs = await this.$db.collection(
        'size_charts', 
        ref => ref
          .orderBy(this.orderBy[0], this.orderBy[1])
          .limit(limit)
          .startAfter(startAfter)
      ).catch(err => alert(err));
      this.canLoadMore = docs?.length === limit
      if (!Array.isArray(docs)) { 
        this.docs = null;
        return console.error('batch: ', docs)
      }
      this.docs = append ? [...this.docs, ...docs] : docs;
      return this.docs
    }
  }
}
</script>