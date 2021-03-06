/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/12/21
 * Description: reversal color of image.
 */

import {ImageCore} from '../core';
import {COLOR_MAX} from '../constants';

export const colorInvert = () => (image: ImageCore) => {
    const [left, top, right, bottom] = image.region;
    const [width, height] = image.size;
    switch (image.mode) {
        case 'RGB':
        case 'RGBA':
        case 'BGR':
        case 'BGRA':
        case 'HSL':
        case 'HSV': {
            const [max1, max2, max3] = COLOR_MAX[image.mode];
            image.modifyData(data => {
                for (let y = top; y < bottom; y += 1) {
                    for (let x = left; x < right; x += 1) {
                        const pos = (x + y * width) << 2;
                        data[pos] = max1 - data[pos];
                        data[pos + 1] = max2 - data[pos + 1];
                        data[pos + 2] = max3 - data[pos + 2];
                    }
                }
            });
            break;
        }
        case 'L':
        case 'B': {
            const [max1] = COLOR_MAX[image.mode];
            image.modifyData(data => {
                for (let y = top; y < bottom; y += 1) {
                    for (let x = left; x < right; x += 1) {
                        const pos = (x + y * width) << 2;
                        data[pos] = max1 - data[pos];
                    }
                }
            });
            break;
        }
        case 'CMYK': {
            const [max1, max2, max3, max4] = COLOR_MAX[image.mode];
            image.modifyData(data => {
                for (let y = top; y < bottom; y += 1) {
                    for (let x = left; x < right; x += 1) {
                        const pos = (x + y * width) << 2;
                        data[pos] = max1 - data[pos];
                        data[pos + 1] = max2 - data[pos + 1];
                        data[pos + 2] = max3 - data[pos + 2];
                        data[pos + 3] = max4 - data[pos + 3];
                    }
                }
            });
            break;
        }
        default:
            break;
    }
    return image;
};
