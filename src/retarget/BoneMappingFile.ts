import { type SkeletonType } from '../lib/enums/SkeletonType.ts'
import { type TargetBoneMappingType } from './steps/StepBoneMapping.ts'

interface BoneMappingFileShape {
  version: number
  skeleton_type: string
  mapping_type: string
  bone_mappings: Record<string, string>
}

export interface DeserializedMapping {
  mappings: Map<string, string>
  skeleton_type?: SkeletonType
  mapping_type?: TargetBoneMappingType
}

export class BoneMappingFile {
  static readonly VERSION = 1

  static serialize (
    mappings: Map<string, string>,
    skeleton_type: SkeletonType,
    mapping_type: TargetBoneMappingType
  ): string {
    const data: BoneMappingFileShape = {
      version: BoneMappingFile.VERSION,
      skeleton_type,
      mapping_type,
      bone_mappings: Object.fromEntries(mappings)
    }
    return JSON.stringify(data, null, 2)
  }

  static deserialize (json_text: string): DeserializedMapping {
    const parsed = JSON.parse(json_text) as Partial<BoneMappingFileShape>

    if (parsed.bone_mappings === undefined || typeof parsed.bone_mappings !== 'object') {
      throw new Error('Invalid bone mapping file: missing "bone_mappings" object')
    }

    const mappings = new Map<string, string>()
    for (const [target_name, source_name] of Object.entries(parsed.bone_mappings)) {
      if (typeof source_name === 'string') {
        mappings.set(target_name, source_name)
      }
    }

    return {
      mappings,
      skeleton_type: parsed.skeleton_type as SkeletonType | undefined,
      mapping_type: parsed.mapping_type as TargetBoneMappingType | undefined
    }
  }
}
