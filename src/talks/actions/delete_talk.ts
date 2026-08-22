import { inject } from '@adonisjs/core'
import { err, ok, type Result } from '#core/result'
import { TalkRepository } from '#talks/repositories/talk_repository'
import type { TalkNotFoundError } from '#talks/actions/save_talk'

export type DeleteTalkResult = Result<null, TalkNotFoundError>

@inject()
export class DeleteTalk {
  constructor(private readonly talks: TalkRepository) {}

  async execute(id: number): Promise<DeleteTalkResult> {
    const talk = await this.talks.findById(id)

    if (!talk) {
      return err({ type: 'talk_not_found' })
    }

    await this.talks.delete(talk)

    return ok(null)
  }
}
