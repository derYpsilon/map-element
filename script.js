'use strict';

const SHOPPING_POINTS = [
    { x: 847, y: 165, address: 'ул. Широкая, 12Б, \nТЦ Фортуна', title: '', logo: './images/logo/azbukabrendov.png' },
    { x: 343, y: 465, address: 'Сущевский вал, 5 стр. 11,\n ТК Савеловский, \nкорпус Спортивный', title: '', logo: './images/logo/nichego.png' },
    { x: 281, y: 587, address: '1-й Боткинский проезд,\n д. 7с1', title: 'Charity Shop', logo: '' },
    { x: 392, y: 624, address: 'ул. Фадеева, д. 7, стр. 1', title: 'Charity Shop', logo: '' },
    { x: 451, y: 688, address: 'Столешников переулок, 7/3', title: '', logo: './images/logo/bonappartement.png' },
    { x: 494, y: 693, address: 'ул. Неглинная, 9', title: '', logo: './images/logo/vintagevoyage.png' },
    { x: 598, y: 648, address: 'ул. Садовая-Спасская,\nд. 12/23с2', title: 'Charity Shop', logo: '' },
    { x: 521, y: 865, address: 'ул. Новокузнецкая, д. 1', title: 'Charity Shop', logo: '' },
    { x: 543, y: 715, address: 'ул. Мясницкая, 24/7, стр. 1', title: '', logo: './images/logo/secondfriend.png' },
    // { x: 552, y: 726, address: 'Адреса нет на макетах', title: '', logo: './images/logo/stripes.png' },
    { x: 565, y: 752, address: 'Большой Златоустинский пер.,\n д. 8/7', title: 'Fefëla Vintage', logo: '' },
    { x: 581, y: 732, address: 'ул. Покровка, д. 1', title: 'Total Vintage', logo: '' },
    { x: 603, y: 717, address: 'Чистопрудный бульвар, 9', title: '', logo: './images/logo/mechta.png' },
    { x: 601, y: 732, address: 'ул. Покровка, 17', title: '', logo: './images/logo/strogo.png' },
    { x: 601, y: 761, address: 'Хохловский пер., д. 3', title: 'Legacy Showroom', logo: '' },
    { x: 617, y: 756, address: 'Хохловский пер., д. 7-9, 2', title: 'Mix and Max Vintage', logo: '' },
    // { x: 647, y: 747, address: 'Адреса нет на макетах', title: 'Нет названия', logo: './images/logo/stripes.png' },
    { x: 638, y: 721, address: 'Лялин переулок, 14, стр. 3', title: '', logo: './images/logo/jeans.png' },
    { x: 452, y: 1000, address: 'Шаболовка, 25, к. 1', title: '', logo: './images/logo/frikfrak.png' }
];

const PROPS = {
    font: 'Myriad, Helvetica, Arial, sans-serif', // Шрифт
    pointRadius: 14, // Радиус точки на карте
    scaleStep: 0.2, // Шаг масштабирования
    fontSize: 18, // Размер шрифта для адресов на баннере
    fontTitleSize: 26, // Размер шрифта для названия магазина
    fontPointerSize: 36, // Размер шрифта для буквы в указателе
    zoomInID: 'map-controls-zoom-in', // ID элементов для зума
    zoomOutID: 'map-controls-zoom-out',
    zoomResetID: 'map-controls-reset',
    pointFill: 'url(#PointGradient)', // Заливка для точки на карте, можно просто указать цвет, например 'blue'
    pathFill: 'url(#PathGradient)' // Заливка для указателя на карте, можно просто указать цвет, например 'red'
};

class ShopMaker {
    constructor(shoppingPoints, svgObject, props) {
        this._canvas = svgObject;
        this._shoppingPoints = shoppingPoints;
        this._active = null;
        this._radius = props.pointRadius;
        this._scaleStep = props.scaleStep;
        this._fontSize = props.fontSize;
        this._fontTitleSize = props.fontTitleSize;
        this._font = props.font;
        this._fontPointerSize = props.fontPointerSize;
        this._pointFill = props.pointFill;
        this._pathFill = props.pathFill;

        this._defaultWidth = this._canvas.getAttribute('width');
        this._defaultHeight = this._canvas.getAttribute('height');
        this._defaultScale = document.body.clientWidth / this._defaultWidth;
        document.querySelector('.map-container').style = `height: ${window.innerHeight}px; width: ${window.innerWidth}px`;
        this._currentScale = this._defaultScale;
        this._renderedBanners = [];

        this.initScale();
        this.scale();
        this.renderPoints();
        this.preloadBanners();

        this._canvas.addEventListener('mouseover', (event) => this.mouseHandler(event));
        this._canvas.addEventListener('mouseout', (event) => this.mouseOutHandler(event));

        this._zoomIn = document.getElementById(props.zoomInID);
        this._zoomOut = document.getElementById(props.zoomOutID);
        this._zoomReset = document.getElementById(props.zoomResetID);
        this._zoomIn.addEventListener('click', () => this.zoomIn());
        this._zoomOut.addEventListener('click', () => this.zoomOut());
        this._zoomReset.addEventListener('click', () => this.zoomReset());
    }
    renderPoints() {
        let i = 0;
        this._shoppingPoints.forEach((item) => {
            let group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            let element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

            element.setAttributeNS(null, 'cx', item.x - this._radius);
            element.setAttributeNS(null, 'cy', item.y - this._radius);
            element.setAttributeNS(null, 'r', this._radius);
            element.setAttributeNS(null, 'fill', this._pointFill);
            element.setAttributeNS(null, 'address', item.address);
            element.setAttributeNS(null, 'class', 'shop-pointer');
            element.setAttributeNS(null, 'style', 'cursor: pointer');
            element.setAttributeNS(null, 'array', i);

            group.appendChild(element);

            element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            element.setAttributeNS(null, 'cx', item.x - this._radius);
            element.setAttributeNS(null, 'cy', item.y - this._radius);
            element.setAttributeNS(null, 'r', this._radius - 2);
            element.setAttributeNS(null, 'fill', '#fff');
            element.setAttributeNS(null, 'pointer-events', 'none');
            group.appendChild(element);

            element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            element.setAttributeNS(null, 'cx', item.x - this._radius);
            element.setAttributeNS(null, 'cy', item.y - this._radius);
            element.setAttributeNS(null, 'r', this._radius - 4);
            element.setAttributeNS(null, 'fill', this._pointFill);
            element.setAttributeNS(null, 'pointer-events', 'none');
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
        if (this._currentScale <= 3) this._currentScale += this._scaleStep;
        this.scale();
    }
    zoomOut() {
        if (this._currentScale - this._scaleStep > 0.1) this._currentScale -= this._scaleStep;
        this.scale();
    }
    zoomReset() {
        this._currentScale = this._defaultScale;
        this.scale();
    }

    mouseOutHandler(event) {
        if (event.target.classList.contains('shop-pointer')) {
            this._renderedBanners[this._active].setAttributeNS(null, 'visibility', 'hidden');
            this._active = null;
        }
    }
    mouseHandler(event) {
        // ! Этот код оставлен для того, чтобы в случае добавления новой точки, можно было получить ее координаты в консоли
        // const xM = (window.Event) ? event.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
        // const yM = (window.Event) ? event.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
        // console.log(`x: ${xM}, y: ${yM}`);        
        if (event.target.classList.contains('shop-pointer')) {

            const index = event.target.getAttributeNS(null, 'array');
            this._renderedBanners[index].setAttributeNS(null, 'visibility', 'visible');
            this._active = index;
        }
    }

    preloadBanners() {
        this._shoppingPoints.forEach((item, index) => {
            let x = item.x;
            let y = item.y;
            let group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.setAttributeNS(null, 'class', 'shop-banner');
            group.appendChild(this.drawBanner(x, y, index));
            group.appendChild(this.drawPointer(x, y));
            group.setAttributeNS(null, 'pointer-events', 'none');
            group.setAttributeNS(null, 'visibility', 'hidden');
            this._renderedBanners.push(group);
            this._canvas.appendChild(this._renderedBanners[index]);
        })
    }

    drawBanner(x, y, index) {
        let rWidth = 260;
        let rHeight = 140;
        let offsetX = 30;
        let offsetY = 50;

        if (((x + this._radius) + offsetX + rWidth) * (this._currentScale > 1 ? this._currentScale : 1) > this._canvas.getAttribute('width')) {
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

        // Логотип или Название
        let logo;
        if (this._shoppingPoints[index].logo.trim() !== '') {
            logo = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            logo.setAttributeNS(null, 'x', x + offsetX + 10);
            logo.setAttributeNS(null, 'y', y - offsetY - rHeight + 2);
            logo.setAttributeNS(null, 'width', rWidth - 20);
            logo.setAttributeNS(null, 'height', rHeight / 2 - 4);
            logo.setAttributeNS(null, 'href', this._shoppingPoints[index].logo);
            logo.setAttributeNS(null, 'preserveAspectRatio', 'xMidYMid meet');
        }
        else {
            logo = this.drawTitle(index, x + offsetX + rWidth / 2, y - .75*rHeight - offsetY + this._fontTitleSize/2);
        }

        // Адрес на баннере
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttributeNS(null, 'x', x + offsetX + rWidth / 2);
        text.setAttributeNS(null, 'y', y - offsetY - rHeight / 2 + 24);
        text.setAttributeNS(null, 'text-anchor', 'middle');
        text.setAttributeNS(null, 'fill', 'black');
        text.setAttributeNS(null, 'style', `font-family: ${this._font}; font-size: ${this._fontSize}px;`);

        this.drawText(index, text, x + offsetX + rWidth / 2, this._fontSize + 2);

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
        path.setAttributeNS(null, 'fill', this._pathFill);
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
        sLetter.setAttributeNS(null, 'y', y - 54);
        sLetter.setAttributeNS(null, 'text-anchor', 'middle');
        sLetter.setAttributeNS(null, 'fill', 'white');
        sLetter.setAttributeNS(null, 'style', `font-family: ${this._font}; font-weight: bold; font-size: ${this._fontPointerSize}px;`);
        sLetter.appendChild(sText);
        group.appendChild(sLetter);

        return group;
    }

    drawText(index, textElement, xPos, lineHeight) {
        // Построчный вывод текста в баннере
        const textLines = this._shoppingPoints[index].address.split('\n');
        textLines.forEach((item, count) => {
            let ts = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            let text = document.createTextNode(item.trim());

            ts.setAttributeNS(null, 'dy', count ? lineHeight : 0);
            ts.setAttributeNS(null, 'x', xPos);
            ts.setAttributeNS(null, 'text-anchor', 'middle');
            ts.appendChild(text);
            textElement.appendChild(ts);
        });
    }
    drawTitle(index, x, y) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttributeNS(null, 'x', x);
        text.setAttributeNS(null, 'y', y);
        text.setAttributeNS(null, 'text-anchor', 'middle');
        text.setAttributeNS(null, 'fill', 'black');
        text.setAttributeNS(null, 'style', `font-family: ${this._font}; font-weight: bold; font-size: ${this._fontTitleSize}px;`);
        const shopTitle = document.createTextNode(this._shoppingPoints[index].title.trim());
        text.appendChild(shopTitle);

        return text;
    }
}

const svgRoot = document.getElementById('shops-map'); // Получаем элемент карты
new ShopMaker(SHOPPING_POINTS, svgRoot, PROPS); // Инициализируем объект класса