import { inject } from '@adonisjs/core'
import { err, ok, type Result } from '#core/result'
import Talk from '#talks/models/talk'
import { TalkRepository } from '#talks/repositories/talk_repository'
import type { TalkPayload } from '#talks/repositories/talk_repository'

export interface SaveTalkParams {
  id?: number
  payload: TalkPayload
}

export interface TalkNotFoundError {
  type: 'talk_not_found'
}

export type SaveTalkResult = Result<Talk, TalkNotFoundError>

@inject()
export class SaveTalk {
  constructor(private readonly talks: TalkRepository) {}

  async execute(params: SaveTalkParams): Promise<SaveTalkResult> {
    if (params.id === undefined) {
      return ok(await this.talks.save(new Talk(), params.payload))
    }

    const talk = await this.talks.findById(params.id)

    if (!talk) {
      return err({ type: 'talk_not_found' })
    }

    return ok(await this.talks.save(talk, params.payload))
  }
}
