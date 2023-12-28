import { creepBlueprints } from "creeps/CreepBlueprints";
import { CreepControllerFactory } from "creeps/CreepControllerFactory";
import { CreepCreationController } from "creeps/CreepCreationController";
import * as _ from "lodash";
import { CreepCreationRequest } from "types/creeps/CreepCreationRequest";
import { CreepRole } from "types/creeps/CreepRole";

class PioneerRoomController {
    private room: Room;

    constructor(room: Room) {
        this.room = room;
    }

    public run() {
        if (!Memory.spawnQueue) {
            Memory.spawnQueue = [];
        }
        const creeps = this.room.find(FIND_MY_CREEPS);
        const spawnQueue = Memory.spawnQueue as CreepCreationRequest[];
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

        const creepControllerFactory = new CreepControllerFactory();
        for (const creep of creeps) {
            const role = creep.memory.role as CreepRole;
            const creepController = creepControllerFactory.getController(role, this.room);
            creepController.run(creep);
        }



    }

    // public run() {
    //     console.log(`Running room controller for room ${this.room.name}`);
    //     this.spawnCreepsIfNeeded();
    //     this.controlCreeps();
    //     this.manageConstructionSites();
    //     this.manageStructures();
    // }

    // private spawnCreepsIfNeeded() {
    //     const creeps = this.room.find(FIND_MY_CREEPS);
    //     const harvesters = creeps.filter(creep => creep.memory.role === CreepRole.Harvester);
    //     const builders = creeps.filter(creep => creep.memory.role === CreepRole.Builder);
    //     const upgraders = creeps.filter(creep => creep.memory.role === CreepRole.Upgrader);
    //     const defenders = creeps.filter(creep => creep.memory.role === CreepRole.Defender);
    //     if (harvesters.length < 2) {
    //         this.spawnCreep(CreepRole.Harvester);
    //     } else if (builders.length < 4) {
    //         this.spawnCreep(CreepRole.Builder);
    //     } else if (upgraders.length < 2) {
    //         this.spawnCreep(CreepRole.Upgrader);
    //     } else if (defenders.length < 4) {
    //         this.spawnCreep(CreepRole.Defender);
    //     }
    // }

    // private spawnCreep(role: CreepRole) {
    //     console.log(`Spawning new creep with role ${role}`);
    //     const spawn = this.room.find(FIND_MY_SPAWNS)[0];
    //     const name = `${role}-${Game.time}`;
    //     if (role === CreepRole.Harvester) {
    //         spawn.spawnCreep([WORK, CARRY, MOVE], name, {
    //             memory: { role: CreepRole.Harvester, room: this.room.name, working: true }
    //         });
    //     } else if (role === CreepRole.Builder) {
    //         spawn.spawnCreep([WORK, CARRY, MOVE], name, {
    //             memory: { role: CreepRole.Builder, room: this.room.name, working: true }
    //         });
    //     } else if (role === CreepRole.Upgrader) {
    //         spawn.spawnCreep([WORK, CARRY, MOVE], name, {
    //             memory: { role: CreepRole.Upgrader, room: this.room.name, working: true }
    //         });
    //     } else if (role === CreepRole.Defender) {
    //         spawn.spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE], name, {
    //             memory: { role: CreepRole.Defender, room: this.room.name, working: true }
    //         });
    //     }
    // }

    // private controlCreeps() {
    //     // Iterate over creeps and assign tasks based on their roles
    //     const creeps = this.room.find(FIND_MY_CREEPS);
    //     for (const creep of creeps) {
    //         if (creep.memory.role === CreepRole.Harvester) {
    //             this.harvest(creep);
    //         } else if (creep.memory.role === CreepRole.Builder) {
    //             this.build(creep);
    //         } else if (creep.memory.role === CreepRole.Upgrader) {
    //             this.upgrade(creep);
    //         } else if (creep.memory.role === CreepRole.Defender) {
    //             this.defend(creep);
    //         }
    //     }
    // }

    // private manageConstructionSites() {
    //     const towers = this.room.find(FIND_MY_STRUCTURES, {
    //         filter: structure => structure.structureType === STRUCTURE_TOWER
    //     });

    //     if (towers.length === 0) {
    //         this.addTowerConstructionSite();
    //     }
    //     const constructionSites = this.room.find(FIND_MY_CONSTRUCTION_SITES);

    //     if (constructionSites.length === 0) {
    //         this.addExtensionConstructionSite();
    //     }
    // }

    // private manageStructures() {
    //     const towers = this.room.find(FIND_MY_STRUCTURES, {
    //         filter: structure => structure.structureType === STRUCTURE_TOWER
    //     });

    //     for (let tower of towers) {
    //         tower = tower as StructureTower;
    //         const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //         if (closestHostile) {
    //             tower.attack(closestHostile);
    //         }
    //     }
    // }

    // private addTowerConstructionSite() {
    //     const spawns = this.room.find(FIND_MY_SPAWNS);

    //     if (spawns.length < 1) {
    //         throw new Error("No spawns found in room");
    //     }

    //     const spawn = spawns[0];
    //     const spawnPos = spawn.pos;

    //     const towerPos = new RoomPosition(spawnPos.x + 2, spawnPos.y, spawnPos.roomName);

    //     this.room.createConstructionSite(towerPos, STRUCTURE_TOWER);
    // }

    // private addExtensionConstructionSite() {
    //     const spawns = this.room.find(FIND_MY_SPAWNS);

    //     if (spawns.length > 0) {
    //         const spawn = spawns[0];
    //         const spawnPos = spawn.pos;
    //         const x = spawnPos.x;
    //         const y = spawnPos.y;
    //         const room = this.room;
    //         const terrain = this.room.getTerrain();
    //         const sites = [];

    //         for (let i = x - 1; i <= x + 1; i++) {
    //             for (let j = y - 1; j <= y + 1; j++) {
    //                 if (terrain.get(i, j) !== TERRAIN_MASK_WALL) {
    //                     sites.push(new RoomPosition(i, j, room.name));
    //                 }
    //             }
    //         }

    //         const site = _.sample(sites);

    //         if (site) {
    //             room.createConstructionSite(site, STRUCTURE_EXTENSION);
    //         }
    //     }
    // }

    // // Define behavior for each role
    // private harvest(creep: Creep) {
    //     // Harvesting behavior
    //     if (creep.memory.working && creep.store.energy === 0) {
    //         creep.memory.working = false;
    //     } else if (!creep.memory.working && creep.store.energy === creep.store.getCapacity()) {
    //         creep.memory.working = true;
    //     }

    //     if (creep.memory.working) {
    //         const target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    //             filter: structure => {
    //                 return (
    //                     (structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_EXTENSION) &&
    //                     structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    //                     );
    //                 }
    //             });
    //             if (target) {
    //                 if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    //                     creep.moveTo(target);
    //                 }
    //             }

    //         } else {
    //             const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    //             if (source) {
    //                 if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
    //                     creep.moveTo(source);
    //                 }
    //             }
    //         }
    //     }

    //     private build(creep: Creep) {
    //         // Building behavior
    //         if (creep.memory.working && creep.store.energy === 0) {
    //             creep.memory.working = false;
    //         } else if (!creep.memory.working && creep.store.energy === creep.store.getCapacity()) {
    //             creep.memory.working = true;
    //         }

    //         if (creep.memory.working) {
    //             const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    //             if (target) {
    //                 if (creep.build(target) === ERR_NOT_IN_RANGE) {
    //                     creep.moveTo(target);
    //                 }
    //             } else {
    //                 const alt_target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    //                     filter: structure => {
    //                         return (
    //                             (structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_EXTENSION) &&
    //                             structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    //                             );
    //                         }
    //                     });
    //                     if (alt_target) {
    //                         if (creep.transfer(alt_target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    //                             creep.moveTo(alt_target);
    //                         }
    //                     }
    //             }
    //         } else {
    //             const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    //             if (source) {
    //                 if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
    //                     creep.moveTo(source);
    //                 }
    //             }
    //         }
    //     }

    //     private upgrade(creep: Creep) {
    //         // Upgrading behavior
    //         if (creep.memory.working && creep.store.energy === 0) {
    //             creep.memory.working = false;
    //         } else if (!creep.memory.working && creep.store.energy === creep.store.getCapacity()) {
    //             creep.memory.working = true;
    //         }

    //         if (creep.memory.working) {
    //             if (creep.upgradeController(creep.room.controller as StructureController) === ERR_NOT_IN_RANGE) {
    //                 creep.moveTo(creep.room.controller as StructureController);
    //             }
    //         } else {
    //             const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    //             if (source) {
    //                 if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
    //                     creep.moveTo(source);
    //                 }
    //             }
    //         }
    //     }

    //     private defend(creep: Creep) {
    //         // Defending behavior
    //         const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //         if (target) {
    //             if (creep.rangedAttack(target) === ERR_NOT_IN_RANGE) {
    //                 creep.moveTo(target);
    //             }
    //         }
    //     }
}

export default PioneerRoomController;
