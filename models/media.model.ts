/* eslint-disable camelcase */

enum Filetype {
    ImageJPEG = "image/jpeg",
    ImageJpg = "image/jpg",
}

enum Orientation {
    Landscape = "landscape",
    Portrait = "portrait",
    Square = "square",
}

export interface Media {
    docPath:       string;
    list?:         string[];
    docId:         string;
    style?:        any[];
    downloadUrl?:  string;
    tags?:         string[];
    image_width?:  number;
    styles?:       string[];
    stores?:       string[];
    filetype?:     Filetype;
    apparel?:      string[];
    image_height?: number;
    colors?:       string[];
    materials?:    string[];
    products?:     string[];
    orientation?:  Orientation;
    fixedThumbs?:  boolean;
    fits?:         string[];
    thumbs?:       { [key: string]: string };
    filename?:     string;
    updated_at?:   number;
    name?:         string;
    created_at?:   number;
    material?:     any[];
    fit?:          any[];
    product?:      any[];
    rating?:       any[] | number;
    color?:        any[];
    models?:       string[];
    thumb?:        string;
}
