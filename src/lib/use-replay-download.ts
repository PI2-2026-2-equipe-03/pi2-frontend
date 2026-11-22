import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { resolveMediaUrl } from '@/lib/api/mappers'
import { getReplayDownload } from '@/lib/api/replays'
import { getApiErrorMessage, isForbiddenError } from '@/lib/errors'
import { useHaptics } from '@/lib/haptics'

// an anchor with `download` suggests the file name and, unlike window.open,
// is not killed by pop-up blockers
function deliverFile(url: string, fileName: string) {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.rel = 'noopener'
  anchor.target = '_blank'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

export function useReplayDownload(replayId: string | undefined) {
  const haptic = useHaptics()

  const mutation = useMutation({
    mutationFn: async () => {
      if (!replayId) throw new Error('Replay sem identificador')
      // /download revalidates expiry and authorization, so it never falls
      // back to the url from the listing
      const response = await getReplayDownload(replayId)
      return {
        url: resolveMediaUrl(response.data.downloadUrl),
        fileName: response.data.fileName ?? `replay-${replayId}.mp4`,
      }
    },
    onSuccess: (file) => {
      deliverFile(file.url, file.fileName)
      haptic()
      toast.success('Download iniciado')
    },
    onError: (error) => {
      // the global 403 modal already informed the user
      if (isForbiddenError(error)) return
      toast.error(
        getApiErrorMessage(error, 'Não foi possível baixar o replay'),
        {
          action: {
            label: 'Tentar de novo',
            onClick: () => download(),
          },
        },
      )
    },
  })

  // a second tap while in flight would deliver the file twice
  function download() {
    if (mutation.isPending) return
    mutation.mutate()
  }

  return { download, isPending: mutation.isPending }
}
