<template>
  <div class="editor">
    <div v-if="editor"
      class="toolbar flex flex-wrap space-x-1">
      <gDropdown :classes="{ dropdown: 'w-28' }">
        <div
          class="dropdown-trigger"
          slot="trigger"
          slot-scope="{ mousedownHandler, focusHandler, blurHandler, keydownHandler }">
          <gButton
            id="text-tag"
            aria-label="Select text tag menu"
            aria-haspopup="true"
            @mousedown="mousedownHandler"
            @focus="focusHandler"
            @blur="blurHandler"
            @keydown="keydownHandler"
          >
            <Icon :name="'text'" />
          </gButton>
        </div>
        <div class="dropdown-buttons" slot-scope="{ hide }">
          <gButton role="menuitem" @click="(e) => { 
              hide(e); editor.chain().focus().toggleHeading({ level: 1 }).run()
            }" 
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
            h1
          </gButton>
          <gButton role="menuitem" @click="(e) => { 
              hide(e); editor.chain().focus().toggleHeading({ level: 2 }).run()
            }" 
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
            h2
          </gButton>
          <gButton role="menuitem" @click="(e) => { 
              hide(e); editor.chain().focus().toggleHeading({ level: 3 }).run()
            }" 
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
            h3
          </gButton>
          <gButton role="menuitem" @click="(e) => { 
              hide(e); editor.chain().focus().toggleHeading({ level: 4 }).run()
            }" 
            :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
            h4
          </gButton>
          <gButton role="menuitem" @click="(e) => { 
              hide(e); editor.chain().focus().toggleHeading({ level: 5 }).run()
            }" 
            :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
            h5
          </gButton>
          <gButton role="menuitem" @click="(e) => { 
              hide(e); editor.chain().focus().toggleHeading({ level: 6 }).run()
            }" 
            :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
            h6
          </gButton>
          <gButton role="menuitem" @click="(e) => { 
              hide(e); editor.chain().focus().setParagraph().run()
            }"
            :class="{ 'is-active': editor.isActive('paragraph') }">
            p
          </gButton>
        </div>
      </gDropdown>
      <gDropdown :classes="{ dropdown: 'w-18' }">
        <div
          class="dropdown-trigger"
          slot="trigger"
          slot-scope="{ mousedownHandler, focusHandler, blurHandler, keydownHandler }"
          v-tooltip="'Text Align'"
          >
          <gButton
            id="text-align"
            aria-label="Select text align menu"
            aria-haspopup="true"
            @mousedown="mousedownHandler"
            @focus="focusHandler"
            @blur="blurHandler"
            @keydown="keydownHandler"
          >
            <Icon :name="'text-align-left'" />
          </gButton>
        </div>
        <div class="dropdown-buttons" slot-scope="{ hide }">
          <gButton
            @click="(e) => {
              hide(e);
              editor.chain().focus().setTextAlign('left').run()
            }"
            :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
            <Icon :name="'text-align-left'" />
          </gButton>
          <gButton
            @click="(e) => {
              hide(e);
              editor.chain().focus().setTextAlign('center').run()
            }"
            :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">
            <Icon :name="'text-align-center'" />
          </gButton>
          <gButton
            @click="(e) => {
              hide(e);
              editor.chain().focus().setTextAlign('right').run()
            }"
            :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">
            <Icon :name="'text-align-right'" />
          </gButton>
        </div>
      </gDropdown>
      <gButton 
        v-tooltip="'Bold'"
        @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        <Icon :name="'bold'" />
      </gButton>
      <gButton 
        v-tooltip="'Italic'"
        @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        <Icon :name="'italic'" />
      </gButton>
      <gButton 
        v-tooltip="'Strikethrough'"
        @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
        <Icon :name="'strikethrough'" />
      </gButton>
      <gButton 
        v-tooltip="'Link'"
        @click="setLink" :class="{ 'is-active': editor.isActive('link') }">
        <Icon :name="'link'" />
      </gButton>
      <gButton v-if="editor.isActive('link')" 
        v-tooltip="'Remove Link'"
        @click="editor.chain().focus().unsetLink().run()">
        <Icon :name="'remove-link'" />
      </gButton>
      <gButton 
        v-tooltip="'List'"
        @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
        <Icon :name="'list'" />
      </gButton>
      <gButton 
        v-tooltip="'Numbered List'"
        @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
        <Icon :name="'ordered-list'" />
      </gButton>
      <gButton 
        v-tooltip="'Insert Image'"
        @click="selectingImage = true">
        <Icon :name="'image'" />
      </gButton>
      <input
        v-tooltip="'Text Color'"
        type="color"
        class="rounded bg-gray-800 h-8"
        @input="editor.chain().focus().setColor($event.target.value).run()"
        :value="editor.getAttributes('textStyle').color"
      />
      <gButton 
        v-if="!!editor.getAttributes('textStyle').color"
        v-tooltip="'Remove Color'"
        @click="editor.chain().focus().unsetColor().run()">
        <Icon name="remove-color" />
      </gButton>
      <input
        v-tooltip="'Highlight Color'"
        type="color"
        class="rounded bg-gray-800 h-8"
        @input="editor.chain().focus().setHighlight({color: $event.target.value}).run()"
        :value="editor.getAttributes('highlight').color"
      />
      <gButton 
        v-if="editor.isActive('highlight')"
        v-tooltip="'Remove Highlight'"
        @click="editor.chain().focus().unsetHighlight().run()">
        <Icon name="remove-color" />
      </gButton>
      <gButton 
        v-tooltip="'Blockquote'"
        @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
        <Icon :name="'quote'" />
      </gButton>
      <gButton 
        v-tooltip="'Horizontal Rule'"
        @click="editor.chain().focus().setHorizontalRule().run()">
        <Icon :name="'line'" />
      </gButton>
      <gButton 
        v-tooltip="'Clear Formatting'"
        @click="editor.chain().focus().unsetAllMarks().run(); editor.chain().focus().clearNodes().run()">
        <Icon name="clear-formatting" />
      </gButton>
      <gButton 
        v-tooltip="'Undo'"
        @click="editor.chain().focus().undo().run()">
        <Icon :name="'undo'" />
      </gButton>
      <gButton 
        v-tooltip="'Redo'"
        @click="editor.chain().focus().redo().run()">
        <Icon :name="'redo'" />
      </gButton>
      <gButton 
        v-tooltip="'Source'"
        @click="editingSrc = !editingSrc">
        <Icon :name="'code'" />
      </gButton>
      <!-- <gButton @click="editor.chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">
        code
      </gButton> -->
      <!-- <gButton @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
        code block
      </gButton> -->
      <!-- <gButton @click="editor.chain().focus().setHardBreak().run()">
        hard break
      </gButton> -->
    </div>
    <editor-content 
      v-if="!editingSrc"
      class="content-editor"
      :editor="editor" />
    <gTextarea 
      v-else
      class="content-editor source-edit"
      v-model="value" />
    <ModalSelectAlgolia
      index-name="media"
      :show="selectingImage"
      :multiple="false"
      :selecting="{
        identifier: `objectID`,
        hideSideNav: true
      }"
      @submit="(e) => {addImage(e); selectingImage = false}"
    />
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'


export default {
  components: {
    EditorContent
  },
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: null,
      value: this.content,
      editingSrc: false,
      selectingImage: false
    }
  },
  watch: {
    content(value) {
      this.value = value;
      const isSame = this.editor.getHTML() === value
      if (isSame) { return }
      this.editor.commands.setContent(value, false)
    },
    value(value) {
      const isSame = this.editor.getHTML() === value
      if (isSame) { return }
      this.$emit('update', value)
      this.editor.commands.setContent(value, false)
    }
  },

  mounted() {
    this.editor = new Editor({
      content: this.content,
      extensions: [
        StarterKit,
        Dropcursor,
        Highlight.configure({
          multicolor: true,
        }),
        Image,
        Color.configure({
          types: ['textStyle'],
        }),
        TextStyle,
        Link.configure({
          openOnClick: false,
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
          alignments: ['left', 'center', 'right'],
        })
      ],
      onUpdate: () => {
        this.$emit('update', this.editor.getHTML())
      },
    })
  },

  beforeDestroy() {
    this.editor.destroy()
  },

  methods: {
    setLink() {
      const previousUrl = this.editor.getAttributes('link').href
      const url = window.prompt('URL', previousUrl)
      if (url === null) { return }
      if (url === '') {
        this.editor.chain().focus().extendMarkRange('link').unsetLink().run()
        return
      }
      this.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    },
    addImage(media) {
      console.log({media})
      if(!media?.downloadUrl && !media?.thumbs) { return };
      const largestThumbKey = !media?.thumbs || !Object.keys(media.thumbs).length 
        ? null
        : Object.keys(media.thumbs).map(k => parseInt(k)).reduce((largest, size) => {
          return largest < size ? size : largest
        }, 0);
      const url = largestThumbKey > 0 ? media.thumbs[`${largestThumbKey}`] : media.downloadUrl;
      if (url) {
        this.editor.chain().focus().setImage({ src: url }).run()
      }
    }
  },
}
</script>
<style lang="scss">
.content-editor {
  @apply bg-white rounded min-h-[300px] text-gray-900 shadow-md;
  > .ProseMirror {
    @apply min-h-[300px] focus:outline-none focus:ring-0 p-2;
    > * + * {
      margin-top: 0.75em;
    }
    img {
      max-width: 100%;
      height: auto;
      &.ProseMirror-selectednode {
        @apply ring-4 ring-blue-500;
      }
    }
    &.ProseMirror-focused {
      @apply outline-none ring-0;
    }
  }
}
</style>
<style lang="scss" scoped>
  .button {
    @apply mb-1 hover:text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-50;
    &.is-active {
      @apply text-gray-800 bg-gray-200 dark:bg-gray-700 dark:text-gray-50;
    }
  }
  .dropdown-trigger {
    @apply h-full;
  }
  .toolbar {
    > .button, .dropdown-trigger > .button {
      @apply h-8;
      .gicon {
        @apply m-auto;
      }
    }
  }
  .dropdown {
    .button {
      @apply w-full;
    }
  }
</style>