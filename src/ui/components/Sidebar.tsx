import { useNavStore, Page } from '../../domain/navigation'

interface Props {
  open: boolean
  onNavigate: () => void
}

const links: { label: string; page: Page }[] = [
  { label: 'Home', page: 'Home' },
  { label: 'Habits', page: 'Habits' },
  { label: 'Projects', page: 'Projects' },
  { label: 'Goals', page: 'Goals' },
]

export default function Sidebar({ open, onNavigate }: Props) {
  const { page, setPage } = useNavStore()
  return (
    <nav
      className={`${open ? 'block' : 'hidden'} md:block bg-gray-800 text-white w-60 p-4 space-y-2`}
    >
      {links.map((l) => (
        <button
          key={l.page}
          onClick={() => {
            setPage(l.page)
            onNavigate()
          }}
          className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-700 ${page === l.page ? 'bg-gray-700' : ''}`}
        >
          {l.label}
        </button>
      ))}
    </nav>
  )
}
