'use client'

import * as React from 'react'
import { CheckCircle2, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getActivePoll, getPastPolls } from '@/lib/poll-data'
import { formatBnDate, toBn } from '@/lib/bn'

type VoteStore = Record<string, Record<string, number>>
type UserVoteStore = Record<string, string>

const VOTE_STORAGE_KEY = 'barta-poll-votes-v1'
const USER_VOTE_STORAGE_KEY = 'barta-poll-user-vote-v1'

const baseVotes: VoteStore = (() => {
  const seed: VoteStore = {}
  for (const poll of [getActivePoll(), ...getPastPolls(20)]) {
    seed[poll.id] = Object.fromEntries(poll.options.map((op) => [op.id, op.votes]))
  }
  return seed
})()

function sumVotes(map: Record<string, number> | undefined) {
  if (!map) return 0
  return Object.values(map).reduce((acc, n) => acc + n, 0)
}

export function PollSection() {
  const activePoll = getActivePoll()
  const pastPolls = getPastPolls(3)

  const [votes, setVotes] = React.useState<VoteStore>(baseVotes)
  const [userVote, setUserVote] = React.useState<UserVoteStore>({})
  const [selectedOption, setSelectedOption] = React.useState('')

  React.useEffect(() => {
    try {
      const storedVotes = window.localStorage.getItem(VOTE_STORAGE_KEY)
      const storedUserVote = window.localStorage.getItem(USER_VOTE_STORAGE_KEY)

      if (storedVotes) {
        const parsed = JSON.parse(storedVotes) as VoteStore
        setVotes((prev) => ({ ...prev, ...parsed }))
      }

      if (storedUserVote) {
        setUserVote(JSON.parse(storedUserVote) as UserVoteStore)
      }
    } catch {
      // ignore local parse errors
    }
  }, [])

  const activeCounts = votes[activePoll.id] ?? {}
  const activeTotal = sumVotes(activeCounts)
  const alreadyVoted = Boolean(userVote[activePoll.id])

  const persistVotes = (nextVotes: VoteStore, nextUserVote: UserVoteStore) => {
    setVotes(nextVotes)
    setUserVote(nextUserVote)
    window.localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(nextVotes))
    window.localStorage.setItem(USER_VOTE_STORAGE_KEY, JSON.stringify(nextUserVote))
  }

  const submitVote = () => {
    if (!selectedOption || alreadyVoted) return

    const nextVotes: VoteStore = {
      ...votes,
      [activePoll.id]: {
        ...(votes[activePoll.id] ?? {}),
        [selectedOption]: ((votes[activePoll.id] ?? {})[selectedOption] ?? 0) + 1,
      },
    }

    const nextUserVote = {
      ...userVote,
      [activePoll.id]: selectedOption,
    }

    persistVotes(nextVotes, nextUserVote)
  }

  return (
    <section className='mx-auto max-w-7xl px-4 py-10 sm:px-6'>
      <div className='flex items-end justify-between border-b-2 border-brand pb-2.5'>
        <h2 className='text-xl font-bold text-foreground'>অনলাইন পোল</h2>
      </div>

      <div className='mt-6 grid gap-6 lg:grid-cols-12'>
        <div className='rounded-xl border border-border/60 bg-secondary/25 p-5 lg:col-span-7'>
          <p className='text-[11px] font-bold uppercase tracking-[0.16em] text-brand'>চলমান পোল</p>
          <h3 className='mt-2 text-lg font-semibold leading-snug text-foreground'>
            {activePoll.question}
          </h3>

          <div className='mt-4 space-y-2.5'>
            {activePoll.options.map((op) => {
              const count = activeCounts[op.id] ?? 0
              const percent = activeTotal ? Math.round((count / activeTotal) * 100) : 0
              const checked = selectedOption === op.id || userVote[activePoll.id] === op.id

              return (
                <label
                  key={op.id}
                  className='block cursor-pointer rounded-md border border-border/60 bg-background p-3 transition-colors hover:border-brand/40'
                >
                  <div className='flex items-center justify-between gap-3'>
                    <div className='flex items-center gap-2'>
                      <input
                        type='radio'
                        name={`poll-${activePoll.id}`}
                        value={op.id}
                        checked={checked}
                        disabled={alreadyVoted}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className='h-4 w-4 accent-red-600'
                      />
                      <span className='text-sm text-foreground'>{op.label}</span>
                    </div>
                    <span className='text-xs font-semibold text-muted-foreground'>{toBn(percent)}%</span>
                  </div>

                  <div className='mt-2 h-2 overflow-hidden rounded-full bg-muted'>
                    <div
                      className='h-full rounded-full bg-brand transition-all duration-300'
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </label>
              )
            })}
          </div>

          <div className='mt-4 flex flex-wrap items-center justify-between gap-3'>
            <p className='text-xs text-muted-foreground'>
              মোট ভোট: <span className='font-semibold text-foreground'>{toBn(activeTotal)}</span>
            </p>

            {alreadyVoted ? (
              <p className='inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600'>
                <CheckCircle2 className='h-4 w-4' />
                আপনি এই পোলে ভোট দিয়েছেন
              </p>
            ) : (
              <Button onClick={submitVote} disabled={!selectedOption}>
                ভোট দিন
              </Button>
            )}
          </div>
        </div>

        <div className='rounded-xl border border-border/60 bg-background p-5 lg:col-span-5'>
          <p className='inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand'>
            <BarChart3 className='h-4 w-4' />
            আগের পোলের ফলাফল
          </p>

          <div className='mt-4 space-y-5'>
            {pastPolls.map((poll) => {
              const counts = votes[poll.id] ?? Object.fromEntries(poll.options.map((op) => [op.id, op.votes]))
              const total = sumVotes(counts)

              return (
                <article key={poll.id} className='border-b border-border/50 pb-4 last:border-b-0 last:pb-0'>
                  <h4 className='text-sm font-semibold leading-snug text-foreground'>{poll.question}</h4>
                  <p className='mt-1 text-[11px] text-muted-foreground'>
                    {formatBnDate(new Date(poll.publishedAt))} · মোট ভোট {toBn(total)}
                  </p>

                  <div className='mt-2.5 space-y-2'>
                    {poll.options.map((op) => {
                      const count = counts[op.id] ?? 0
                      const percent = total ? Math.round((count / total) * 100) : 0

                      return (
                        <div key={op.id}>
                          <div className='mb-1 flex items-center justify-between gap-3 text-xs'>
                            <span className='text-foreground/90'>{op.label}</span>
                            <span className='font-medium text-muted-foreground'>
                              {toBn(percent)}%
                            </span>
                          </div>
                          <div className='h-1.5 overflow-hidden rounded-full bg-muted'>
                            <div className='h-full rounded-full bg-brand/80' style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
