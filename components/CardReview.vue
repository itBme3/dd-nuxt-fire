<template>
  <Card class="card-review">
    <div class="stars flex content-start items-center">
      <Icon v-for="i in [1,2,3,4,5]"
        :key="item.id + '-' + i"
        :name="i <= item.score ? 'star-full' : 'star-o'"
        style="margin-left: .013em"
        :class="{
          'text-yellow-600 dark:text-yellow-400': i <= item.score,
          'text-gray-400 dark:text-gray-600': i > item.score,
        }"
      />
    </div>
    <h3 class="title">{{ item.title }}</h3>
    <p>{{ item.review }}</p>
  </Card>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => null
    }
  }
}
</script>