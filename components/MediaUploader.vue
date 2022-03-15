
<template>
  <div class="media-uploader mx-auto max-w-md">
    <vue-dropzone
      id="dropzone"
      ref="mediaDropzone"
      class="rounded bg-transparent border-dashed hover:bg-gray-200 dark:hover:bg-gray-800 shadow-lg border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-400"
      :options="dropzoneOptions"
      @vdropzone-complete="uploadMedia"
    />

    <MediaAttributes 
      v-if="mediaDocs.length === 0"
      :current="bulkAttributes"
      class="my-2"
      @update="(e) => {
        updateBulkAttributes(e)
      }"
    />

    <div v-if="mediaDocs.length"
      class="media-docs">
      <MediaUploadedDoc
        v-for="doc in mediaDocs" 
        :key="doc.docId"
        :doc="doc"
        :bulk-attributes="bulkAttributes"
      />
    </div>

    <div v-if="imageUrls.length" class="recent-uploads flex flex-wrap">
      <img 
        v-for="img in imageUrls"
        :key="img"
        :src="img"
        class="w-8 h-auto opacity-0 mr-2 mb-2"
        @load="(e) => setMediaInDb(e.target)"
      />
    </div>
  </div>
</template>

<script>
/* eslint-disable camelcase */
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import { getImageFileType, imageFileTypes } from '~/utils/funcs';
import { blankAttributes } from '~/models/media.model';

export default {
  components: {
    vueDropzone: vue2Dropzone
  },
  props: {
    storagePath: {
      type: String,
      default: 'test-uploads'
    },
    collectionPath: {
      type: String,
      default: 'test-uploads'
    },
  },
  data() {
    return {
      imageUrls: [],
      mediaDocs: [],
      dropzoneOptions: {
        url: '/not/relevant',
        thumbnailWidth: 250,
        thumbnailHeight: 250,
        addRemoveLinks: true,
        acceptedFiles: imageFileTypes.join(', ')
      },
      bulkAttributes: JSON.parse(JSON.stringify({...blankAttributes, tags: ['modeled']}))
    }
  },
  // created() {
  //   setTimeout(() => {
  //     this.bulkAttributes.tags.push('modeled')
  //   }, 2000);
  // },
  methods: {
    updateBulkAttributes(e) {
      this.bulkAttributes = e
    },
    async uploadMedia(file) {
      try {
        const filename = `${Date.now()}_${file.name}`;
        const fileType = getImageFileType(file.name);
        const metadata = {
          contentType: fileType
        }
        const mediaRef = this.$fire.storage.ref( this.storagePath ).child(filename);
        await mediaRef.put(file, metadata).catch(err => alert(err));
        const downloadUrl = await mediaRef.getDownloadURL();
        this.imageUrls.push(downloadUrl);
        this.$refs.mediaDropzone.removeFile(file);
      } catch(err) {
        alert(err)
      }
    },
    setMediaInDb(el) {
      const downloadUrl = el.getAttribute('src');
      const docRef = this.$db.docRef(this.collectionPath);
      const docPath = docRef.path;
      const docId = docPath.split( '/' ).pop();
      const image_width = el.naturalWidth;
      const image_height = el.naturalHeight;
      const filename = `${this.collectionPath}%2F${downloadUrl.split(`${this.collectionPath}%2F`).pop().split('?')[0]}`;
      const orientation = (() => {
        const ratio = image_width / image_height;
        if (ratio < .6) return 'tall';
        if (ratio < .97) return 'portrait';
        if (ratio < 1.03) return 'square';
        if (ratio < 1.6) return 'landscape';
        return 'wide'
      })();
      const data = {
        ...this.bulkAttributes,
        docId,
        docPath,
        filename,
        downloadUrl,
        image_width,
        image_height,
        orientation,
        name: `${filename.split(`${this.collectionPath}%2F`).pop().split('?')[0].split('_').slice(1).join('_')}`,
        filetype: getImageFileType(filename),
        created_at: Date.now(),
        updated_at: Date.now(),
      }
      return this.$db.updateAt(docPath, data)
        .then((doc) => {
          this.imageUrls = this.imageUrls.filter(url => url !== downloadUrl);
          this.mediaDocs.push(doc)
        })
        .catch(err => alert(err))
    },
    reset() {
      this.imageUrls = [];
      this.mediaDocs = [];
    }
  }
}
</script>