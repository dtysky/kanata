/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/12/18
 * Description: testing for core/ImageCore.
 */

import {ImageCore} from '../../src/core';
import {white20x20, black20x20} from './imageData.testcase';

describe('ImageCore', () => {
    it('constructor, all member variables will be initialized', () => {
        let image = new ImageCore();
        expect(image.mode).toEqual('RGBA');
        expect(image.size).toEqual([1, 1]);
        expect(image.data).toEqual(new Uint8ClampedArray([0, 0, 0, 0]));
        expect(image.dataIsModified).toBeFalsy();
        image = new ImageCore('L');
        expect(image.mode).toEqual('L');
    });

    it('fromImage, creating image data from HtmlImageElement', done => {
        const img = new Image();
        img.onload = () => {
            const image = new ImageCore();
            image.fromImage(img);
            expect(image.size).toEqual([20, 20]);
            expect(image.data).toEqual(white20x20);
            done();
        };
        img.src = '/base/testImages/white.png';
    });

    describe('fromUrl, creating image data from url:', () => {
        it ('failed with type', done => {
            const image = new ImageCore('L');
            image.fromUrl('')
                .catch(err => {
                    expect(err.name).toEqual('ImageModeError');
                    done();
                });
        });
        it ('failed with path', done => {
            const image = new ImageCore();
            image.fromUrl('')
                .catch(err => {
                    expect(err.name).toEqual('InvalidImagePathError');
                    done();
                });
        });
        it('successful', done => {
            const image = new ImageCore();
            const url = '/base/testImages/white.png';
            image.fromUrl(url)
                .then(img => {
                    expect(img.size).toEqual([20, 20]);
                    expect(img.data).toEqual(white20x20);
                    done();
                });
        });
    });

    describe('fromBuffer, creating image data from buffer:', () => {
        it ('failed with size', () => {
            const image = new ImageCore();
            try {
                image.fromBuffer([10, 10], new Uint8ClampedArray(10));
            } catch (err) {
                expect(err.name).toEqual('BufferSizeError');
            }
        });
        it('successful', () => {
            const image = new ImageCore();
            image.fromBuffer([20, 20], white20x20);
            expect(image.size).toEqual([20, 20]);
            expect(image.data).toEqual(white20x20);
        });
    });

    describe('copy, copying an image:', () => {
        it ('failed with type', done => {
            const image = new ImageCore('RGB');
            const image2 = new ImageCore('L');
            try {
                image2.copy(image);
            } catch (err) {
                expect(err.name).toBe('ImageModeError');
                done();
            }
        });
        it('successful', () => {
            const image = new ImageCore();
            const image2 = new ImageCore();
            image.fromBuffer([20, 20], white20x20);
            image2.copy(image);
            expect(image2.size).toEqual(image.size);
            expect(image2.data).toEqual(image.data);
            expect(image2.mode).toEqual(image.mode);
            expect(image2.dataIsModified).toEqual(image.dataIsModified);
        });
    });

    it('changeMode, change mode of image:', () => {
        const image = new ImageCore();
        image.changeMode('L');
        expect(image.mode).toEqual('L');
    });

    it('setPixel and getPixel, setting or getting pixel in image with position:', () => {
        const image = new ImageCore();
        image.fromBuffer([20, 20], white20x20);
        image.setPixel(0, 0, [0, 0, 0, 1]);
        image.setPixel(19, 19, [100, 100, 100, 1]);
        expect(image.getPixel(0, 0)).toEqual(new Uint8ClampedArray([0, 0, 0, 1]));
        expect(image.getPixel(19, 19)).toEqual(new Uint8ClampedArray([100, 100, 100, 1]));
    });

    it('modifyData, modify data with given option:', () => {
        const image = new ImageCore();
        image.fromBuffer([20, 20], white20x20);
        image.modifyData((data, size) => {
            expect(size).toEqual([20, 20]);
            for (let pos = 0; pos < data.length; pos += 4) {
                data[pos] = 0;
                data[pos + 1] = 0;
                data[pos + 2] = 0;
                data[pos + 3] = 255;
            }
        });
        expect(image.data).toEqual(black20x20);
        expect(image.dataIsModified).toBeTruthy();
    });

    it('modifyContext, modify context with given option:', () => {
        const image = new ImageCore();
        image.fromBuffer([20, 20], white20x20);
        image.dataIsModified = true;
        image.modifyContext((context, size) => {
            expect(size).toEqual([20, 20]);
            const data = new ImageData(20, 20);
            data.data.set(black20x20, 0);
            context.putImageData(data, 0, 0);
        });
        expect(image.data).toEqual(black20x20);
        expect(image.dataIsModified).toBeFalsy();
    });

    it('forEach, handling points with given option:', () => {
        const image = new ImageCore();
        image.fromBuffer([20, 20], white20x20);
        let x = 0;
        let y = 0;
        image.forEach((pixel, position) => {
            expect([x, y]).toEqual(position);
            expect(pixel).toEqual(new Uint8ClampedArray([255, 255, 255, 255]));
            y = x === 19 ? y + 1 : y;
            x = x === 19 ? 0 : x + 1;
        });
    });

    it('map, modify points with given option:', () => {
        const image = new ImageCore();
        image.fromBuffer([20, 20], white20x20);
        let x = 0;
        let y = 0;
        image.map((pixel, position) => {
            expect([x, y]).toEqual(position);
            y = x === 19 ? y + 1 : y;
            x = x === 19 ? 0 : x + 1;
            return [0, 0, 0, 255];
        });
        expect(image.data).toEqual(black20x20);
        expect(image.dataIsModified).toBeTruthy();
    });

    describe('test for performance:', () => {
        it('modifyData, modify data with given option:', done => {
            const image = new ImageCore();
            const url = '/base/testImages/rgba.png';
            image.fromUrl(url)
                .then(img => {
                    const s = performance.now();
                    img.modifyData((data, size) => {
                        for (let pos = 0; pos < data.length; pos += 4) {
                            data[pos] = 0;
                            data[pos + 1] = 0;
                            data[pos + 2] = 0;
                            data[pos + 3] = 255;
                        }
                    });
                    console.log('Performance, ImageCore, modifyData', img.size, img.mode, 'time(ms)', (performance.now() - s));
                    done();
                });
        });
        it ('forEach', done => {
            const image = new ImageCore();
            const url = '/base/testImages/rgba.png';
            image.fromUrl(url)
                .then(img => {
                    let s = performance.now();
                    img.forEach(() => []);
                    // tslint:disable-next-line
                    console.log('Performance, ImageCore, forEach', img.size, img.mode, 'time(ms)', (performance.now() - s));

                    img.changeMode('L');
                    s = performance.now();
                    img.forEach(() => []);
                    // tslint:disable-next-line
                    console.log('Performance, ImageCore, forEach', img.size, img.mode, 'time(ms)', (performance.now() - s));
                    done();
                });
        });
        it ('map', done => {
            const image = new ImageCore();
            const url = '/base/testImages/rgba.png';
            image.fromUrl(url)
                .then(img => {
                    let s = performance.now();
                    img.map((pixel, position)  => [0, 0, 0, 255]);
                    // tslint:disable-next-line
                    console.log('Performance, ImageCore, map', img.size, img.mode, 'time(ms)', (performance.now() - s));
                    img.changeMode('L');
                    s = performance.now();
                    img.map(point => [0]);
                    // tslint:disable-next-line
                    console.log('Performance, ImageCore, map', img.size, img.mode, 'time(ms)', (performance.now() - s));
                    done();
                });
        });
    });
});
