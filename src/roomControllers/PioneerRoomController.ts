import { creepBlueprints } from "creeps/CreepBlueprints";
import { CreepControllerFactory } from "creeps/CreepControllerFactory";
import { CreepCreationController } from "creeps/CreepCreationController";
import { CreepRoleReassignmentController } from "creeps/CreepRoleReassignmentController";
import * as _ from "lodash";
import { CreepCreationRequest } from "types/creeps/CreepCreationRequest";
import { CreepRole } from "types/creeps/CreepRole";

class PioneerRoomController {
    private room: Room;

    constructor(room: Room) {
        this.room = room;
    }

    public run() {

        // TODO: use dependency injection to get these
        if (this.room.memory.spawnQueue === undefined) {
            this.room.memory.spawnQueue = [];
        }

        const creeps = this.room.find(FIND_MY_CREEPS);
        const spawnQueue = this.room.memory.spawnQueue as CreepCreationRequest[];
        const creepCreationController = new CreepCreationController(
            this.room,
            undefined,
            undefined,
            spawnQueue,
            ...this.room.find(FIND_MY_SPAWNS)
        );


        creepCreationController.setTargetCount("basicHarvester", 2);
        creepCreationController.setTargetCount("basicBuilder", 2);
        creepCreationController.setTargetCount("basicUpgrader", 2);

        creepCreationController.run();

        const creepRoleReassignmentController = new CreepRoleReassignmentController(this.room, creeps);
        creepRoleReassignmentController.run();

        const creepControllerFactory = new CreepControllerFactory();
        for (const creep of creeps) {
            const effectiveRole = (creep.memory.actingRole ?? creep.memory.role) as CreepRole;
            const creepController = creepControllerFactory.getController(effectiveRole, this.room);
            creepController.run(creep);
        }
    }
}

export default PioneerRoomController;
