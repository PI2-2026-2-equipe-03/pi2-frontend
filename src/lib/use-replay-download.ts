import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'
import { toast } from 'sonner'

import { resolveMediaUrl } from '@/lib/api/mappers'
import { getReplayDownload } from '@/lib/api/replays'
import {
  getApiErrorMessage,
  isForbiddenError,
  isSessionExpiredError,
} from '@/lib/errors'
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
  // a ref, not mutation.isPending: the toast retry closes over the render
  // that was pending, so a render-time flag would block it forever
  const inFlight = useRef(false)

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
    // option callbacks (not mutate's) so the file is still delivered if the
    // component unmounts mid-request
    onSuccess: (file) => {
      deliverFile(file.url, file.fileName)
      // confirms the delivery, not the tap
      haptic()
      // stable id so repeated downloads replace the toast instead of stacking
      toast.success('Download iniciado', {
        id: `replay-download-${replayId}`,
      })
    },
    onError: (error) => {
      // the global 403 modal / 401 redirect already inform the user
      if (isForbiddenError(error) || isSessionExpiredError(error)) return
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

  function download() {
    if (inFlight.current) return
    inFlight.current = true
    mutation.mutate(undefined, {
      onSettled: () => {
        inFlight.current = false
      },
    })
  }

  return {
    download,
    isPending: mutation.isPending,
    canDownload: Boolean(replayId),
  }
}
