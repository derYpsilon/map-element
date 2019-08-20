'use strict'
const svgRoot = document.getElementById('my-map');
const shoppingPoints = [
    { x: 847, y: 165, address: 'ул. Широкая, 12Б, \nТЦ Фортуна', logo: './images/logo/azbukabrendov.png' },
    { x: 343, y: 465, address: 'Сущевский вал, 5 стр. 11,\n ТК Савеловский, \nкорпус Спортивный', logo: './images/logo/nichego.png' },
    { x: 281, y: 587, address: 'У отца было три сына:\n Старший умный был детина', logo: './images/logo/stripes.png' },
    { x: 392, y: 624, address: 'Средний был и так и сяк', logo: './images/logo/stripes.png' },
    { x: 451, y: 688, address: 'Столешников переулок, 7/3', logo: './images/logo/bonappartement.png' },
    { x: 494, y: 693, address: 'ул. Неглинная, 9', logo: './images/logo/vintagevoyage.png' },
    { x: 598, y: 648, address: 'Можно делать\n две или \nтри строки', logo: './images/logo/stripes.png' },
    { x: 521, y: 865, address: 'Знать, столица та была', logo: './images/logo/stripes.png' },
    { x: 543, y: 715, address: 'ул. Мясницкая, 24/7, стр. 1', logo: './images/logo/secondfriend.png' },
    { x: 552, y: 726, address: 'Там пшеницу продавали', logo: './images/logo/stripes.png' },
    { x: 565, y: 752, address: 'Деньги счетом принимали', logo: './images/logo/stripes.png' },
    { x: 581, y: 732, address: 'И с набитою сумой', logo: './images/logo/stripes.png' },
    { x: 603, y: 717, address: 'Чистопрудный бульвар, 9', logo: './images/logo/mechta.png' },
    { x: 601, y: 732, address: 'ул. Покровка, 17', logo: './images/logo/strogo.png' },
    { x: 601, y: 761, address: 'Надо младшему сбираться', logo: './images/logo/stripes.png' },
    { x: 617, y: 756, address: 'Он и усом не ведет', logo: './images/logo/stripes.png' },
    { x: 647, y: 747, address: 'На печи в углу поет', logo: './images/logo/hulk.png' },
    { x: 638, y: 721, address: 'Лялин переулок, 14, стр. 3', logo: './images/logo/jeans.png' },
    { x: 452, y: 1000, address: 'Шаболовка, 25, к. 1', logo: './images/logo/frikfrak.png' }
];
const pointRadius = 14;

class ShopMaker {
    constructor(shoppingPoints, svgObject, r) {
        this._canvas = svgObject;
        this._shoppingPoints = shoppingPoints;
        this._active = null;
        this._radius = r;
        this._defaultWidth = this._canvas.getAttribute('width');
        this._defaultHeight = this._canvas.getAttribute('height');
        this._currentScale = 1;
        this.initScale();
        this.render();
        this._canvas.addEventListener('mouseover', () => this.mouseOverHandler(event));
        this._canvas.addEventListener('mouseout', () => this.mouseOutHandler(event));
    }
    render() {
        let i = 0;
        this._shoppingPoints.forEach((item) => {
            let group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            let element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

            element.setAttributeNS(null, 'cx', item.x - this._radius);
            element.setAttributeNS(null, 'cy', item.y - this._radius);
            element.setAttributeNS(null, 'r', this._radius);
            element.setAttributeNS(null, 'fill', 'url(#PointGradient)');

            group.appendChild(element);

            element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            element.setAttributeNS(null, 'cx', item.x - this._radius);
            element.setAttributeNS(null, 'cy', item.y - this._radius);
            element.setAttributeNS(null, 'r', this._radius - 2);
            element.setAttributeNS(null, 'fill', '#fff');
            group.appendChild(element);

            element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            element.setAttributeNS(null, 'cx', item.x - this._radius);
            element.setAttributeNS(null, 'cy', item.y - this._radius);
            element.setAttributeNS(null, 'r', this._radius - 4);
            element.setAttributeNS(null, 'fill', 'url(#PointGradient)');
            group.appendChild(element);

            element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            element.setAttributeNS(null, 'cx', item.x - this._radius);
            element.setAttributeNS(null, 'cy', item.y - this._radius);
            element.setAttributeNS(null, 'r', this._radius);
            element.setAttributeNS(null, 'fill', 'rgba(255,255,255,0)');
            element.setAttributeNS(null, 'address', item.address);
            element.setAttributeNS(null, 'class', 'shop-pointer');
            element.setAttributeNS(null, 'style', 'cursor: pointer');
            element.setAttributeNS(null, 'array', i);
            group.appendChild(element);

            this._canvas.appendChild(group);
            i++;
        })
    }
    initScale() {
        this._canvas.parentNode.style = `width:${this._defaultWidth}px; height: ${this._defaultHeight}px;`;
    }

    scale() {
        const value = this._currentScale;
        const x = this._defaultWidth / value;
        const y = this._defaultHeight / value;
        const wrapWidth = this._defaultWidth * value;
        const wrapHeight = this._defaultHeight * value;
        this._canvas.parentNode.style = `width:${wrapWidth}px; height: ${wrapHeight}px;`;

        if (this._currentScale > 1) {
            this._canvas.setAttribute('width', this._defaultWidth * value);
            this._canvas.setAttribute('height', this._defaultHeight * value);
            this._canvas.setAttribute('viewBox', `0 0 ${this._defaultWidth} ${this._defaultHeight}`);
        }
        else {
            this._canvas.setAttribute('width', this._defaultWidth);
            this._canvas.setAttribute('height', this._defaultHeight);
            this._canvas.setAttribute('viewBox', `0 0 ${x} ${y}`);
        }
    }
    zoomIn() {
        if (this._currentScale<1.9)this._currentScale += .2;
        this.scale();
    }
    zoomOut() {
        if (this._currentScale>0.5) this._currentScale -= .2;
        this.scale();
    }
    zoomReset() {
        this._currentScale = 1;
        this.scale();
    }
    removeBanner() {
        let banner = document.querySelector('.shop-banner');
        while (banner.firstChild) {
            banner.removeChild(banner.firstChild);
        }
        banner.remove();
    }

    mouseOutHandler(event) {
        if (event.target.classList.contains('shop-pointer')) {
            this.removeBanner();
            this._active = null;
        }
    }
    mouseOverHandler(event) {
        // let x = (window.Event) ? event.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
        // let y = (window.Event) ? event.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
        // console.log(`x: ${x}, y: ${y}`);
        if (event.target.classList.contains('shop-pointer')) {

            const index = event.target.getAttributeNS(null, 'array');
            if (this._active !== null) {
                if (this._active === index) return;
                this.removeBanner();
            }
            const x = this._shoppingPoints[index].x;
            const y = this._shoppingPoints[index].y;
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.setAttributeNS(null, 'class', 'shop-banner');
            group.appendChild(this.drawBanner(x, y, index));
            group.appendChild(this.drawPointer(x, y));
            this._canvas.appendChild(group);
            this._active = index;
        }
    }

    drawBanner(x, y, index) {
        let rWidth = 260;
        let rHeight = 140;
        let offsetX = 30;
        let offsetY = 50;

        if (((x + this._radius) + offsetX + rWidth)*this._currentScale > this._canvas.getAttribute('width')) {
            offsetX = (-offsetX - rWidth - (this._radius * 2));
        }
        if (y - offsetY - rHeight < 0) offsetY = 0;

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        // Фон для баннера
        const bannerBG = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bannerBG.setAttributeNS(null, 'x', x + offsetX);
        bannerBG.setAttributeNS(null, 'y', y - offsetY - rHeight);
        bannerBG.setAttributeNS(null, 'width', rWidth);
        bannerBG.setAttributeNS(null, 'height', rHeight);
        bannerBG.setAttributeNS(null, 'fill', 'rgba(255,255,255,0.9)');

        const gradientSeparator = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        gradientSeparator.setAttributeNS(null, 'x', x + offsetX + 10);
        gradientSeparator.setAttributeNS(null, 'y', y - offsetY - rHeight / 2);
        gradientSeparator.setAttributeNS(null, 'width', rWidth - 20);
        gradientSeparator.setAttributeNS(null, 'height', 4);
        gradientSeparator.setAttributeNS(null, 'fill', 'url(#PointGradient)');

        const logo = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        logo.setAttributeNS(null, 'x', x + offsetX + 10);
        logo.setAttributeNS(null, 'y', y - offsetY - rHeight + 2);
        logo.setAttributeNS(null, 'width', rWidth - 20);
        logo.setAttributeNS(null, 'height', rHeight / 2 - 4);
        logo.setAttributeNS(null, 'href', this._shoppingPoints[index].logo);
        logo.setAttributeNS(null, 'preserveAspectRatio', 'xMidYMid meet');

        // Адрес на баннере
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttributeNS(null, 'x', x + offsetX + rWidth / 2);
        text.setAttributeNS(null, 'y', y - offsetY - rHeight / 2 + 24);
        text.setAttributeNS(null, 'text-anchor', 'middle');
        text.setAttributeNS(null, 'fill', 'black');
        text.setAttributeNS(null, 'style', 'font-family: Myriad; font-weight: bold; font-size: 18px;');

        this.drawText(index, text, x + offsetX + rWidth / 2, 20);

        group.appendChild(bannerBG);
        group.appendChild(text);
        group.appendChild(gradientSeparator);
        group.appendChild(logo);



        return group;
    }

    drawPointer(x, y) {
        // Указатель местоположения
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttributeNS(null, 'd', `m${x - this._radius} ${y - this._radius} q 20 -20, 30 -40 q 5 -15, 0 -30   q -10 -20, -30 -20 q -20 0, -30 20   q -5 15, 0 30 q 10 20, 30 40 z`);
        path.setAttributeNS(null, 'fill', 'url(#PathGradient)');
        path.setAttributeNS(null, 'stroke', '#fff');
        group.appendChild(path);

        const blueCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        blueCircle.setAttributeNS(null, 'cx', x - this._radius);
        blueCircle.setAttributeNS(null, 'cy', y - 67);
        blueCircle.setAttributeNS(null, 'r', 23);
        blueCircle.setAttributeNS(null, 'fill', '#471E72');
        blueCircle.setAttributeNS(null, 'stroke-width', 3);
        blueCircle.setAttributeNS(null, 'stroke', '#fff');
        group.appendChild(blueCircle);

        const sLetter = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const sText = document.createTextNode('S');
        sLetter.setAttributeNS(null, 'x', x - this._radius);
        sLetter.setAttributeNS(null, 'y', y - 67 + 13);
        sLetter.setAttributeNS(null, 'text-anchor', 'middle');
        sLetter.setAttributeNS(null, 'fill', 'white');
        sLetter.setAttributeNS(null, 'style', 'font-family: Myriad; font-weight: bold; font-size: 36px;');
        sLetter.appendChild(sText);
        group.appendChild(sLetter);
        // Наконец закончился
        return group;
    }

    drawText(index, textElement, xPos, lineHeight) {
        const textLines = this._shoppingPoints[index].address.split('\n');
        textLines.forEach((item, count) => {
            let ts = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            let text = document.createTextNode(item.trim());

            ts.setAttributeNS(null, 'dy', count ? lineHeight : 0);
            ts.setAttributeNS(null, 'x', xPos);
            ts.setAttributeNS(null, 'text-anchor', 'middle');
            ts.appendChild(text);
            //console.log(text);
            textElement.appendChild(ts);
        });
    }
}
const render = new ShopMaker(shoppingPoints, svgRoot, 13);
const zoom = document.getElementById('controls-zoom');
const unzoom = document.getElementById('controls-unzoom');
const reset = document.getElementById('controls-reset');
zoom.addEventListener('click', () => { render.zoomIn() });
unzoom.addEventListener('click', () => { render.zoomOut() });
reset.addEventListener('click', () => { render.zoomReset() });