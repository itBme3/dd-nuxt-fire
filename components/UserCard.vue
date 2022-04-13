<template>
  <div v-if="userDoc.uid" 
    class="user-card max-w-sm mx-auto flex flex-wrap content-center">
    <div class="flex items-center content-start mx-auto mb-2">
      <Media 
        :media="{src: userDoc.avatar}"
        :is-background="true"
        class="w-16 h-16 rounded-full border-2 border-gray-300 shadow-xl" 
      />
      <div class="user-info ml-3">
        <h5>{{ userDoc.name }}</h5>
        <small class="block"><span class="opacity-40">email:</span> {{ userDoc.email }}</small>
        <small v-if="userDoc.phone && userDoc.phone.length"
           class="block"><span class="opacity-40">phone:</span> {{ userDoc.phone }}</small>
      </div>
    </div>
    <div v-if="accessDoc.uid" 
      class="user-access flex flex-wrap mx-auto">
      <gInputGroup
        class="p-4"
        label="Role:">
        <gRadioGroup 
          :value="userRole"
          :options="userRoles"
          name="user-role"
          :variant="userRole !== 'editor' ? 'wrap' : undefined"
          @input="(e) => userRole !== e ? userRole = e : ''"
        />
      </gInputGroup>
      <gInputGroup
        v-if="userRole === 'editor'"
        class="p-4"
        label="Access:">
        <gCheckboxGroup 
          :value="userAccess"
          name="user-access"
          :options="userAccessTypes"
          @input="(e) => userAccess.length !== e.length ? userAccess = e : ''"
        />
      </gInputGroup>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
import {debounce} from 'lodash'
  import {userRoles, userAccessTypes} from '~/models/users.model'
import { defaultAvatar } from '~/utils/users'
  export default Vue.extend({
    props: {
      docs: {
        type: Object,
        default: () => { return { user: {}, access: {} } }
      }
    },
    data() {
      return {
        userRoles,
      }
    },
    computed: {
      uid() {
        return this.docs?.user?.uid || null
      },
      userDoc() {
        const doc = this.docs?.user || {}
        if(!doc?.avatar?.length) {
          doc.avatar = defaultAvatar(doc.uid)
        }
        return this.docs?.user || {}
      },
      userAccessTypes() {
        return this.userAccess.length === userAccessTypes.length - 1
          ? userAccessTypes : userAccessTypes.filter(t => t !== 'users')
      },
      accessDoc: {
        get() {
          return this.docs?.access || {}
        },
        set: debounce(function (value) {
          this.$emit('accessDoc', value)
          this.$db.updateAt(`user_access/${this.uid}`, value)
              .catch(console.error)
        }, 200)
      },
      userRole: {
        get() {
          return this.accessDoc?.role || 'user'
        },
        set(role) {
          let access = JSON.parse(JSON.stringify(this.userAccess))
          if (role === 'user') {
            access = []
          } else if (role === 'admin') {
            access = this.userAccessTypes
          } else if (role === 'editor') {
            access = this.userAccess.filter(accessType => accessType !== 'users')
          }
          console.log({ role, access })
          this.accessDoc = {...this.accessDoc, role, access}
        }
      },
      userAccess: {
        get() {
          return this.accessDoc?.access || []
        },
        set(access) {
          let role = this.userRole;
          if (access?.length) {
            if (access.length === userAccessTypes.length && this.userRole !== 'admin') {
              role = 'admin'
            } else if (this.userRole !== 'editor') {
              role = 'editor'
            }
          } else if (this.userRole !== 'user') {
            role = 'user'
          }
          this.accessDoc = {...this.accessDoc, role, access}
        },

      }
    },
  })
</script>

<style scoped>

</style>