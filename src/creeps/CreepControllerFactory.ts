import { CreepRole } from "types/creeps/CreepRole";
import { CreepController } from "types/creeps/CreepController";
import { HarvesterController } from "creeps/creepControllers/HarvesterController";
import { BuilderController } from "creeps/creepControllers/BuilderController";
import { UpgraderController } from "creeps/creepControllers/UpgraderController";

export type RoleRoomPair = [CreepRole, Room];

export class CreepControllerFactory {
    private controllerCache: Map<RoleRoomPair, CreepController>;

    constructor(controllerCache: Map<RoleRoomPair, CreepController> = new Map()) {
        this.controllerCache = controllerCache;
    }

    public getController(role: CreepRole, room: Room): CreepController {
        const cachedController = this.controllerCache.get([role, room]);
        if (cachedController) {
            return cachedController;
        }
        let controller: CreepController;
        switch (role) {
            case CreepRole.Harvester:
                controller = new HarvesterController(room);
                break;
            case CreepRole.Builder:
                controller = new BuilderController(room);
                break;
            case CreepRole.Upgrader:
                controller = new UpgraderController(room);
                break;
            default:
                throw new Error(`No controller found for role ${role}`);
        }
        this.controllerCache.set([role, room], controller);
        return controller;
    }
}
