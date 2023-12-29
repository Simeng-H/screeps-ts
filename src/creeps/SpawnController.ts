import { CreepCreationRequest } from "types/creeps/CreepCreationRequest";
import CreepUtil from "utils/CreepUtil";
import * as _ from "lodash";
import { TickRunnable } from "types/TickRunnable";

/**
 * A controller for spawning creeps at a specific spawn. This controller tries to spawn creeps in the order they are added to the queue in each tick.
 */
export class SpawnController implements TickRunnable {
    private room: Room;
    private spawn: StructureSpawn;
    private queue: CreepCreationRequest[];


    constructor(spawn: StructureSpawn, queue: CreepCreationRequest[], room: Room) {
        this.spawn = spawn;
        this.queue = queue;
        this.room = room;
    }

    public getMaxSpawnableEnergy(): number {
        const extensions = this.room.find(FIND_MY_STRUCTURES, {
            filter: structure => structure.structureType === STRUCTURE_EXTENSION
        }) as StructureExtension[];

        const extensionCapacity = _.sum(extensions.map(extension => extension.store.getCapacity(RESOURCE_ENERGY)));
        const spawnCapacity = this.spawn.store.getCapacity(RESOURCE_ENERGY);
        const totalCapacity = extensionCapacity + spawnCapacity;
        return totalCapacity;
    }

    private popFirstSpawnableRequest(): CreepCreationRequest | null {
        if (this.queue.length === 0) {
            return null;
        }
        const request = _.find(this.queue, request => CreepUtil.calculateBodyCost(request.body) <= this.getMaxSpawnableEnergy());
        console.log(`Popping request ${request?.name} from spawn queue`);
        return request ?? null;
    }

    /**
     * Runs the spawn controller for one tick. If the current spawn is available, the controller will attempt to spawn the next creep in the queue.
     * @remarks This method should be called once per tick.
     */
    public run(): ScreepsReturnCode | null {
        console.log(`Running spawn controller for ${this.spawn.name}`);
        if (this.spawn.spawning) {
            return null;
        }
        if (this.queue.length === 0) {
            return null;
        }
        const request = this.popFirstSpawnableRequest();
        if (request) {
            const result = this.spawn.spawnCreep(request.body, request.name, {
                memory: request.memory
            });
            if (result === OK) {
                _.pull(this.queue, request);
                console.log(`Spawned creep ${request.name}`);
            }
            return result;
        }
        return null;
    }
}
