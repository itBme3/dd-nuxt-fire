<template>
    <Card 
      class="user-active p-6 hover:scale-100"
      :class="{
        'cursor-pointer !p-0 m-auto': inNav
      }"
      :card-style="cardStyle"
      :clickable="false"
      :classes="cardClasses"
      @click="(e) => $emit('click', e)">
      <template v-if="userImage && show.includes('image')" #media>
        <Media 
          :media="userImage"
          :is-background="true"
          :class="{
            'w-8 h-8': inNav,
            'w-16 h-16': !inNav,
          }"
          class="rounded-full border-2 border-gray-300 shadow-xl" 
        />
      </template>

      <!-- <h4 v-if="!inNav">{{ userName }}</h4> -->
      <gInput 
        v-if="!inNav && show.includes('name') && userName"
        v-model="userName"
        :style="{
          'max-width': 'calc(' + userName.length + 'ch * 2)'
        }"
      />

        <Transition name="down-fade">
          <small
            v-if="show.includes('email') && userEmail"
            class="block mb-3">
            <span class="text-gray-600 block">email:</span> {{ userEmail }}
          </small>
        </Transition>

        <Transition name="down-fade">
            <template v-if="show.includes('logout')">
              <Btn 
                @click="logout">logout</Btn>
            </template>
        </Transition>

    </Card>
</template>

<script>
  import Vue from 'vue'

  export default Vue.extend({
    props: {
      inNav: {
        type: Boolean,
        default: false
      },
      collapsed: {
        type: Boolean,
        default: false
      },
      cardClasses: {
        type: Object,
        default: () => {
          return {
            content: 'flex flex-col sm:flex-row flex-wrap w-full',
            media: '!w-auto'
          }
        }
      },
      cardStyle: {
        type: String,
        default: 'media-above'
      },
      show: {
        type: Array,
        default: () => ['image','name','email','logout']
      }
    },
    data() {
      return {
        editing: false
      }
    },
    computed: {
      user() {
        return this.$store?.state?.auth?.user?.doc || null
      },
      userName: {
        get() {
          return this.$store?.state?.auth?.user?.doc?.name || null
        },
        set(val) {
          this.$store.dispatch('auth/updateUserName', val)
            .catch(console.error)
        }
      },
      userEmail() {
        return this.$store?.state?.auth?.user?.email || null
      },
      userImage() {
        return this.$store?.state?.auth?.user?.doc?.avatar?.length
          ? { src: this.$store.state.auth.user.doc.avatar }
          : null
      }
    },
    methods: {
      async logout() {
        try {
          await this.$fire.auth.signOut()
          window.location.href = '/login'
        } catch (e) {
          alert(e)
        }
      },
    }
  })
</script>

<style lang="scss">
.user-active {
	input {
		&:not(:hover):not(:focus) {
			background-color: transparent !important;
			border-color: transparent !important;
      padding-left: 0 !important;
		}
	}
}
.site-nav {
  .user-active {
    .card-inner {
      @apply items-start #{!important};
    }
  }
}
</style>