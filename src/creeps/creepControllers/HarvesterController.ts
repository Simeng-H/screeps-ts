import { BaseCreepController } from "./BaseCreepController";

export class HarvesterController extends BaseCreepController {
    public run(creep: Creep): void {
        if (creep.store.getFreeCapacity() > 0) {
            const sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                creep.say("🔄 harvest");
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
            }
        } else {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        (structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    );
                },
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.say("🔄 transfer");
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
                }
            }
        }
    }
}
