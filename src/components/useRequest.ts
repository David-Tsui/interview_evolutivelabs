import {
  Ref,
  ref,
  readonly
} from '@vue/composition-api'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

export default async function useAxios<T = any> (
  url: string,
  config?: AxiosRequestConfig
) {
  const response = ref<any>(null) as Ref<AxiosResponse<T> | undefined>
  const data = ref<any>(undefined) as Ref<T | undefined>
  const finished = ref(false)
  const error = ref<AxiosError<T> | undefined>()
  const loading = ref<boolean>(true)

  try {
    const res: AxiosResponse<T> = await axios(url, { ...config })
    response.value = res
    data.value = res.data
    finished.value = true
  } catch (e) {
    error.value = e
    finished.value = true
  } finally {
    loading.value = false
  }

  return {
    response,
    data,
    loading,
    error,
    finished
  }
}
