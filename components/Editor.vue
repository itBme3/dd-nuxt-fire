<template>
  <div class="editor"
    :class="{
      'focused': (editorFocused || toolbarHovered) && !alwaysShowToolbar
    }"
    @mouseleave="toolbarHovered = false"
  >

    <div v-if="editor"
      class="toolbar flex flex-wrap space-x-1"
      :class="{
        'hidden': !editorFocused && editorBlurred && !toolbarHovered && !alwaysShowToolbar
      }"
      @mouseenter="toolbarHovered = true"
      >
      
      <gDropdown :classes="{ dropdown: 'w-28' }">
        <div
          slot="trigger"
          slot-scope="{ mousedownHandler, focusHandler, blurHandler, keydownHandler }"
          class="dropdown-trigger">
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
        <div slot-scope="{ hide }" class="dropdown-buttons">
          <gButton role="menuitem" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }" 
            @click="(e) => { 
              hide(e); editor.chain().focus().toggleHeading({ level: 1 }).run()
            }">
            h1
          </gButton>
          <gButton role="menuitem" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" 
            @click="(e) => { 
              hide(e); editor.chain().focus().toggleHeading({ level: 2 }).run()
            }">
            h2
          </gButton>
          <gButton role="menuitem" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }" 
            @click="(e) => { 
              hide(e); editor.chain().focus().toggleHeading({ level: 3 }).run()
            }">
            h3
          </gButton>
          <gButton role="menuitem" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }" 
            @click="(e) => { 
              hide(e); editor.chain().focus().toggleHeading({ level: 4 }).run()
            }">
            h4
          </gButton>
          <gButton role="menuitem" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }" 
            @click="(e) => { 
              hide(e); editor.chain().focus().toggleHeading({ level: 5 }).run()
            }">
            h5
          </gButton>
          <gButton role="menuitem" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }" 
            @click="(e) => { 
              hide(e); editor.chain().focus().toggleHeading({ level: 6 }).run()
            }">
            h6
          </gButton>
          <gButton role="menuitem" :class="{ 'is-active': editor.isActive('paragraph') }"
            @click="(e) => { 
              hide(e); editor.chain().focus().setParagraph().run()
            }">
            p
          </gButton>
        </div>
      </gDropdown>
      <gDropdown :classes="{ dropdown: 'w-18' }">
        <div
          slot="trigger"
          slot-scope="{ mousedownHandler, focusHandler, blurHandler, keydownHandler }"
          v-tooltip="'Text Align'"
          class="dropdown-trigger"
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
        <div slot-scope="{ hide }" class="dropdown-buttons">
          <gButton
            :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
            @click="(e) => {
              hide(e);
              editor.chain().focus().setTextAlign('left').run()
            }">
            <Icon :name="'text-align-left'" />
          </gButton>
          <gButton
            :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
            @click="(e) => {
              hide(e);
              editor.chain().focus().setTextAlign('center').run()
            }">
            <Icon :name="'text-align-center'" />
          </gButton>
          <gButton
            :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
            @click="(e) => {
              hide(e);
              editor.chain().focus().setTextAlign('right').run()
            }">
            <Icon :name="'text-align-right'" />
          </gButton>
        </div>
      </gDropdown>
      <gButton 
        v-tooltip="'Bold'"
        :class="{ 'is-active': editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()">
        <Icon :name="'bold'" />
      </gButton>
      <gButton 
        v-tooltip="'Italic'"
        :class="{ 'is-active': editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()">
        <Icon :name="'italic'" />
      </gButton>
      <gButton 
        v-tooltip="'Strikethrough'"
        :class="{ 'is-active': editor.isActive('strike') }" @click="editor.chain().focus().toggleStrike().run()">
        <Icon :name="'strikethrough'" />
      </gButton>
      <gButton 
        v-tooltip="'Link'"
        :class="{ 'is-active': editor.isActive('link') }" @click="setLink">
        <Icon :name="'link'" />
      </gButton>
      <gButton v-if="editor.isActive('link')" 
        v-tooltip="'Remove Link'"
        @click="editor.chain().focus().unsetLink().run()">
        <Icon :name="'remove-link'" />
      </gButton>
      <gButton 
        v-tooltip="'List'"
        :class="{ 'is-active': editor.isActive('bulletList') }" @click="editor.chain().focus().toggleBulletList().run()">
        <Icon :name="'list'" />
      </gButton>
      <gButton 
        v-tooltip="'Numbered List'"
        :class="{ 'is-active': editor.isActive('orderedList') }" @click="editor.chain().focus().toggleOrderedList().run()">
        <Icon :name="'ordered-list'" />
      </gButton>
      <gButton 
        v-if="!slim"
        v-tooltip="'Insert Image'"
        @click="selectingImage = true"
        @focus="editorFocused = true">
        <Icon :name="'image'" />
      </gButton>
      <input
        v-tooltip="'Text Color'"
        type="color"
        class="rounded h-8 w-8"
        :value="editor.getAttributes('textStyle').color"
        @input="editor.chain().focus().setColor($event.target.value).run()"
        @focus="editorFocused = true"
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
        class="rounded h-8 w-8"
        :value="editor.getAttributes('highlight').color"
        @input="editor.chain().focus().setHighlight({color: $event.target.value}).run()"
        @focus="editorFocused = true"
      />
      <gButton 
        v-if="editor.isActive('highlight')"
        v-tooltip="'Remove Highlight'"
        @click="editor.chain().focus().unsetHighlight().run()">
        <Icon name="remove-color" />
      </gButton>
      <!-- <gButton 
        v-tooltip="'Blockquote'"
        @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
        <Icon :name="'quote'" />
      </gButton> -->
      <!-- <gButton 
        v-tooltip="'Horizontal Rule'"
        @click="editor.chain().focus().setHorizontalRule().run()">
        <Icon :name="'line'" />
      </gButton> -->
      <gButton 
        v-tooltip="'Clear Formatting'"
        @click="editor.chain().focus().unsetAllMarks().run(); editor.chain().focus().clearNodes().run()">
        <Icon name="clear-formatting" />
      </gButton>
      <gButton 
        v-if="!slim"
        v-tooltip="'Undo'"
        @click="editor.chain().focus().undo().run()">
        <Icon :name="'undo'" />
      </gButton>
      <gButton 
        v-if="!slim"
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
      :style="{ minHeight: minHeight }"
      :editor="editor" />
    <gTextarea 
      v-else
      v-model="value"
      class="content-editor source-edit !bg-gray-200 !dark:bg-gray-200 dark:focus:bg-gray-200 dark:focus:text-800 active:bg-gray-200 dark:active:bg-gray-200 dark:active:text-800 !focus:ring-opacity-0 active:ring-opacity-0"
      variant="light"
      @focus="editorFocused = true" />
    <AlgoliaModalSelect
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
// import Dropcursor from '@tiptap/extension-dropcursor'
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
    },
    slim: {
      type: Boolean,
      default: false
    },
    alwaysShowToolbar: {
      type: Boolean,
      default: false
    },
    minHeight: {
      type: String,
      default: '180px'
    }
  },
  data() {
    return {
      editor: null,
      value: this.content,
      editingSrc: false,
      selectingImage: false,
      editorFocused: false,
      editorBlurred: true,
      toolbarHovered: false
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
      onBlur: () => {
        this.editorBlurred = true
        this.editorFocused = false
      },
      onFocus: () => {
        this.editorFocused = true
        this.editorBlurred = false
      },
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

.editor {
  @apply bg-gray-100 dark:bg-gray-800 bg-opacity-50 rounded;
  &.focused {
    @apply bg-gray-200 text-gray-900 shadow-lg bg-opacity-100;
  }
}
.content-editor {
  // min-height: var(--editor-min-height);
  > .ProseMirror {
    @apply focus:outline-none focus:ring-0 p-2 h-full;
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
    @apply mb-1 hover:text-gray-800 hover:bg-white bg-gray-100 text-gray-600;
    &.is-active {
      @apply text-gray-800 bg-white;
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