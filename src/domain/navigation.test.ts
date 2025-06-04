import { useNavStore } from './navigation'

it('changes page', () => {
  const { setPage } = useNavStore.getState()
  setPage('Goals')
  expect(useNavStore.getState().page).toBe('Goals')
})
