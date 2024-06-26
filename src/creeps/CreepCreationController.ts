import { CreepBlueprintName } from "types/creeps/CreepBlueprintName";
import { creepBlueprints } from "./CreepBlueprints";
import { CreepCreationRequest } from "types/creeps/CreepCreationRequest";
import { SpawnController } from "./SpawnController";
import { v4 as uuid } from 'uuid';


export class CreepCreationController {
    private typeToTargetCount: Map<CreepBlueprintName, number>;
    private room: Room;
    private spawnControllers: SpawnController[];
    private spawnQueue: CreepCreationRequest[];

    // cache these for reuse. TODO: use central cache for game state retrieval
    private creeps: Creep[];

    constructor(
        room: Room,
        typeToTergetCount: Map<CreepBlueprintName, number> = new Map(),
        creeps: Creep[] = room.find(FIND_MY_CREEPS),
        spawnQueue: CreepCreationRequest[] = [],
        ...spawns: StructureSpawn[]
    ) {
        this.room = room;
        this.typeToTargetCount = typeToTergetCount;
        this.creeps = creeps;
        this.spawnQueue = spawnQueue;
        if (spawns.length === 0) {
            throw new Error("No spawns provided to CreepCreationController");
        }
        this.spawnControllers = [];
        for (const spawn of spawns) {
            this.spawnControllers.push(new SpawnController(spawn, this.spawnQueue, this.room));
        }
    }

    public setTargetCount(type: CreepBlueprintName, targetCount: number): void {
        this.typeToTargetCount.set(type, targetCount);
    }

    public run(): void {
        this.maintainCreepCounts();
        this.controlSpawns();
    }

    private controlSpawns() : void {
        for (const spawnController of this.spawnControllers) {
            spawnController.run();
        }
    }

    private maintainCreepCounts() : void {
        for (const [blueprintName, count] of this.typeToTargetCount.entries()) {
            const currentCount = this.getCreepCount(blueprintName);
            console.log(`Current count for ${blueprintName}: ${currentCount}, target: ${count}`);
            if (currentCount < count) {
                this.requestSpawn(blueprintName, count - currentCount);
            }
        }
    }

    public requestSpawn(blueprintName: string, count: number = 1) {
        const blueprint = creepBlueprints[blueprintName];
        if (!blueprint) {
            throw new Error(`No creep blueprint found for name ${blueprintName}`);
        }
        if (!this.isSpawnable(blueprint.body)) {
            throw new Error(`Creep body too large to be spawned by spawn`);
        }
        for (let i = 0; i < count; i++) {
            const spawnRequest: CreepCreationRequest = {
                ...blueprint,
                name: `${blueprintName}-${uuid()}`,
                memory: {
                    type: blueprintName,
                    role: blueprint.role,
                    room: this.room.name,
                    working: true
                }
            };
            this.spawnQueue.push(spawnRequest);
        }
    }
    private isSpawnable(body: BodyPartConstant[]): boolean {
        const bodyCost = _.sum(body.map(part => BODYPART_COST[part]));
        const maxSpawnableEnergy = _.max(this.spawnControllers.map(spawnController => spawnController.getMaxSpawnableEnergy()));
        return bodyCost <= maxSpawnableEnergy;
    }

    private getCreepCount(type: CreepBlueprintName): number {
        const aliveCount = _.filter(Memory.creeps, creepMemory => creepMemory.type === type).length;
        const queuedCount = this.spawnQueue.filter(request => request.memory.type === type).length;
        console.log(`Creep count for ${type}: ${aliveCount + queuedCount}, alive: ${aliveCount}, queued: ${queuedCount}`);
        return aliveCount + queuedCount;
    }
}
