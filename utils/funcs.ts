import { Media } from '~/models/media.model'
export const imageFileTypes = ['gif', 'png', 'jpg', 'jpeg', 'tif', 'tiff', 'gif'];

/* eslint-disable no-extra-boolean-cast */
export const handleize = (strng: string, reaplceSpacesWith: string = '-'): string => {
  return strng.toLowerCase().trim().replace(/ /g, reaplceSpacesWith).replace(/[^a-z0-9]+/g, reaplceSpacesWith).replace(/-$/, '').replace(/^-/, '').replace(/--/, reaplceSpacesWith)
}

export const stringToHTML = (str: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(str, 'text/html')
  return doc.body
}

export const capitalize = (strng: string): string => {
  return strng.split(' ').map(word => word[0].toUpperCase() + word.substring(1)).join(' ')
}

export const objectsAreTheSame = (_obj1: any, _obj2: any, dblCheck: boolean = true): any => {
  const obj1 = (() => {
    try {
      return JSON.parse(JSON.stringify(_obj1))
    } catch (err) {
      return _obj1
    }
  })();
  const obj2 = (() => {
    try {
      return JSON.parse(JSON.stringify(_obj2))
    } catch (err) {
      return _obj2
    }
  })();
  if (obj1 === null && obj2 === null) { return true }
  if ((obj1 === null && obj2 !== null) || (obj1 !== null && obj2 === null)) { return false }
  const fields = Object.keys(obj1)
  for (const field of fields) {
    if (typeof obj1[field] !== typeof obj2[field]) { return false }
    if (Array.isArray(obj1[field])) {
      if (!Array.isArray(obj2[field])) { return false }
      if (obj1[field].sort().toString() !== obj2[field].sort().toString()) { return false }
    } else if (typeof obj1[field] === 'object') {
      const objs = { obj1, obj2 }
      if (objectsAreTheSame(objs.obj1[field], objs.obj2[field])) { return false }
    } else if (obj1[field] !== obj2[field]) { return false }
  }
  const o2 = (() => {
    try {
      return JSON.parse(JSON.stringify(obj2))
    } catch (err) {
      return obj2
    }
  })();
  const o1 = (() => {
    try {
      return JSON.parse(JSON.stringify(obj1))
    } catch (err) {
      return obj1
    }
  })();
  return dblCheck
    ? objectsAreTheSame(o1, o2, false)
    : true
}

export const sortCompare = (key: string, order: 'asc' | 'desc' = 'asc') => {
  return function innerSort(a: any, b: any) {
    if (!!!a[key] || !!!b[key]) {
      return 0
    }
    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key]
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key]

    let comparison = 0
    if (varA > varB) {
      comparison = 1
    } else if (varA < varB) {
      comparison = -1
    }
    return order === 'desc' ? comparison * -1 : comparison
  }
}

export const objectValue = (keyString: string, obj: any) => {
  const objct = (() => {
    try {
      JSON.parse(JSON.stringify(obj))
    } catch (err) {
      return obj
    }
  })();
  if (!keyString || !objct || !objct[keyString.split('.')[0]] === undefined) {
    return null
  }
  try {
    if (typeof objct !== 'object' || !!!objct) { return null }
    return keyString.split('.').reduce((previous, current) => {
      return typeof previous === 'object' && !!previous[current.trim()] ? previous[current.trim()] : null
    }, objct)
  } catch {
    return null
  }
}

export const setObjectValue = (keyString: string, value: any, objct: any) => {
  const keys = keyString.split('.')
  if (keys.length === 1) { return { ...objct, [keys[0]]: value } }
  if (!!!objct[keys[0]]) { objct[keys[0]] = {} }
  if (keys.length === 2) {
    objct[keys[0]] = { ...objct[keys[0]], [keys[1]]: value }
    return objct
  }
  if (!!!objct[keys[0]][keys[1]]) { objct[keys[0]][keys[1]] = {} }
  if (keys.length === 3) {
    objct[keys[0]][keys[1]] = { ...objct[keys[0]][keys[1]], [keys[2]]: value }
    return objct
  }
  if (!!!objct[keys[0]][keys[1]][keys[2]]) { objct[keys[0]][keys[1]][keys[2]] = {} }
  if (keys.length === 4) {
    objct[keys[0]][keys[1]][keys[2]] = { ...objct[keys[0]][keys[1]][keys[2]], [keys[3]]: value }
    return objct
  }
  if (!!!objct[keys[0]][keys[1]][keys[2]][keys[3]]) { objct[keys[0]][keys[1]][keys[2]][keys[3]] = {} }
  if (keys.length === 5) {
    objct[keys[0]][keys[1]][keys[2]][keys[3]] = { ...objct[keys[0]][keys[1]][keys[2]][keys[3]], [keys[4]]: value }
    return objct
  }
  if (!!!objct[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]]) { objct[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]] = {} }
  if (keys.length === 6) {
    objct[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]] = { ...objct[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]], [keys[5]]: value }
    return objct
  }
}

export const getImageFileType = ( path: any ) => {
    if ( !!!path ) return false;
    const potentialExtension = path.split( '.' ).pop().split( '?' )[ 0 ].toLowerCase().trim();
    if ( !!!potentialExtension || potentialExtension === '' ) return false;
    const foundExtension = imageFileTypes.filter( ( ex: any ) => {
      if ( !!!path ) return false;
      return ex === potentialExtension;
    } )[ 0 ];
    if ( !!!foundExtension ) return null;
    return `image/${ foundExtension }`
}
  
export const getThumbImageUrl = (image: any, el: any): string | Media | undefined => {
  const elWidth = el?.offsetWidth
  /* is shopify image */
  if (typeof image === 'string' && image.includes('cdn.shopify.com') || (image.src && image.src.includes('cdn.shopify.com'))) {
    const src = typeof image === 'string' ? image : image.src;
    const width = Math.ceil(elWidth / 100) * 100;
    const segments = src.split('.');
    const suffix = segments.pop();
    return `${segments.join('.')}_x${width}.${suffix}`;
  }
  if (!!!image.thumbs) {
    return !!image?.downloadUrl ? image.downloadUrl : image
  }
  const thumbSizes: number[] = Object.keys(image.thumbs)
    .map((size: string) => parseInt(size))
    .filter((size: number) => size >= elWidth);
  const smallestSize: number | null = thumbSizes.reduce((acc: number | null, size: number) => {
    if (acc === null) return size;
    if (acc === null || acc > size) return size;
    return acc
  }, null);
  const thumb = image.thumbs[`${smallestSize}`];
  return !!thumb ? thumb : !!image?.downloadUrl ? image.downloadUrl : image
}

export const camelToHandle = (strng: string) => {
  return handleize('A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(',')
    .reduce((acc: string, ltr: string) => {
      if (!acc.includes(ltr)) return acc;
      const joinAt = '-' + ltr.toLowerCase() + ''
      return acc.split(ltr).join(joinAt)
    }, strng))
}

export const isJsonObject = (item: any) => {

  try {
    item = ![undefined, null].includes(item) && ['number', 'string', 'boolean', 'function'].includes(typeof item)
      ? item :
      JSON.stringify(item);
    item = JSON.parse(item);
  } catch (e) {
    return false;
  }

  if (typeof item === "object" && item !== null) {
    return true;
  }

  return false;
}

export const flattenArray = (arr: any) => arr.reduce((acc: any, val: any) => acc.concat(val), []);

export const getRandomNumber = (min:number, max:number) => {
  min = Math.ceil( min );
  max = Math.floor( max );
  return Math.floor( Math.random() * ( max - min ) ) + min;
}


export const decodeHtml = (function() {
  // this prevents any overhead from creating the object each time
  const element = document.createElement('div');

  function decodeHTMLEntities(strng: string) {
    let str:any = strng
    if(str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }

    return str;
  }

  return decodeHTMLEntities;
})();


export const moveItemInArray = (arr:any[], oldIndex:number, newIndex:number) => {
  const image = arr.splice(oldIndex, 1)[0];
  return [...arr.splice(0, newIndex), image, ...arr]
}