(function () {
    'use strict';

    /* ___ CONFIG ___ */

    const APP_NAME = 'freeMoVeApp';
    const CONFIG = {
        'app': {
            'debug': false,
            'element': 'main',
            'parent': 'body',
            'id': APP_NAME,
            'launcher': {
                'id': APP_NAME + '-launcher',
                'class': 'centered',
                'src': 'img/freeMoVe.png',
                'text': 'start ' + APP_NAME,
                'type': 'image', // 'image' or 'button'
            },
            'autoUpdate': true,
        },
        'connect': {
            'url': 'data/data.json',
            'interval': 1000,
        },
        'svg': {
            'namespace': 'http://www.w3.org/2000/svg',
            'draggable': { 'class': 'draggable' },
            'guielements': {
                'resource': {
                    'width': 150,
                    'height': 150,
                    'types': {
                        'default': { 'image': 'img/machine.png' },
                        'machine': { 'image': 'img/machine.png' },
                        'robot': { 'image': 'img/robot.png' },
                        'source': { 'image': 'img/source.png' },
                        'sink': { 'image': 'img/sink.png' },
                        'transport': { 'image': 'img/transport.png' },
                        'screwing': { 'image': 'img/machine.png' },
                        'bonding': { 'image': 'img/machine.png' },
                    },
                },
            },
        },
        'xlink': {
            'namespace': 'http://www.w3.org/1999/xlink',
        },
        'randomcolor': {
            'hue': 'green',
        }
    };
    
    /* ___ PROTOTYPE ___ */

    String.prototype.formatUnicorn = String.prototype.formatUnicorn || function () {
        let str = this.toString();
        
        if (arguments.length) {
            const t = typeof arguments[0];
            const args = ("string" === t || "number" === t) ?
                Array.prototype.slice.call(arguments)
                : arguments[0];

            for (let key in args) {
                str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
            }
        }
        
        return str;
    };

    /* ___ UTILS ___ */

    class Utils {
        static getRandomColor () {
            return randomColor(CONFIG.randomcolor);
        }
    }

    /* ___ DOM ___ */

    class DOMNode {
        constructor (parent) {
            this.parent = parent;
        }

        append () {
            this.parent.appendChild(this.element);
            return this;
        }

        remove () {
            this.parent.removeChild(this.element);
            return this;
        }
    }

    class DOMText extends DOMNode {
        constructor (text, parent) {
            super(parent);
            this.element = document.createTextNode(text);
            this.append();
        }

        setText (text) {
            this.element.nodeValue = text;
            return this;
        }
    }

    class DOMElementNode extends DOMNode {
        constructor (parent) {
            super(parent);
        }

        setAttribute(name, value) {
            this.element.setAttribute(name, value);
            return this;
        }

        getAttribute(name) {
            return this.element.getAttribute(name);
        }

        setAttributeNS(ns, name, value) {
            this.element.setAttributeNS(ns, name, value);
            return this;
        }

        getAttributeNS(ns, name) {
            return this.element.getAttributeNS(ns, name);
        }

        setAttributeXLINK(name, value) {
            this.setAttributeNS(CONFIG.xlink.namespace, name, value);
            return this;
        }

        getAttributeXLINK(name) {
            return this.getAttributeNS(CONFIG.xlink.namespace, name);
        }

        addClass(name) {
            this.element.classList.add(name);
            return this;
        }
        
        removeClass(name) {
            this.element.classList.remove(name);
            return this;
        }

        setClass(classes) {
            this.setAttribute('class', classes);
            return this;
        }

        setId(id) {
            this.setAttribute('id', id);
            return this;
        }

        addListener(name, func) {
            this.element.addEventListener(name, func);
            return this;
        }

        removeListener(name, func) {
            this.element.removeEventListener(name, func);
            return this;
        }

        addOnClick(func) {
            return this.addListener('click', func);
        }

        removeOnClick(func) {
            return this.removeListener('click', func);
        }

        addOnMouseDown(func) {
            return this.addListener('mousedown', func);
        }

        removeOnMouseDown(func) {
            return this.removeListener('mousedown', func);
        }
        
        addOnMouseMove(func) {
            return this.addListener('mousemove', func);
        }

        removeOnMouseMove(func) {
            return this.removeListener('mousemove', func);
        }

        addOnMouseOut(func) {
            return this.addListener('mouseout', func);
        }

        removeOnMouseOut(func) {
            return this.removeListener('mouseout', func);
        }

        addOnMouseUp(func) {
            return this.addListener('mouseup', func);
        }

        removeOnMouseUp(func) {
            return this.removeListener('mouseup', func);
        }
    }

    class DOMElement extends DOMElementNode {
        constructor (type, parent) {
            super(parent);
            this.element = document.createElement(type);
            this.append();
        }

        addText(text) {
            new DOMText(text, this.element);
            return this;
        }

        requestFullScreen () {
            const requestMethod =
                this.element.requestFullScreen ||
                this.element.webkitRequestFullScreen ||
                this.element.mozRequestFullScreen ||
                this.element.msRequestFullScreen;
            
            if (requestMethod) requestMethod.call(this.element);

            return this;
        }
    }

    class DOMElementButton extends DOMElement {
        constructor (parent) {
            super('button', parent);
        }
    }

    class DOMElementImage extends DOMElement {
        constructor (parent, src) {
            super('img', parent);
            this.setSource(src);
        }

        setSource(src) {
            this.setAttribute('src', src);
            return this;
        }
    }
    
    /* ___ SVG ___ */

    class SVGElement extends DOMElementNode {
        constructor (type, parent) {
            super(parent);
            this.element = document.createElementNS(CONFIG.svg.namespace, type);
            this.append();
        }

        makeDraggable() {
            this.setAsElementDragger(this.element);
            return this;
        }

        setAsElementDragger (element) {
            element.style.transform = 'matrix(1,0,0,1,0,0)';
            this.addClass(CONFIG.svg.draggable.class);
            this.addOnMouseDown((event) => {
                let x = event.clientX;
                let y = event.clientY;
                let matrix = element.style.transform.slice(7, -1).split(',');
                
                for (let i = 0; i < matrix.length; i++) {
                    matrix[i] = parseFloat(matrix[i]);
                }

                const mouseMoveHandler = (event) => {
                    matrix[4] += event.clientX - x;
                    matrix[5] += event.clientY - y;

                    element.style.transform = "matrix(" + matrix.join(',') + ")";

                    x = event.clientX;
                    y = event.clientY;
                }

                const dragStopHandler = () => {
                    this.removeOnMouseMove(mouseMoveHandler);
                    this.removeOnMouseUp(dragStopHandler);
                    //this.removeOnMouseOut(dragStopHandler);
                }

                this.addOnMouseMove(mouseMoveHandler);
                this.addOnMouseUp(dragStopHandler);
                //this.addOnMouseOut(dragStopHandler);
            });

            return this;
        }
    }                

    class DOMElementSVG extends SVGElement {
        constructor (parent) {
            super('svg', parent);
        }
    }

    class SVGElementPath extends SVGElement {
        constructor (data, parent) {
            super('path', parent);
            this.setData(data);
        }

        setData(data) {
            this.setAttribute('d', data);
            return this;
        }
    }

    class SVGElementPolygon extends SVGElement {
        constructor (points, parent) {
            super('polygon', parent);
            this.setData(points);
        }

        setData(points) {
            this.setAttribute('points', points);
            return this;
        }
    }

    class SVGElementCircle extends SVGElement {
        constructor (cx, cy, r, parent) {
            super('circle', parent);
            this
                .setC(cx, cy)
                .setR(r);
        }

        setCX(cx) {
            this.setAttribute('cx', cx);
            return this;
        }
      
        setCY(cy) {
            this.setAttribute('cy', cy);
            return this;
        }

        setC(cx, cy) {
            this
                .setCX(cx)
                .setCY(cy);
            return this;
        }
        
        setR(r) {
            this.setAttribute('r', r);
            return this;
        }
    }

    class SVGElementLine extends SVGElement {
        constructor (x1, y1, x2, y2, parent) {
            super('line', parent);
            this
                .setP1(x1, y1)
                .setP2(x2, y2);
        }

        setX1(x1) {
            this.setAttribute('x1', x1);
            return this;
        }

        setY1(y1) {
            this.setAttribute('y1', y1);
            return this;
        }

        setX2(x2) {
            this.setAttribute('x2', x2);
            return this;
        }

        setY2(y2) {
            this.setAttribute('y2', y2);
            return this;
        }

        setP1(x1, y1) {
            this.setX1(x1);
            this.setY1(y1);
            return this;
        }

        setP2(x2, y2) {
            this.setX2(x2);
            this.setY2(y2);
            return this;
        }
    }

    class SVGElementPolyline extends SVGElement {
        constructor (points, parent) {
            super('polyline', parent);
            this.setPoints(points);
        }

        setPoints (points) {
            if (Array.isArray(points)) points = points.filter(e => e).join(); // the filter removes empty array elements
            this.setAttribute('points', points);
            return this;
        }

        resetPoints () {
            this.setPoints("");
            return this;
        }

        addPoint (x, y) {
            let points = this.getAttribute('points').split(',');
            points.push(x + ' ' + y);
            this.setPoints(points);
            return this;
        }
    }

    class SVGElementRect extends SVGElement {
        constructor (x, y, width, height, parent) {
            super('rect', parent);
            this
                .setX(x)
                .setY(y)
                .setWidth(width)
                .setHeight(height);
        }

        setX(x) {
            this.setAttribute('x', x);
            return this;
        }

        setY(y) {
            this.setAttribute('y', y);
            return this;
        }

        setWidth(width) {
            this.setAttribute('width', width);
            return this;
        }

        setHeight(height) {
            this.setAttribute('height', height);
            return this;
        }

        setRX(rx) {
            this.setAttribute('rx', rx);
            return this;
        }

        setRY(ry) {
            this.setAttribute('ry', ry);
            return this;
        }

        setRoundedCorners(rx, ry) {
            this
                .setRX(rx)
                .setRY(ry);
            return this;
        }
    }

    class SVGElementRectRounded extends SVGElementRect {
        constructor (x, y, width, height, rx, ry, parent) {
            super(x, y, width, height, parent);
            this.setRoundedCorners(rx, ry);
        }
    }

    class SVGElementImage extends SVGElement {        
        constructor (x, y, width, height, source, parent) {
            super('image', parent);
            this
                .setX(x)
                .setY(y)
                .setWidth(width)
                .setHeight(height)
                .setSource(source);
        }

        setX(x) {
            this.setAttribute('x', x);
            return this;
        }

        setY(y) {
            this.setAttribute('y', y);
            return this;
        }

        setWidth(width) {
            this.setAttribute('width', width);
            return this;
        }

        setHeight(height) {
            this.setAttribute('height', height);
            return this;
        }

        setSource(source) {
            this.setAttributeXLINK('href', source);
            return this;
        }
    }

    class SVGElementText extends SVGElement {        
        constructor (x, y, text, parent) {
            super('text', parent);
            this
                ._init()
                .setX(x)
                .setY(y)
                .setText(text);
        }

        _init () {
            this.textNode = new DOMText('', this.element);
            this.append(this.textNode);
            return this;
        }

        setX(x) {
            this.setAttribute('x', x);
            return this;
        }

        setY(y) {
            this.setAttribute('y', y);
            return this;
        }

        setText(text) {
            this.textNode.setText(text);
            return this;
        }

        setFontFamily(fontFamily) {
            this.setAttribute('font-family', fontFamily);
            return this;
        }

        setFontSize(fontSize) {
            this.setAttribute('font-size', fontSize);
            return this;
        }

        family(fontFamily) {
            return this.setFontFamily(fontFamily);
        }

        size(fontSize) {
            return this.setFontSize(fontSize);
        }

        getHeight () {
            return this.element.getBBox().height;
        }

        getWidth () {
            return this.element.getBBox().width;
        }
    }

    class SVGElementUse extends SVGElement {
        constructor (id, x, y, width, height, parent) {
            super('use', parent);
            this
                .setId(id)
                .setX(x)
                .setY(y)
                .setWidth(width)
                .setHeight(height);
        }

        setId(id) {
            //this.setAttribute('id', '#' + id);
            this.setAttributeXLINK('href', '#' + id);
            return this;
        }

        setX(x) {
            this.setAttribute('x', x);
            return this;
        }

        setY(y) {
            this.setAttribute('y', y);
            return this;
        }
        
        setWidth(width) {
            this.setAttribute('width', width);
            return this;
        }

        setHeight(height) {
            this.setAttribute('height', height);
            return this;
        }
    }

    /* ___ DRAWING ___ */

    class DrawingFactory extends SVGElement {
        constructor (type, parent) {
            super(type, parent);
        }

        addPath(data) {
            return new SVGElementPath(data, this.element);
        }

        addPolygon(points) {
            return new SVGElementPolygon(points, this.element);
        }

        addCircle(cx, cy, r) {
            return new SVGElementCircle(cx, cy, r, this.element);
        }

        addLine(x1, y1, x2, y2) {
            return new SVGElementLine(x1, y1, x2, y2, this.element);
        }

        addPolyline(points) {
            return new SVGElementPolyline(points, this.element);
        }
        
        addRect(x, y, width, height) {
            return new SVGElementRect(x, y, width, height, this.element);
        }

        addRectRounded(x, y, width, height, rx, ry) {
            return new SVGElementRectRounded(x, y, width, height, rx, ry, this.element);
        }

        addImage(x, y, width, height, source) {
            return new SVGElementImage(x, y, width, height, source, this.element);
        }

        addText(x, y, text) {
            return new SVGElementText(x, y, text, this.element);
        }

        addGroup(x, y) {
            return new SVGElementGroup(x, y, this.element);
        }

        addG(x, y) {
            return new SVGElementG(x, y, this.element);
        }

        addSymbol(id) {
            return new SVGElementSymbol(id, this.element);
        }

        addUse() {
            return new SVGElementUse(id, x, y, width, height, this.element);
        }

        addDragger(x, y, text) {
            return new SVGElementDragger(x, y, text, this.element);
        }

        addButton(x, y, text, func) {
            return new SVGElementButton(x, y, text, func, this.element);
        }

        addPopup(x, y) {
            return new SVGElementPopup(x, y, this.element);
        }

        addTrafficlight(x, y) {
            return new SVGElementTrafficlight(x, y, this.element);
        }

        addTrafficlightSingle(x, y) {
            return new SVGElementTrafficlightSingle(x, y, this.element);
        }

        addChartLine(x, y, points) {
            return new SVGElementChartLine(x, y, points, this.element);
        }
    }

    class Drawing extends DrawingFactory {
        constructor (parent) {
            super('svg', parent);
        }

        use(id, x, y, width, height) {
            return new SVGElementUse(id, x, y, width, height, this.element);
        }
    }

    /* ___ SVG CONTAINER ___ */

    class SVGElementGroup extends Drawing {        
        constructor (x, y, parent) {
            super(parent);
            this.setPosition(x, y);
        }

        setX(x) {
            this.setAttribute('x', x);
            return this;
        }

        setY(y) {
            this.setAttribute('y', y);
            return this;
        }

        setPosition(x, y) {
            this
                .setX(x)
                .setY(y);
            return this;
        }
        
        setWidth(width) {
            this.setAttribute('width', width);
            return this;
        }

        getWidth() {
            return this.getAttribute('width');
        }

        setHeight(height) {
            this.setAttribute('height', height);
            return this;
        }

        getHeight() {
            return this.getAttribute('height');
        }
    }
    
    class SVGElementG extends DrawingFactory {
        constructor (x, y, parent) {
            super('g', parent);
            this.setPosition(x, y);
        }

        setPosition(x, y) {
            this.setAttribute('transform', 'translate(' + x + ',' + y + ')');
            return this;
        }
    }

    class SVGElementSymbol extends DrawingFactory {
        constructor (id, parent) {
            super('symbol', parent);
            this.setId(id);
        }

        setId(id) {
            this.setAttribute('id', id);
        }

        getId() {
            return this.getAttribute('id');
        }

        use(x, y, width, height) {
            return new SVGElementUse(this.getId(), x, y, width, height, this.parent);
        }
    }

    /* ___ SVG CUSTOM ELEMENTS ___ */

    class SVGElementDragger extends SVGElementG {
        constructor (x, y, text, parent) {
            super(x, y, parent);
            this.text = text;
            this._create();
        }

        _create () {
            this.addClass('dragger');
            this.setAsElementDragger(this.parent);
            this.addRectRounded(0, 0, 30, 30, 3, 3);
            this.textelem = this.addText(10, 20, this.text);
        }
    }

    class SVGElementButton extends SVGElementG {
        constructor (x, y, text, func, parent) {
            super(x, y, parent);
            this.text = text;
            this.func = func;
            this._create();
        }

        _create() {
            this.addClass('button');
            this.addOnClick(this.func);
            this.addRect(0, 0, 30, 30);
            this.textelem = this.addText(10, 20, this.text);
        }
    }

    class SVGElementPopup extends SVGElementG {
        constructor (x, y, parent) {
            super(x, y, parent);
            this._create();
        }

        _create() {
            this.addClass('popup');
            this.addRect(0, 0, 100, 100);
            this.addButton(60, 10, 'X', () => this.hide()); // add popup close button
            this.hide(); // hide element on default
        }

        show () {
            this.append();
            return this;
        }

        hide () {
            this.remove();
            return this;
        }
    }

    class SVGElementTrafficlightSingle extends SVGElementG {
        constructor (x, y, parent) {
            super(x, y, parent);
            this._create();
        }

        _create() {
            this.addClass('trafficlight');
            this.light = this.addCircle(20, 35, 12);
        }

        off() {
            this.light.removeClass('red');
            this.light.removeClass('yellow');
            this.light.removeClass('green');
            return this;
        }

        red() {
            this.off();
            this.light.addClass('red');
            return this;
        }

        yellow() {
            this.off();
            this.light.addClass('yellow');
            return this;
        }

        green() {
            this.off();
            this.light.addClass('green');
            return this;
        }
    }

    class SVGElementTrafficlight extends SVGElementG {
        constructor (x, y, parent) {
            super(x, y, parent);
            this._create();
        }

        _create() {
            this.addClass('trafficlight');
            this.addRectRounded(5, 20, 30, 90, 5, 5);
            this.lights = {};
            this.lights.red = this.addCircle(20, 35, 12);
            this.lights.yellow = this.addCircle(20, 65, 12);
            this.lights.green = this.addCircle(20, 95, 12);
        }

        off() {
            this.lights.red.removeClass('red');
            this.lights.yellow.removeClass('yellow');
            this.lights.green.removeClass('green');
            return this;
        }

        red() {
            this.off();
            this.lights.red.addClass('red');
            return this;
        }

        yellow() {
            this.off();
            this.lights.yellow.addClass('yellow');
            return this;
        }

        green() {
            this.off();
            this.lights.green.addClass('green');
            return this;
        }
    }

    class SVGElementChart extends SVGElementG {
        constructor (x, y, parent) {
            super(x, y, parent);
            this._create();
        }

        _create () {
            this.addClass('chart');
        }
    }

    class SVGElementChartLine extends SVGElementChart {
        constructor (x, y, points, parent) {
            super(x, y, parent);
            this.addPoints(points);
        }

        _create () {
            // TODO: remove magic numbers
            super._create();
            this.addClass('chart-line');
            this.canvas = this.addRect(5, 5, 300, 200).addClass('chart-canvas');
            this.axisX = this.addLine(15, 195, 295, 195);
            this.axisY = this.addLine(15, 15, 15, 195);
            this.graph = this.addPolyline([]).addClass('chart-graph');
        }

        addPoints (points) {
            // TODO: remove magic numbers
            points.forEach(point => {
                const x = 15 + point[0];
                const y = 195 - point[1];
                this.addPoint(x, y);
            });
            return this;
        }

        addPoint (x, y) {
            this.graph.addPoint(x, y);
            return this;
        }
    }

    /* ___ CONNECTOR ___ */

    class Connector {
        constructor () {}

        xhr (method, url, successHandler) {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.responseType = 'json';
            xhr.addEventListener('load', (event) => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    successHandler(xhr.response);
                } else {
                    console.warn(xhr.statusText, xhr.responseText);
                }
            });
            xhr.send();
        }

        read (url, successHandler) {
            return this.xhr('GET', url, successHandler);
        }

        write () {
            return this.xhr('POST', url, successHandler);
        }
    }

    class FreemoveConnector extends Connector {
        constructor (app) {
            super();
            this.app = app;
        }

        read () {
            const onSuccess = (function onSuccess (response) {
                this.update(response);
            }).bind(this.app);

            return super.read(CONFIG.connect.url, onSuccess);
        }

        write () {
            return super.write(CONFIG.connect.url, (response) => { });
        }

        autoUpdate () {
            this.updater = setInterval(() => this.read(), CONFIG.connect.interval);
            return this;
        }

        stopUpdate () {
            clearInterval(this.updater);
            return this;
        }
    }

    /* __ STORAGE __ */

    class CentralStorage {
        constructor (sources, machines, sinks) {
            CentralStorage.instance = this;
            this.sources = sources;
            this.machines = machines;
            this.sinks = sinks;
        }

        static getInstance () {
            return CentralStorage.instance;
        }

        findById (resourceId) {
            // find a resource by id in sinks, sources or machines
            return this.machines.getById(resourceId) ||
                this.sources.getById(resourceId) ||
                this.sinks.getById(resourceId);
        }
    }

    class Storage {
        constructor (drawing) {
            this.drawing = drawing;
            this.elements = new Array();
        }

        add (element) {
            this.elements.push(element);
            return this;
        }

        get (element) {
            return this.elements.find((entry) => (element.id === entry.id));
        }

        getById (id) {
            return this.elements.find((entry) => (id === entry.id));
        }

        has (element) {
            return (undefined !== this.get(element));
        }

        remove (element) {
            this.elements = this.elements.filter((entry) => (element.id !== entry.id));
            return this;
        }

        update (data) {
            this
                ._destroyDeprecated(data)
                ._addNew(data)
                ._updateElements(data);
        }

        _updateElements (data) {
            this.elements.forEach((element) => {
                const elementData = data.find((entry) => (element.id === entry.id));
                element.update(elementData);
            });

            return this;
        }

        _findDeprecated (data) {
            let elements = [];

            this.elements.forEach((element) => {
                if (undefined === data.find((entry) => (element.id === entry.id))) {
                    elements.push(element);
                }
            });

            return elements;
        }

        _removeDeprecated (data) {
            this._findDeprecated(data).forEach((element) => this.remove(element));
            return this;
        }

        _destroyDeprecated (data) {
            this._findDeprecated(data).forEach((element) => {
                this.remove(element);
                element.destroy();
            });

            return this;
        }

        _findNew (data) {
            let elements = [];
            
            data.forEach((element) => {
                if (undefined === this.elements.find((entry) => (element.id === entry.id))) {
                    elements.push(element);
                }
            });
            
            return elements;
        }

        _addNew (data) { }
    }

    class StorageMachine extends Storage {
        constructor (drawing) {
            super(drawing);
        }

        _addNew (data) {
            super._addNew(data);
            this._findNew(data).forEach((element) => this.elements.push(new Machine(element.id, this.drawing.element)));
            return this;
        }
    }

    class StorageSource extends Storage {
        constructor (drawing) {
            super(drawing);
        }

        _addNew (data) {
            super._addNew(data);
            this._findNew(data).forEach((element) => this.elements.push(new Source(element.id, this.drawing.element)));
            return this;
        }
    }

    class StorageSink extends Storage {
        constructor (drawing) {
            super(drawing);
        }

        _addNew (data) {
            super._addNew(data);
            this._findNew(data).forEach((element) => this.elements.push(new Sink(element.id, this.drawing.element)));
            return this;
        }
    }

    class StorageTransport extends Storage {
        constructor (drawing, machines) {
            super(drawing);
        }

        _addNew (data) {
            super._addNew(data);
            this._findNew(data).forEach((element) => this.elements.push(new Transport(element.id, this.drawing.element)));
            return this;
        }
    }

    class StorageProduct extends Storage {
        constructor (drawing) {
            super(drawing);
        }

        _addNew (data) {
            super._addNew(data);
            this._findNew(data).forEach((element) => this.elements.push(new Product(element.id, this.drawing.element)));
            return this;
        }
    }

    class StorageRoute extends Storage {
        constructor (drawing) {
            super(drawing);
        }

        _addNew (data) {
            super._addNew(data);
            this._findNew(data).forEach((element) => this.elements.push(new Route(element.id, this.drawing.element)));
            return this;
        }
    }

    /* ___ RESOURCE ___ */

    class Resource extends SVGElementGroup {
        constructor (id, parent) {
            super(0, 0, parent);
            this.id = id;
            this.guiElements = {};
        }

        update (data) {
            this.setId(data.id);
            return this;
        }
        
        setId (id) {
            this.id = id;
            return this;
        }

        destroy () {
            this.remove();
            return this;
        }
    }

    class ActiveResource extends Resource {
        constructor (id, parent) {
            super(id, parent);
            this._createGUIElement();
        }

        _createGUIElement (imgSrc) {
            this.setWidth(CONFIG.svg.guielements.resource.width);
            this.setHeight(CONFIG.svg.guielements.resource.height);
            this.guiElements.image = this.addImage(0, 0, 100, 100, imgSrc);
            this.guiElements.name = this.addText(0, 110, '');
        }

        update (data) {
            super.update(data);
            this
                .setName(data.name)
                .setCurrentProductId(data.currentProductId);

            return this;
        }
        
        setName (name) {
            this.name = name;
            return this;
        }

        setCurrentProductId (id) {
            this.currentProductId = id;
            return this;
        }
    }

    class InteractiveResource extends ActiveResource {
        constructor (id, parent) {
            super(id, parent);
        }

        _createGUIElement () {

            /* TODO: create design of dragging and popup-open button, design the popup itself and add popup content */

            super._createGUIElement(CONFIG.svg.guielements.resource.types.default.image);

            this.addDragger(0, 0, 'd');
            //this.makeDraggable();

            var popup = this.addPopup(0, 0);

            this.addButton(40, 40, 'o', () => popup.show());
        }

        update (data) {
            super.update(data);
            this.setPosition(data.position.x, data.position.y);
            return this;
        }

        getCoords () {
            const matrix = this.element.style.transform.slice(7, -1).split(',');
            const x = parseFloat(this.getAttribute('x')) + parseFloat(matrix[4]);
            const y = parseFloat(this.getAttribute('y')) + parseFloat(matrix[5]);
            return {x, y};
        }

        getCoordsCenter () {
            const x = this.getCoords().x + this.getWidth() / 2;
            const y = this.getCoords().y + this.getHeight() / 2;
            return {x, y};
        }
    }

    class Source extends InteractiveResource {
        constructor (id, parent) {
            super(id, parent);
        }

        _createGUIElement () {
            super._createGUIElement();
            this.guiElements.image.setSource(CONFIG.svg.guielements.resource.types.source.image);
        }

        setName (name) {
            super.setName(name);
            this.guiElements.name.setText(name);
            return this;
        }
    }

    class Sink extends InteractiveResource {
        constructor (id, parent) {
            super(id, parent);
        }

        _createGUIElement () {
            super._createGUIElement();
            this.guiElements.image.setSource(CONFIG.svg.guielements.resource.types.sink.image);
        }

        setName (name) {
            super.setName(name);
            this.guiElements.name.setText(name);
            return this;
        }
    }

    class Machine extends InteractiveResource {
        constructor (id, parent) {
            super(id, parent);
        }

        _createGUIElement () {
            super._createGUIElement();
            //this.guiElements.trafficlight = this.addTrafficlight(100, 0);
            this.guiElements.trafficlight = this.addTrafficlightSingle(85, -15);
            this.guiElements.workingTime = this.addText(0, 130, '');
            this.guiElements.currentProductId = this.addText(0, 150, '');
        }

        update (data) {
            super.update(data);

            this
                .setStatus(data.status)
                .setType(data.type)
                .setWorkingTime(data.workingTime)
                .setCurrentWorkpackageIdx(data.currentWorkpackageIdx);

            return this;
        }

        setName (name) {
            super.setName(name);
            this.guiElements.name.setText(name);
            return this;
        }

        setStatus (status) {
            this.status = status;

            switch (this.status) {
                case 'error':
                    this.guiElements.trafficlight.red();
                    break;
                case 'idle':
                    this.guiElements.trafficlight.yellow();
                    break;
                case 'running':
                    this.guiElements.trafficlight.green();
                    break;
                default:
                    this.guiElements.trafficlight.off();
                    break;
            }

            return this;
        }

        setType (type) {
            this.type = type;

            if (!CONFIG.svg.guielements.resource.types.hasOwnProperty(type)) type = 'default';

            this.guiElements.image.setSource(CONFIG.svg.guielements.resource.types[type].image);
            return this;
        }

        setWorkingTime (time) {
            this.workingTime = time;
            this.guiElements.workingTime.setText('WT: ' + this.workingTime + ' s');
            return this;
        }

        setCurrentWorkpackageIdx (idx) {
            this.currentWorkpackageIdx = idx;
            return this;
        }

        setCurrentProductId (id) {
            super.setCurrentProductId(id);
            this.guiElements.currentProductId.setText('P.Id: ' + id);
            return this;
        }
    }

    class Transport extends ActiveResource {
        constructor (id, parent) {
            super(id, parent);
            this.route = new TransportRoute(id, parent);
        }

        _createGUIElement () {
            super._createGUIElement();
            this.guiElements.transportationTime = this.addText(0, 0, '');
            //this.guiElements.image.setSource(CONFIG.svg.guielements.resource.types.transport.image);
        }

        _calcPosition () {
            const resourceStartCoords = this.getResourceStart().getCoordsCenter();
            const resourceEndCoords = this.getResourceEnd().getCoordsCenter();
            const x = (resourceStartCoords.x + resourceEndCoords.x - this.getWidth()) / 2;
            const y = (resourceStartCoords.y + resourceEndCoords.y - this.getHeight()) / 2;
            return [x, y];
        }
        
        update (data) {
            this.setResourceIds(data.resourceIds);
            this._updateRoute(); // must be called after updating the machine ids
            this.setPosition(...this._calcPosition()); // must be called after updating the machine ids
            this.setTransportationTime(data.transportationTime);
            return this;
        }

        _updateRoute () {
            this.route.setResourceIds(Object.values(this.resourceIds)); // update the route

            // z-index not working; for that reason we first remove the SVGs and re-append it afterwards;
            // with this approach we have a reordered stack with the route SVGs as lowest z-indexes (= background)
            this.remove().append();

            return this;
        }

        setResourceIds (resourceIds) {
            this.resourceIds = resourceIds;
            return this;
        }

        getResourceStart () {
            return CentralStorage.getInstance().findById(this.resourceIds[0]);
        }

        getResourceEnd () {
            return CentralStorage.getInstance().findById(this.resourceIds[1]);
        }

        setTransportationTime (time) {
            this.transportationTime = time;
            this.guiElements.transportationTime
                .setText('TT: ' + time + ' s')
                .setX((CONFIG.svg.guielements.resource.width - this.guiElements.transportationTime.getWidth()) / 2)  // horizontal text alignment
                .setY(CONFIG.svg.guielements.resource.height / 2); // vertical text alignment
            return this;
        }
    }

    class Product extends Resource {
        constructor (id, parent) {
            super(id, parent);
            this.route = new Route(id, parent);
            this.remove(); // at the moment we don't need a GUI representation of products
        }
        
        update (data) {
            this
                .setId(data.id)
                .setName(data.name)
                .setResourceIds(data.route)
                ._updateRoute(); // must be called after updating the resource ids
            return this;
        }
        
        setName (name) {
            this.name = name;
            return this;
        }

        setResourceIds (resourceIds) {
            this.resourceIds = resourceIds;
            return this;
        }

        _updateRoute () {
            this.route.setResourceIds(this.resourceIds); // update the route
            return this;
        }
		
		destroy () {
            // super.destroy(); // commented out because: at the moment we don't need a GUI representation of products (@see constructor)
            this.route.destroy();
		}
    }

    class Route extends Resource {
        constructor (id, parent) {
            super(id, parent);
            this._createGUIElement();
        }

        _createGUIElement () {
            this.addClass('route');
            this.guiElements.route = this.addPolyline("");
            this.guiElements.route.element.style.stroke = Utils.getRandomColor();
        }

        getResources () {
            let resources = [];
            this.resourceIds.forEach((id) => resources.push(CentralStorage.getInstance().findById(id)));
            return resources;
        }

        setResourceIds (resourceIds) {
            this.resourceIds = resourceIds;
            this.guiElements.route.resetPoints();
            this.getResources().forEach((resource) => {
                const x = resource.getCoords().x + resource.getWidth() / 2;
                const y = resource.getCoords().y + resource.getHeight() / 2;
                this.guiElements.route.addPoint(x, y);
            });

            // z-index not working; for that reason we first remove the machine SVGs and re-append it afterwards;
            // with this approach we have a reordered stack with the route SVGs as lowest z-indexes (= background)
            this.getResources().forEach((resource) => resource.remove().append());

            return this;
        }
        
        update (data) {
            this
                .setId(data.id)
                .setResourceIds(data.resourceIds);
            
            return this;
        }
    }

    class TransportRoute extends Route {
        constructor (id, parent) {
            super(id, parent);
            this.addClass('transport');
        }
    }

    /* ___ APP ___ */

    class App extends DOMElement {
        constructor (parent) {
            super(CONFIG.app.element, parent);
        }

        run () {}
    }

    class FullScreenApp extends App {
        constructor (parent) {
            super(parent);
        }

        run () {
            super.run();
            this.requestFullScreen();
        }
    }
    
    /* ___ FREEMOVE ___ */

    class FreemoveApp extends FullScreenApp {
        constructor (parent) {
            super(parent);
            this.setId(CONFIG.app.id);
            this._createLauncher();
        }

        _createLauncher() {
            var launcher;

            switch (CONFIG.app.launcher.type) {
                case 'button':
                    launcher = new DOMElementButton(this.element);
                    launcher.addText(CONFIG.app.launcher.text);
                    break;
                case 'image':
                    launcher = new DOMElementImage(this.element);
                    launcher.setSource(CONFIG.app.launcher.src);
                    break;
            }
            
            launcher
                .setId(CONFIG.app.launcher.id)
                .setClass(CONFIG.app.launcher.class)
                .addOnClick((event) => {
                    launcher.remove();
                    this.run();
                    event.preventDefault();
                });
        }

        run () {
            super.run();

            this.drawing = new Drawing(this.element);
            this.machines = new StorageMachine(this.drawing);
            this.sources = new StorageSource(this.drawing);
            this.sinks = new StorageSink(this.drawing);
            this.transports = new StorageTransport(this.drawing);
            this.products = new StorageProduct(this.drawing);
            //this.routes = new StorageRoute(this.drawing);

            new CentralStorage(this.sources, this.machines, this.sinks); // TODO: having a central storage is not best practice; use DI, Services or something similar instead

            this.connector = new FreemoveConnector(this);
            this.connector.autoUpdate();

            // chart test: DELETE!
            const asPopup = false;
            const chartTest = asPopup ? this.drawing.addPopup(5, 5) : this.drawing;
            if (asPopup) this.drawing.addButton(5, 5, 'c', () => { chartTest.show() });
            chartTest.addChartLine(5, 30, [[50, 30], [100, 50], [150, 100], [200, 80], [250, 150]]);
        }

        update (state) {
            if (CONFIG.app.debug) console.log(state);
            if (!CONFIG.app.autoUpdate) this.connector.stopUpdate(); // stopping the automatic update interval or just initializing the app is the same

            this.machines.update(state.machines);
            this.sources.update(state.sources);
            this.sinks.update(state.sinks);
            this.transports.update(state.transports);
            this.products.update(Object.values(state.products)); // TODO: remove keys from json import and not here
            //this.routes.update(state.routes);
        }
    }
                    
    /* ___ ENTRY POINT___ */

    document.addEventListener('DOMContentLoaded', () => {
        const APP_PARENT = document.querySelector(CONFIG.app.parent);
        const app = new FreemoveApp(APP_PARENT);
        //app.run();
    });
})();