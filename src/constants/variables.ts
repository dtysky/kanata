/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/12/24
 * Description: constants variables.
 */

/**
 * Collection of color spaces.
 */
export enum EColorSpaces {
    'RGB',
    'BGR',
    'RGBA',
    'BGRA',
    'L',
    'B',
    'CMYK',
    'HSL',
    'HSV'
}

/**
 * Collection of color spaces (Array).
 */
export const COLOR_SPACES = Object.keys(EColorSpaces).filter(
    color => !(parseInt(color, 10) >= 0)
);

/**
 * Bytes per pixel in different color spaces.
 */
export const PIXEL_SIZE = {
    RGB: 3,
    RGBA: 4,
    BGR: 3,
    BGRA: 4,
    L: 1,
    B: 1,
    CMYK: 4,
    HSL: 3,
    HSV: 3
};

/**
 * The max number for each channel in different color spaces.
 */
export const COLOR_MAX = {
    RGB: [255, 255, 255],
    RGBA: [255, 255, 255, 255],
    BGR: [255, 255, 255],
    BGRA: [255, 255, 255, 255],
    L: [255],
    B: [255],
    // normalize the range from 0 ~ 1 -> 0 ~ 255
    CMYK: [255, 255, 255, 255],
    // normalize the hue from 0 ~ 360 -> 0 ~ 255, s and l should equal to r g b
    HSL: [240, 255, 255],
    // normalize the hue from 0 ~ 360 -> 0 ~ 255, s and l should equal to r g b
    HSV: [240, 255, 255]
};

/**
 * Color Transformations.
 */
export enum EColorTrans {
    'Linear',
    'Log',
    'Gamma'
}