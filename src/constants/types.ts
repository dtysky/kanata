/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/12/19
 * Description: types definitions.
 */

/**
 * Type of color spaces.
 */
export type TColorSpaces =
    'RGBA'
    | 'RGB'
    | 'BGR'
    | 'BGRA'
    | 'L'
    | 'B'
    | 'CMYK'
    | 'HLS'
    | 'HSV'
    | 'XYZ';

/**
 * Type of image's size, it should be [width, height].
 */
export type TImageSize = [number, number];

/**
 * Type of color channel, it will be r, g, b...etc.
 */
export type TChannel = number;

/**
 * Type of coord, it will be x, y...etc.
 */
export type TCoord = number;

/**
 * Type of position, it will be [x, y]
 */
export type TPosition = [TCoord, TCoord];

/**
 * Type of pixel, it will be [r, g, b, a] etc
 */
export type TPixel = Uint8ClampedArray | TChannel[];

/**
 * Type of point, it will be [[x, y], pixel]
 */
export type TPoint = [TPosition, TPixel];

/**
 * Type of image buffer, it will be an Uint8ClampedArray, like [r1, b1, g1, a1, r2, g2, b2, a2...]
 */
export type TBuffer = Uint8ClampedArray;
