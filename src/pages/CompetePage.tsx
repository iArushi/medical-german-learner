import { useEffect, useState } from 'react'

import { COMPETE_CONFIG } from '../config/competeConfig'

import { ConnectIncomingCard } from '../components/compete/ConnectIncomingCard'

import { ConnectOutgoingList } from '../components/compete/ConnectOutgoingList'

import { HeadToHeadCard } from '../components/compete/HeadToHeadCard'

import { LeaderboardList } from '../components/compete/LeaderboardList'

import { Badge } from '../components/ui/Badge'

import { Card } from '../components/ui/Card'

import { EmptyState } from '../components/ui/EmptyState'

import { FeedbackToast } from '../components/ui/FeedbackToast'

import { PageSection } from '../components/ui/PageSection'

import { buildCompeteGroups } from '../lib/competeGroups'

import { isLearnerBlocked } from '../storage/competeStorage'

import {

  acceptConnectRequest,

  blockLearner,

  countActiveOutgoing,

  declineConnectRequest,

  expireOutgoingRequestForDemo,

  getCompeteState,

  refreshPlayerHeadToHeadScores,

  reportLearner,

  sendConnectRequest,

} from '../storage/competeStorage'

import { getSkillStreakViewFromStorage, getUserProgress } from '../storage/userProgress'



export function CompetePage() {

  const [ready, setReady] = useState(false)

  const [revision, setRevision] = useState(0)

  const [toast, setToast] = useState<string | null>(null)

  void revision



  useEffect(() => {

    const t = window.setTimeout(() => setReady(true), 120)

    return () => window.clearTimeout(t)

  }, [])



  useEffect(() => {

    if (!toast) return

    const t = window.setTimeout(() => setToast(null), 3200)

    return () => window.clearTimeout(t)

  }, [toast])



  if (!ready) {

    return (

      <div className="flex min-h-full flex-col px-4 pb-4 pt-6">

        <h1 className="text-xl font-bold text-text">Compete</h1>

        <p className="mt-6 text-sm text-text-muted">Loading your group…</p>

      </div>

    )

  }



  refreshPlayerHeadToHeadScores()

  const state = getCompeteState()

  const progress = getUserProgress()

  const streakView = getSkillStreakViewFromStorage()

  const localStreak = streakView.isBroken ? 0 : streakView.count

  const profile = state.profile



  const groups = buildCompeteGroups(

    localStreak,

    progress.completedLevelIds.length,

    profile.alias,

    profile.avatar,

    state.blockedLearnerIds,

  )



  const activeOutgoing = countActiveOutgoing(state)

  const maxOutgoing = COMPETE_CONFIG.maxOutgoingConnectRequests

  const connectSlotsLeft = Math.max(0, maxOutgoing - activeOutgoing)

  const canSendMore = connectSlotsLeft > 0



  const bump = () => setRevision((n) => n + 1)



  const handleConnect = (learnerId: string) => {

    const sent = sendConnectRequest(learnerId)

    if (sent) {

      setToast('Connect request sent.')

      bump()

    } else {

      setToast('Could not send request. Try again later.')

    }

  }



  const handleBlock = (learnerId: string, alias: string) => {

    blockLearner(learnerId)

    setToast(`Blocked ${alias}. They were removed from your group.`)

    bump()

  }



  const handleReport = (learnerId: string, alias: string) => {

    reportLearner(learnerId)

    setToast(`Reported ${alias}. Thank you — saved in this demo.`)

    bump()

  }



  const incoming = state.incomingRequests.filter(

    (r) => r.status !== 'declined' && !isLearnerBlocked(r.fromLearnerId),

  )

  const outgoing = state.outgoingRequests

  const headToHeads = state.headToHeads.filter((m) => !isLearnerBlocked(m.opponentId))



  const safetyProps = { onBlock: handleBlock, onReport: handleReport }

  const listProps = {

    connectSlotsLeft,

    connectSlotsMax: maxOutgoing,

    onConnect: handleConnect,

    connectDisabled: !canSendMore,

    onConnectDisabledClick: () =>

      setToast(`You can only send ${maxOutgoing} Connect requests at a time.`),

    ...safetyProps,

  }



  return (

    <div className="flex min-h-full flex-col px-4 pb-4 pt-6">

      <h1 className="text-xl font-bold text-text">Compete</h1>

      <Card className="mt-2" padding="sm" variant="accent">

        <p className="text-xs leading-relaxed text-text">

          Anonymous avatars and generated aliases only — no real names or personal details in this

          demo.

        </p>

      </Card>



      <Card className="mt-4" padding="sm" variant="flat">

        <div className="flex flex-wrap items-center justify-between gap-2">

          <p className="text-sm font-bold text-text">Connect requests</p>

          <Badge variant="accent">

            {connectSlotsLeft} of {maxOutgoing} left

          </Badge>

        </div>

        <p className="mt-1 text-xs text-text-muted">

          Pending requests expire after {COMPETE_CONFIG.connectExpireDays} days.

        </p>

      </Card>



      {groups.mainGroup.length > 0 ? (

        <PageSection title={`Your group · ranked (${groups.mainGroup.length})`}>

          <LeaderboardList entries={groups.mainGroup} {...listProps} />

        </PageSection>

      ) : (

        <PageSection title="Your group">

          <EmptyState

            title="No one in your group"

            description="Block less, or change your streak by playing levels to join a different band."

          />

        </PageSection>

      )}



      {groups.newLearnersGroup.length > 0 ? (

        <PageSection title="New learners" subtitle="Short streaks · separate band">

          <LeaderboardList entries={groups.newLearnersGroup} {...listProps} />

        </PageSection>

      ) : null}



      <PageSection title="Incoming Connect">

        {incoming.length === 0 ? (

          <EmptyState
            icon="🤝"
            title="No connections yet"
            description="Tap Connect on someone in your group. Only anonymous aliases and avatars are shown."
          />

        ) : (

          <div className="flex flex-col gap-2">

            {incoming.map((request) => (

              <ConnectIncomingCard

                key={request.id}

                request={request}

                onAccept={() => {

                  if (acceptConnectRequest(request.id)) {

                    setToast('Connect accepted. Head to head is ready.')

                    bump()

                  }

                }}

                onDecline={() => {

                  declineConnectRequest(request.id)

                  setToast('Connect request declined.')

                  bump()

                }}

                {...safetyProps}

              />

            ))}

          </div>

        )}

      </PageSection>



      <PageSection title="Sent Connect">
        {outgoing.filter((r) => !isLearnerBlocked(r.toLearnerId)).length === 0 ? (
          <EmptyState
            icon="📤"
            title="No outgoing requests"
            description="When you send a Connect request, it will appear here with pending or accepted status."
          />
        ) : (
        <ConnectOutgoingList

          requests={outgoing}

          onSimulateExpire={(id) => {

            expireOutgoingRequestForDemo(id)

            setToast('Request marked expired (demo).')

            bump()

          }}

          {...safetyProps}

        />
        )}

      </PageSection>



      <PageSection title="Head to head">

        {headToHeads.length === 0 ? (

          <EmptyState

            title="No matches yet"

            description="Accept an incoming Connect request to compare scores on the same level."

          />

        ) : (

          <div className="flex flex-col gap-3">

            {headToHeads.map((match) => (

              <HeadToHeadCard key={match.id} match={match} {...safetyProps} />

            ))}

          </div>

        )}

      </PageSection>



      <FeedbackToast message={toast} />

    </div>

  )

}


