import {Vector2} from "../Vector2";
import {Mesh2d} from "../render/Mesh2d";
import {Surface2d} from "../components/Surface2d";

export class RIP {
    private numOfPoints: number;
    private minCoordVal: number;
    private maxCoordVal: number;
    private isIntCoord: boolean;
    constructor(opts) {
        this.numOfPoints = opts.numOfPoints;
        this.minCoordVal = opts.minCoordVal;
        this.maxCoordVal = opts.maxCoordVal;
        this.isIntCoord = !!opts.isIntCoord;
    }

    getPolygonCoord() {
        const points = this.spacePartition(this.getRandomPoints());
        this.sortPoints(points);
        return points;
    }

    getRandomPoints() {
        const points = [];
        const pointSet = {};
        for (let i = 0; i < this.numOfPoints; ) {
            const x = this.getRandomNum(this.minCoordVal, this.maxCoordVal, this.isIntCoord);
            const y = this.getRandomNum(this.minCoordVal, this.maxCoordVal, this.isIntCoord);
            const key = x + '-' + y;
            if (!pointSet[key]) {
                pointSet[key] = true;
                points.push(new Vector2(x, y));
                i++;
            }
        }
        return points;
    }

    getRandomNum(min, max, isInt) {
        if (!isInt) {
            return Math.random() * (max - min) + min;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    spacePartition(points) {
        const firstPoint = points[0];
        const secondIndex = this.getRandomNum(1, this.numOfPoints - 1, true);
        const secondPoint = points[secondIndex];
        this.swapPoints(points, 1, secondIndex);

        let i = 2;
        let j = this.numOfPoints - 1;
        while (i <= j) {
            while (i < this.numOfPoints && this.isToLeftOrOnLine(firstPoint, secondPoint, points[i])) {
                i++;
            }
            while (j > 1 && !this.isToLeftOrOnLine(firstPoint, secondPoint, points[j])) {
                j--;
            }
            if (i <= j) {
                this.swapPoints(points, i, j);
                i++;
                j--;
            }
        }
        this.swapPoints(points, 1, j);
        this.spacePartitionRec(points, 0, j);
        return points;
    }

    spacePartitionRec(points, l, r) {
        if (r > l + 1) {
            const rp = this.getRandomNum(l + 1, r - l - 1, true);
            const firstPoint = points[l];
            const secondPoint = r === this.numOfPoints ? points[0] : points[r];
            const randomStartPoint = this.getRandomPointOnSegment(firstPoint, secondPoint);
            const randomEndPoint = points[rp];
            this.swapPoints(points, l + 1, rp);

            let i = l + 2;
            let j = r - 1;
            const isToLeft = this.isToLeftOrOnLine(randomStartPoint, randomEndPoint, points[l]);

            while (i <= j) {
                while (i < r && this.isToLeftOrOnLine(randomStartPoint, randomEndPoint, points[i]) === isToLeft) {
                    i++;
                }
                while (j > l + 1 && this.isToLeftOrOnLine(randomStartPoint, randomEndPoint, points[j]) !== isToLeft) {
                    j--;
                }
                if (i <= j) {
                    this.swapPoints(points, i, j);
                    i++;
                    j--;
                }
            }
            this.swapPoints(points, l + 1, j);
            this.spacePartitionRec(points, l, j);
            this.spacePartitionRec(points, j, r);
        }
    }

    swapPoints(points, i, j) {
        const tmp = points[i];
        points[i] = points[j];
        points[j] = tmp;
    }

    isToLeftOrOnLine(start, end, point) {
        return this.isLeft(start, end, point) <= 0;
    }

    isLeft(start, end, point) {
        return (end.x - start.x) * (point.y - start.y) - (end.y - start.y) * (point.x - start.x);
    }

    getRandomPointOnSegment(start, end) {
        const randomRatio = Math.random();
        return new Vector2(
            start.x + (end.x - start.x) * randomRatio,
            start.y + (end.y - start.y) * randomRatio
        );
    }

    sortPoints(points) {
        const p0: any = {};
        p0.y = Math.min.apply(null, points.map(p => p.y));
        p0.x = Math.max.apply(null, points.filter( p=> p.y === p0.y).map(p => p.x));
        points.sort((a,b) => {
            const isLeft = this.isLeft(a, b, p0);
            if (isLeft === 0) {
                return distCompare(a, b, p0);
            };
            return isLeft;
        });

        function distCompare(a, b, p0) {
            const distA = (p0.x - a.x) * (p0.x - a.x) + (p0.y - a.y) * (p0.y - a.y);
            const distB = (p0.x - b.x) * (p0.x - b.x) + (p0.y - b.y) * (p0.y - b.y);
            return distA - distB;
        }
    }
}

export function Random2dSurface() {

    const generator = new RIP({
        numOfPoints: 10, // number of points
        minCoordVal: 10, // minimum coordinate value
        maxCoordVal: 110, // maximum coordinate value
    });


    const coords = generator.getPolygonCoord();

    const vertices = []

    for (let i = 1; i < coords.length; i++) {
        vertices.push(new Mesh2d(coords[i - 1], coords[i]))
    }

    vertices.push(new Mesh2d(coords[coords.length - 1], coords[0]))

    return vertices


}