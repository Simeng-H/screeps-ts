import { CreepController } from "types/creeps/CreepController";

export abstract class BaseCreepController implements CreepController {
    private room: Room;
    constructor(room: Room) {
        this.room = room;
    }
    public abstract run(creep: Creep): void;
}
