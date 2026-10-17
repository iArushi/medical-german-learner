import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'

/** Global /result route — level results live under /level/:id/result */
export function ResultPage() {
  return (
    <div className="flex min-h-full flex-col px-4 pb-4 pt-6">
      <h1 className="text-xl font-bold text-text">Result</h1>
      <div className="mt-6">
        <EmptyState
          title="Open a level to see results"
          description="Finish Learn, Practise and Improve on a level to view your pass or try again message."
        />
      </div>
      <Link to="/home" className="mt-6 block">
        <Button variant="primary" fullWidth>
          Go to Home
        </Button>
      </Link>
    </div>
  )
}
