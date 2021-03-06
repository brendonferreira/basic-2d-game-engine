import {ElementsContext} from "../../engine/context/ElementsContext";
import {Vector2} from "../../engine/Vector2";
import {MouseController} from "../../engine/components/MouseController";
import {RayTracingRenderer2d} from "../../engine/render/RayTracingRenderer2d";
import {Random2dSurface} from "../../engine/utils/Random2dSurface";
import {_Element} from "../../engine/Element";
import {Pivot2d} from "../../engine/components/Pivot2d";
import {Position2d} from "../../engine/components/Position2d";
import {Surface2d} from "../../engine/components/Surface2d";
import {Rotation2d} from "../../engine/components/Rotation2d";
import {PentagonSurface} from "../../engine/utils/Pentagon2dSurface";


export class Player2d extends _Element{

    private rotation: Rotation2d;

    constructor(position: Vector2) {
        super({
            position: new Position2d( position.x, position.y ),
            pivot: new Pivot2d( 50, 50 ),
            surface: new Surface2d( PentagonSurface() ),
            rotation: new Rotation2d( 0 )
        });

        this.rotation = this.getComponent<Rotation2d>('rotation');
    }

    update() {

    }
}


// ambient