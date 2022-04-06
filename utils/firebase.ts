export class FireDb {

      firestore: any
      
      constructor(app: any) {
            this.firestore = app.$fire.firestore;
      }

      collection(path: string, query?: Function): Promise<any> {
            const collectionRef = typeof query === 'function' ?
                  query(this.firestore.collection(path))
                  : this.firestore.collection(path);
            if (!collectionRef) {
                  return new Promise((resolve) => resolve(null))
            }
            return collectionRef.get().then((collection:any) => {
                  return collection.docs.map((snap:any) => {
                        return {
                              id: snap.id,
                              ...snap.data()
                        }
                  })
            })
      }

      collectionGroup(path: string, query?: Function): Promise<any> {
            const collectionRef = typeof query === 'function' ?
                  query(this.firestore.collectionGroup(path))
                  : this.firestore.collectionGroup(path);
            if (!collectionRef) {
                  return new Promise((resolve) => resolve(null))
            }
            return collectionRef.get().then((collection:any) => {
                  return collection.docs.map((snap:any) => {
                        return {
                              id: snap.id,
                              ...snap.data()
                        }
                  })
            })
      }

      doc(path:string): Promise<any> {
            return this.firestore.doc(path).get()
                  .then((snap:any) => {
                        return {
                              id: snap.id,
                              ...snap.data()
                        }
                  });
      }

      updateAt(path: string, data: any, merge: boolean = true): Promise<any> {
            const segments = path.split('/').filter(v => v);
            const thisPath = path;
            data.updated_at = Date.now();
            console.log({ path, data })
            if ( data.created_at && typeof data.created_at !== 'number' )
                  delete data.created_at;
            if ( segments.length % 2 ) {
                  data.created_at = Date.now();
                  if (segments[0] === 'users') data.uid = segments[1];
                  const docRef = this.firestore.collection(path).doc();
                  data.docId = docRef.id;
                  data.docPath = `${path}/${docRef.id}`;
                  console.log({data, firestore: this.firestore, docRef})
                  return this.firestore.doc(data.docPath)
                        .set(data)
                        .then(() => data);
            } else {
                  return this.firestore.doc(path)
                        .set(data, { merge })
                        .then(() => this.doc(thisPath));
            }
      }

      async delete(path:string) {
            return await this.firestore.doc(path).delete();
      }
      
      docRef(path:string) {
            // return this.firestore.doc(path)
            const segments = path.split( '/' ).filter( v => v );
            if ( segments.length % 2 ) {
                  return this.firestore.collection( path ).doc();
            }
            return this.firestore.doc( path );
      }

      collectionRef(path: string, query?:Function) {
            return typeof query === 'function' ?
                  query(this.firestore.collection(path))
                  : this.firestore.collection(path)
      }

}