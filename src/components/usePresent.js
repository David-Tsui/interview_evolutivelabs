import { ref } from '@vue/composition-api'

const usePresent = () => {
  const present = ref('backplate-mode') // back-mode / case-mode
  const setPresent = mode => { present.value = mode }
  const togglePresent = () => {
    present.value = present.value === 'backplate-mode' ? 'case-mode' : 'backplate-mode'
  }
  return {
    present,
    setPresent,
    togglePresent
  }
}

export default usePresent
