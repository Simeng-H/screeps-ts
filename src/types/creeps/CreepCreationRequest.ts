import { CreepBlueprint } from "./CreepBlueprint";
import { CreepBlueprintName } from "./CreepBlueprintName";

export interface CreepCreationRequest extends CreepBlueprint {
    name: string;
    memory: CreepMemory;
}
