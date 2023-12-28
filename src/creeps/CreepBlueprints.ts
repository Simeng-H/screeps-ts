import { CreepBlueprint } from "types/creeps/CreepBlueprint";
import { CreepRole } from "types/creeps/CreepRole";

export const creepBlueprints: Record<string, CreepBlueprint> = {
    basicHarvester: {
        role: CreepRole.Harvester,
        body: [WORK, CARRY, MOVE]
    },
    basicBuilder: {
        role: CreepRole.Builder,
        body: [WORK, CARRY, MOVE]
    },
    basicUpgrader: {
        role: CreepRole.Upgrader,
        body: [WORK, CARRY, MOVE]
    },
}

