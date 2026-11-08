import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageShell'
import MagneticButton from '../components/MagneticButton'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-[80vh]">
      <PageHeader eyebrow="Error 404" title="Bad" outline="pull">
        This page isn't in the vault. Maybe it got traded away.
      </PageHeader>
      <div className="px-5 pb-32 md:px-10">
        <MagneticButton onClick={() => navigate('/')}>Back to the vault</MagneticButton>
      </div>
    </div>
  )
}
