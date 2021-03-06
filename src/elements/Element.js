const EventEmitter = require('events')

const { angle } = require("../lib/angle");


class _Element {
    
    constructor(position, dimensions) {
        this.position = position;
        this.dimensions = dimensions;
        this.context = null;
        this.messages = new EventEmitter();
    }
    
    setContext(context) {
        this.context = context;
    }

    getContext() {
        if (!this.context) {
            throw new Error("context not found");
        }
        return this.context;
    }

    getCenterPosition() {
        return {
            x: this.position.x + (this.dimensions.x / 2),
            y: this.position.y + (this.dimensions.y / 2),
        };
    }
    
    getDistanceToElement(element) {
        const targetPosition = element.getCenterPosition();
        return this.getDistanceToPosition(targetPosition)
    }
    
    getDistanceToPosition(targetPosition) {
        const selfPosition = this.getCenterPosition();
        const a = targetPosition.x - selfPosition.x;
        const b = targetPosition.y - selfPosition.y;
        return Math.sqrt(a * a + b * b);
    }

    on( ...args ) {
        this.messages.on( ...args )
    }

    emit( ...args ) {
        this.messages.emit(...args);
    }
    
    getAngleTo(position){
        return angle(this.getCenterPosition(), position)
    }

    update() {
    }

    drawLineInside(ctx, angle, size) {
        ctx.beginPath();
        const center = this.getCenterPosition();
        ctx.moveTo(center.x, center.y);
        const borderPosition = {
            x: (center.x) + (Math.cos(angle * Math.PI / 180) * (size)),
            y: (center.y) + (Math.sin(angle * Math.PI / 180) * (size))
        };
        ctx.lineTo(borderPosition.x, borderPosition.y);
        ctx.stroke()
    }

    draw(ctx) {
        const ray = this.dimensions.x / 2;

        ctx.beginPath();
        ctx.arc(this.position.x + ray, this.position.y + ray, ray, 0, 2 * Math.PI);
        ctx.stroke();

        this.drawLineInside(ctx, this.movement.degrees, ray)
        
    }
}


exports._Element = _Element
